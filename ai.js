/* WeAte AI — A+B+C offline heuristics + optional remote endpoint.
   No API keys in the frontend. Set window.WEATE_AI_ENDPOINT (or
   WEATE_FIREBASE.aiEndpoint) to a Worker/Function that holds the key.
   See AI.md. */
(function () {
  if (window._weateAi) return;
  window._weateAi = 1;

  var DAYS = window.DAYS || ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
  var DLAB = window.DLAB || {
    Ma: "Maandag", Di: "Dinsdag", Wo: "Woensdag", Do: "Donderdag",
    Vr: "Vrijdag", Za: "Zaterdag", Zo: "Zondag"
  };

  /* Safe plural / spelling variants — whole-word only, never snack↔fresh. */
  var _PLURAL = {
    tomaat: ["tomaten"], tomaten: ["tomaat"],
    ui: ["uien"], uien: ["ui"],
    ei: ["eieren"], eieren: ["ei"],
    paprika: ["paprika's", "paprikas"],
    champignon: ["champignons"], champignons: ["champignon"],
    wrap: ["wraps"], wraps: ["wrap"],
    aardappel: ["aardappelen"], aardappelen: ["aardappel"],
    wortel: ["wortelen"], wortelen: ["wortel"],
    kip: ["kipfilet"], kipfilet: ["kip"],
    gehakt: ["rundergehakt"], rundergehakt: ["gehakt"]
  };

  function endpoint() {
    if (typeof window.WEATE_AI_ENDPOINT === "string" && window.WEATE_AI_ENDPOINT.trim()) {
      return window.WEATE_AI_ENDPOINT.trim();
    }
    var fb = window.WEATE_FIREBASE;
    if (fb && typeof fb.aiEndpoint === "string" && fb.aiEndpoint.trim()) {
      return fb.aiEndpoint.trim();
    }
    return "";
  }

  function hasRemote() {
    return !!endpoint();
  }

  function postRemote(path, body) {
    var url = endpoint().replace(/\/$/, "") + path;
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {})
    }).then(function (r) {
      if (!r.ok) throw new Error("ai " + r.status);
      return r.json();
    });
  }

  function recs() {
    return typeof REC !== "undefined" ? REC : [];
  }

  function eatersFor(day) {
    if (typeof eatersOn === "function") {
      return eatersOn(day).filter(function (p) {
        return typeof p.id === "number" || (p.id != null && p.id < 1000);
      });
    }
    return (S.people || []).filter(function (p) {
      var m = (p.sched && p.sched[day]) || "eat";
      return m === "eat";
    });
  }

  function whoModes(day) {
    var out = { eat: 0, later: 0, apart: 0, skip: 0 };
    (S.people || []).forEach(function (p) {
      var m = typeof modeOf === "function" ? modeOf(day, p) : ((p.sched && p.sched[day]) || "eat");
      out[m] = (out[m] || 0) + 1;
    });
    return out;
  }

  function dayNeedsMeal(d) {
    var slot = S.plan && S.plan[d];
    if (slot && slot.id) return false;
    if (slot && slot.avond && slot.avond !== "thuis") return false;
    if (typeof WeAteAvond !== "undefined" && WeAteAvond.isStatusOnly && WeAteAvond.isStatusOnly(d)) return false;
    return eatersFor(d).length > 0;
  }

  function usedBoardIds() {
    var used = {};
    if (!S.plan) return used;
    DAYS.forEach(function (d) {
      var sl = S.plan[d];
      if (sl && sl.id) used[sl.id] = 1;
    });
    return used;
  }

  function listKeys() {
    var keys = {};
    try {
      if (typeof buildList === "function") {
        buildList().forEach(function (i) {
          if (i && i.k && !/^(e:|x:|add:)/.test(i.k)) keys[i.k] = 1;
        });
      }
    } catch (e) {}
    return keys;
  }

  function expandNeedTokens(toks) {
    var out = [], seen = {};
    function add(t) {
      t = String(t || "").toLowerCase();
      if (!t || seen[t]) return;
      seen[t] = 1;
      out.push(t);
    }
    (toks || []).forEach(function (t) {
      add(t);
      (_PLURAL[t] || []).forEach(add);
    });
    return out;
  }

  /* —— C: strict Actie matching (no paprika→chips) —— */
  function enrichSets(sets) {
    function enrich(arr) {
      return (arr || []).map(function (entry) {
        var copy = {
          n: entry.n,
          aisle: entry.aisle || "",
          k: entry.k || "",
          _extraNeeds: []
        };
        /* Only known plural/spelling pairs — never free-token invention. */
        var key = String(entry.k || "").toLowerCase();
        var seeds = [];
        if (key) seeds.push(key);
        String(entry.n || "").toLowerCase().replace(/[^\wäöüßà-ÿ0-9]+/g, " ").split(/\s+/).forEach(function (t) {
          if (_PLURAL[t]) seeds.push(t);
        });
        var seen = {};
        expandNeedTokens(seeds).forEach(function (t) {
          if (t === key || seen[t]) return;
          seen[t] = 1;
          copy._extraNeeds.push([t]);
        });
        return copy;
      });
    }
    return { list: enrich(sets && sets.list), bord: enrich(sets && sets.bord) };
  }

  function baseDealMatch(deal, sets) {
    var fn = window._origDealMatchKind || (typeof dealMatchKind === "function" ? dealMatchKind : null);
    if (!fn) return "";
    return fn(deal, sets) || "";
  }

  function matchDealKindLocal(deal, sets) {
    /* Strict folder matcher first; then plural-expanded retry. Never loosen snack/dish rules. */
    var kind = baseDealMatch(deal, sets);
    if (kind) return kind;
    if (!sets) return "";
    var enriched = enrichSets(sets);
    function withExtras(orig, extra) {
      return (orig || []).concat(extra || []);
    }
    var synthList = [];
    (enriched.list || []).forEach(function (e) {
      (e._extraNeeds || []).forEach(function (need) {
        /* k leeg: anders pakt folder.js CAT-key (singular) i.p.v. meervoud-naam. */
        synthList.push({ n: need[0], aisle: e.aisle, k: "" });
      });
    });
    var synthBord = [];
    (enriched.bord || []).forEach(function (e) {
      (e._extraNeeds || []).forEach(function (need) {
        synthBord.push({ n: need[0], aisle: e.aisle, k: "" });
      });
    });
    if (synthList.length || synthBord.length) {
      kind = baseDealMatch(deal, {
        list: withExtras(sets.list, synthList),
        bord: withExtras(sets.bord, synthBord)
      });
    }
    return kind || "";
  }

  function applyDealMatches(rows, sets) {
    (rows || []).forEach(function (r) {
      r._match = matchDealKindLocal(r, sets);
    });
    return rows;
  }

  function matchListToActie(list, deals) {
    var sets = { list: [], bord: [] };
    (list || []).forEach(function (it) {
      var n = typeof it === "string" ? it : (it.n || it.name || "");
      var k = typeof it === "string" ? "" : (it.k || it.id || "");
      var aisle = typeof it === "string" ? "" : (it.aisle || "");
      if (n || k) sets.list.push({ n: n || k, k: k, aisle: aisle });
    });
    if ((!list || !list.length) && typeof boardMatchSets === "function") {
      sets = boardMatchSets();
    }
    var out = [];
    (deals || []).forEach(function (d) {
      var kind = matchDealKindLocal(d, sets);
      if (kind) out.push({ deal: d, kind: kind, n: d.n, s: d.s, now: d.now });
    });
    return out;
  }

  /* —— A: slimme weekvoorstellen —— */
  function scoreRecSmart(rec, people, ctx) {
    ctx = ctx || {};
    if (typeof hardBlock === "function" && hardBlock(rec, people).length) return null;
    var taste = typeof tasteHits === "function" ? tasteHits(rec, people).length : 0;
    var score = 0;
    /* Lower is better (like suggest.js). */
    score += taste * 22;
    if (ctx.usedCuisine && ctx.usedCuisine[rec.c]) score += 20;
    /* Soft: already on board / picked other day — still show in option lists. */
    if (ctx.usedId && ctx.usedId[rec.id]) score += 10;
    score += Math.max(0, (rec.time || 30) - 35);
    /* Sport / busy evening: prefer sneller. */
    if (ctx.busy && (rec.time || 30) > 30) score += 14;
    if (ctx.busy && (rec.time || 30) <= 25) score -= 8;
    /* Prefer reheat midweek leftovers culture — not a savings claim. */
    if (ctx.preferReheat && rec.reheat) score -= 6;
    /* Prefer fijn when small kids eat. */
    if (ctx.kidsSmall && rec.fijn) score -= 5;
    /* Shopping overlap: reuse what's already on the list (no € claim). */
    var onList = ctx.listKeys || {};
    var overlap = 0;
    (rec.ing || []).forEach(function (it) {
      if (onList[it.k]) overlap++;
    });
    if (overlap) score -= Math.min(10, overlap * 3);
    /* Light cuisine bonus for variety. */
    if (ctx.usedCuisine && !ctx.usedCuisine[rec.c]) score -= 2;
    /* Soft: GF diet already hard-blocked via aller; prefer swap-ready for vetoes. */
    if (taste && rec.swap) score -= 3;
    return score;
  }

  function buildContext(extra) {
    extra = extra || {};
    var days = DAYS.filter(dayNeedsMeal);
    var want = extra.n || 7;
    if (days.length > want) days = days.slice(0, want);
    if (days.length < 3) {
      var all = DAYS.filter(dayNeedsMeal);
      days = all.slice(0, Math.max(days.length, Math.min(7, all.length)));
    }
    return {
      days: days,
      usedId: usedBoardIds(),
      listKeys: listKeys(),
      people: S.people || [],
      plan: S.plan || {},
      house: S.house || "De Barto's",
      source: hasRemote() ? "remote-or-local" : "local"
    };
  }

  function localSuggestWeek(ctx) {
    ctx = ctx || buildContext();
    /* Prefer many real options per day (6–12+). Never empty stubs. */
    var wantDays = (ctx && ctx.n) || 7;
    var days = ctx.days && ctx.days.length ? ctx.days.slice() : DAYS.filter(dayNeedsMeal);
    if (days.length > wantDays) days = days.slice(0, wantDays);
    if (days.length < 3) {
      var all = DAYS.filter(dayNeedsMeal);
      days = all.slice(0, Math.max(days.length, Math.min(7, all.length)));
    }
    var usedCuisine = {};
    var usedId = Object.assign({}, ctx.usedId || usedBoardIds());
    var listK = ctx.listKeys || listKeys();
    var OPTS = 10;
    var out = [];

    days.forEach(function (d, idx) {
      var people = eatersFor(d);
      if (!people.length) return;
      var modes = whoModes(d);
      var busy = (modes.apart + modes.later) >= 2 || (modes.apart >= 1 && people.length <= 3);
      var kidsSmall = people.some(function (p) {
        return p.role === "child" && p.portion === "small";
      });
      var preferReheat = idx >= 2;
      var scored = [];
      recs().forEach(function (rec) {
        var sc = scoreRecSmart(rec, people, {
          usedCuisine: usedCuisine,
          usedId: usedId,
          busy: busy,
          kidsSmall: kidsSmall,
          preferReheat: preferReheat,
          listKeys: listK
        });
        if (sc == null) return;
        var tasteN = typeof tasteHits === "function" ? tasteHits(rec, people).length : 0;
        var why = [];
        if (busy && (rec.time || 30) <= 25) why.push("snel · drukke avond");
        else if (busy) why.push("drukke avond");
        if (rec.reheat && preferReheat) why.push("warmt goed op");
        if (kidsSmall && rec.fijn) why.push("fijn mogelijk");
        if (tasteN) why.push(tasteN + " smaak-check");
        scored.push({
          id: rec.id,
          t: rec.t,
          c: rec.c,
          time: rec.time,
          img: rec.img || "",
          taste: tasteN,
          why: why.join(" · "),
          score: sc,
          source: "local"
        });
      });
      scored.sort(function (a, b) { return a.score - b.score; });
      var options = [], seenC = {}, seenI = {};
      function pushUnique(list) {
        list.forEach(function (o) {
          if (seenI[o.id] || options.length >= OPTS) return;
          if (!o.id || !o.t) return;
          seenI[o.id] = 1;
          options.push(o);
          seenC[o.c] = 1;
        });
      }
      pushUnique(scored.filter(function (o) { return !seenC[o.c]; }));
      pushUnique(scored);
      if (!options.length) {
        /* Soft fallback: any non-hardBlocked recipe with real name — never "niks". */
        recs().forEach(function (rec) {
          if (typeof hardBlock === "function" && hardBlock(rec, people).length) return;
          if (!rec.id || !rec.t) return;
          options.push({
            id: rec.id, t: rec.t, c: rec.c, time: rec.time, img: rec.img || "",
            taste: 0, why: "", score: 0, source: "local"
          });
        });
        options = options.slice(0, OPTS);
      }
      if (!options.length) return;
      var pick = options[0].id;
      usedId[pick] = 1;
      usedCuisine[options[0].c] = 1;
      out.push({
        day: d,
        id: pick,
        t: options[0].t,
        c: options[0].c,
        time: options[0].time,
        img: options[0].img,
        taste: options[0].taste,
        why: options[0].why,
        options: options,
        pick: pick,
        skip: false,
        source: "local"
      });
    });
    return out;
  }

  function suggestWeek(ctx) {
    ctx = ctx || buildContext();
    if (!hasRemote()) {
      return Promise.resolve({ ok: true, source: "local", suggestions: localSuggestWeek(ctx) });
    }
    return postRemote("/suggestWeek", { ctx: ctx })
      .then(function (data) {
        var list = (data && (data.suggestions || data.items)) || [];
        if (!Array.isArray(list) || !list.length) {
          return { ok: true, source: "local-fallback", suggestions: localSuggestWeek(ctx) };
        }
        /* Validate remote ids against REC + hardBlock. */
        var clean = [];
        list.forEach(function (s) {
          var rec = typeof recipeBy === "function" ? recipeBy(s.id) : recs().filter(function (r) { return r.id === s.id; })[0];
          if (!rec) return;
          var people = eatersFor(s.day || s.d);
          if (typeof hardBlock === "function" && hardBlock(rec, people).length) return;
          clean.push({
            day: s.day || s.d,
            id: rec.id,
            t: rec.t,
            c: rec.c,
            time: rec.time,
            img: rec.img || "",
            taste: typeof tasteHits === "function" ? tasteHits(rec, people).length : 0,
            why: s.why || "",
            source: "remote"
          });
        });
        if (clean.length < 2) {
          return { ok: true, source: "local-fallback", suggestions: localSuggestWeek(ctx) };
        }
        /* Expand remote picks with local multi-option lists (photos + variety). */
        var local = localSuggestWeek(ctx);
        var byDay = {};
        clean.forEach(function (s) { byDay[s.day] = s; });
        var merged = local.map(function (dayEntry) {
          var rem = byDay[dayEntry.day];
          if (!rem) return dayEntry;
          var opts = (dayEntry.options || []).slice();
          if (!opts.some(function (o) { return o.id === rem.id; })) {
            opts.unshift({
              id: rem.id, t: rem.t, c: rem.c, time: rem.time, img: rem.img || "",
              taste: rem.taste || 0, why: rem.why || "", score: -1, source: "remote"
            });
          } else {
            opts = opts.filter(function (o) { return o.id !== rem.id; });
            opts.unshift({
              id: rem.id, t: rem.t, c: rem.c, time: rem.time,
              img: (opts[0] && opts[0].img) || rem.img || "",
              taste: rem.taste || 0, why: rem.why || "", score: -1, source: "remote"
            });
          }
          return {
            day: dayEntry.day,
            id: rem.id,
            t: rem.t,
            c: rem.c,
            time: rem.time,
            img: rem.img || (opts[0] && opts[0].img) || "",
            taste: rem.taste,
            why: rem.why,
            options: opts,
            pick: rem.id,
            skip: false,
            source: "remote"
          };
        });
        /* Include remote-only days if any. */
        clean.forEach(function (s) {
          if (merged.some(function (m) { return m.day === s.day; })) return;
          merged.push({
            day: s.day, id: s.id, t: s.t, c: s.c, time: s.time, img: s.img || "",
            taste: s.taste, why: s.why, options: [s], pick: s.id, skip: false, source: "remote"
          });
        });
        return { ok: true, source: "remote", suggestions: merged };
      })
      .catch(function () {
        return { ok: true, source: "local-fallback", suggestions: localSuggestWeek(ctx) };
      });
  }

  /* —— B: restjes-coach —— */
  function normalizeItem(it) {
    if (typeof it === "string") return { n: it, k: "", q: 1 };
    return {
      n: it.n || it.name || it.k || "",
      k: it.k || it.id || "",
      q: it.q || 1,
      aisle: it.aisle || ""
    };
  }

  function itemMatchesIng(item, ingKey) {
    var k = String(item.k || "").toLowerCase();
    var n = String(item.n || "").toLowerCase();
    var ik = String(ingKey || "").toLowerCase();
    if (!ik) return false;
    if (k && (k === ik || k.indexOf(ik) === 0 || ik.indexOf(k) === 0)) return true;
    if (n && (n === ik || n.indexOf(ik) >= 0 || ik.indexOf(n) >= 0)) return true;
    /* Catalog aliases */
    if (window.WeAteProducts && typeof WeAteProducts.aliasesFor === "function") {
      var als = WeAteProducts.aliasesFor(k || n) || [];
      for (var i = 0; i < als.length; i++) {
        var a = String(als[i]).toLowerCase();
        if (a === ik || a.indexOf(ik) >= 0 || ik.indexOf(a) >= 0) return true;
      }
    }
    var cat = typeof CAT !== "undefined" && CAT[ik];
    if (cat) {
      var label = String(cat.label || cat.name || "").toLowerCase();
      if (n && label && (label.indexOf(n) >= 0 || n.indexOf(label.split(" ")[0]) >= 0)) return true;
    }
    return false;
  }

  function localSuggestFromLeftovers(items) {
    var norm = (items || []).map(normalizeItem).filter(function (x) { return x.n || x.k; });
    if (!norm.length) return [];
    var scored = [];
    recs().forEach(function (rec) {
      var uses = [];
      (rec.ing || []).forEach(function (it) {
        for (var i = 0; i < norm.length; i++) {
          if (itemMatchesIng(norm[i], it.k)) {
            var label = (typeof CAT !== "undefined" && CAT[it.k] && (CAT[it.k].label || CAT[it.k].name)) || it.k;
            if (uses.indexOf(label) < 0) uses.push(label);
            break;
          }
        }
      });
      if (!uses.length) return;
      var people = (S.people || []).filter(function (p) { return p.role !== "guest"; });
      if (typeof hardBlock === "function" && hardBlock(rec, people).length) return;
      var taste = typeof tasteHits === "function" ? tasteHits(rec, people).length : 0;
      var rank = uses.length * 10 - taste * 3 - Math.max(0, (rec.time || 30) - 35);
      if (rec.reheat) rank += 4;
      scored.push({
        id: rec.id,
        t: rec.t,
        c: rec.c,
        time: rec.time,
        reheat: !!rec.reheat,
        fijn: !!rec.fijn,
        uses: uses,
        tip: tipForLeftover(rec, uses),
        rank: rank,
        source: "local"
      });
    });
    scored.sort(function (a, b) { return b.rank - a.rank; });
    return scored.slice(0, 8);
  }

  function tipForLeftover(rec, uses) {
    var u = (uses || []).slice(0, 2).join(" + ");
    if (rec.reheat) return "Warmt goed op — handig met " + u + ".";
    if (rec.fijn) return "Fijn mogelijk; gebruikt " + u + ".";
    return "Past bij je restjes: " + u + ".";
  }

  function suggestFromLeftovers(items) {
    var local = localSuggestFromLeftovers(items);
    if (!hasRemote()) {
      return Promise.resolve({ ok: true, source: "local", suggestions: local });
    }
    return postRemote("/suggestFromLeftovers", { items: (items || []).map(normalizeItem) })
      .then(function (data) {
        var list = (data && (data.suggestions || data.items)) || [];
        if (!Array.isArray(list) || !list.length) {
          return { ok: true, source: "local-fallback", suggestions: local };
        }
        var clean = [];
        list.forEach(function (s) {
          var rec = typeof recipeBy === "function" ? recipeBy(s.id) : null;
          if (!rec) return;
          clean.push({
            id: rec.id,
            t: rec.t,
            c: rec.c,
            time: rec.time,
            reheat: !!rec.reheat,
            fijn: !!rec.fijn,
            uses: s.uses || [],
            tip: s.tip || tipForLeftover(rec, s.uses || []),
            source: "remote"
          });
        });
        return { ok: true, source: clean.length ? "remote" : "local-fallback", suggestions: clean.length ? clean : local };
      })
      .catch(function () {
        return { ok: true, source: "local-fallback", suggestions: local };
      });
  }

  /* —— UI: Slim voorstellen + Restjes-coach —— */
  function openSlimSuggest() {
    if (typeof toast === "function") toast(hasRemote() ? "Slim voorstellen…" : "Slim voorstellen (offline)");
    suggestWeek(buildContext({ n: 7 })).then(function (res) {
      var list = (res && res.suggestions) || [];
      if (typeof openSuggest === "function") {
        openSuggest(list);
        setTimeout(injectUiKnobs, 0);
      } else if (typeof toast === "function") {
        var nOpts = 0;
        list.forEach(function (s) { nOpts += (s.options && s.options.length) || (s.id ? 1 : 0); });
        toast(list.length ? (list.length + " avonden · " + nOpts + " recepten") : "Geen voorstellen");
      }
    });
  }

  function leftoverCandidates() {
    var out = [], seen = {};
    function add(n, k, aisle) {
      n = String(n || "").trim();
      if (!n) return;
      var sig = (k || "") + ":" + n.toLowerCase();
      if (seen[sig]) return;
      seen[sig] = 1;
      out.push({ n: n, k: k || "", aisle: aisle || "" });
    }
    try {
      if (typeof buildList === "function") {
        buildList().forEach(function (i) {
          if (S.checked && S.checked[i.k]) return;
          add(i.n, i.k, i.aisle);
        });
      }
    } catch (e) {}
    /* Recent board ingredients (warm-up friendly). */
    try {
      if (S.plan && typeof recipeBy === "function") {
        DAYS.forEach(function (d) {
          var sl = S.plan[d];
          if (!sl || !sl.id) return;
          var rec = recipeBy(sl.id);
          if (!rec) return;
          (rec.ing || []).forEach(function (it) {
            var cat = typeof CAT !== "undefined" && CAT[it.k];
            add(cat ? (cat.label || cat.name) : it.k, it.k, cat ? cat.aisle : "");
          });
        });
      }
    } catch (e2) {}
    /* Gegeten→restje bewaard: optioneel als chip (niet hetzelfde als coach-lijst). */
    try {
      if (S.eaten && S.plan && typeof recipeBy === "function") {
        DAYS.forEach(function (d) {
          var eg = S.eaten[d];
          if (!eg || eg.rest !== "rest") return;
          var sl = S.plan[d];
          if (!sl || !sl.id) return;
          var rec = recipeBy(sl.id);
          if (rec) add("Restje " + rec.t, "rest:" + sl.id, "Restje");
        });
      }
    } catch (e3) {}
    return out.slice(0, 40);
  }

  function restPanel() {
    var el = document.getElementById("restjes");
    if (el) return el;
    el = document.createElement("section");
    el.className = "panel";
    el.id = "restjes";
    el.innerHTML =
      "<div class=hd><button class='btn s w' id=restclose type=button>Sluit</button><b>Wat staat er nog?</b></div>" +
      "<div class=sc id=restbody></div>";
    (document.querySelector(".phone") || document.body).appendChild(el);
    return el;
  }

  function drawRestjes() {
    var host = document.getElementById("restbody");
    if (!host) return;
    S._restPick = S._restPick || {};
    var cands = leftoverCandidates();
    var html = "<p class=note>Opruimen: tik wat er nog in huis of op de lijst staat. Los van <b>Gegeten → Restje</b> (maaltijd doorzetten naar een andere dag).</p>";
    if (!cands.length) {
      html += "<p class=note>Lijst en bord zijn leeg. Zet eerst iets op de lijst of het bord.</p>";
    } else {
      html += "<div class=row id=restchips style=margin-bottom:12px>";
      cands.forEach(function (c, i) {
        var on = !!S._restPick[i];
        html +=
          "<button type=button class='chip " + (on ? "on" : "") + "' data-act=restpick data-i=" + i + ">" +
          String(c.n).replace(/</g, "") +
          "</button>";
      });
      html += "</div>";
    }
    html += "<button class='btn g full' id=restgo type=button>Zoek recepten</button>";
    html += "<div id=resthits style=margin-top:14px></div>";
    html += "<button class='btn w full' id=restclose2 type=button style=margin-top:8px>Terug</button>";
    host.innerHTML = html;
    window._restCands = cands;
  }

  function renderRestHits(list, source) {
    var host = document.getElementById("resthits");
    if (!host) return;
    if (!list || !list.length) {
      host.innerHTML = "<p class=note>Geen recept gevonden met precies die restjes. Kies andere chips of kijk handmatig bij Kies eten.</p>";
      return;
    }
    var note = source && source.indexOf("remote") === 0 ? "Via AI-endpoint." : "Offline heuristiek.";
    var html = "<p class=note>" + note + "</p>";
    list.forEach(function (s) {
      html +=
        "<button type=button class=card data-act=restopen data-id='" + s.id + "'>" +
        "<div class=p><b>" + String(s.t).replace(/</g, "") + "</b>" +
        "<div class=meta>" + s.c + " · " + (s.time || "?") + " min" +
        (s.uses && s.uses.length ? " · " + s.uses.slice(0, 3).join(", ") : "") +
        "</div>" +
        (s.tip ? "<div class=meta style=margin-top:4px>" + String(s.tip).replace(/</g, "") + "</div>" : "") +
        "</div></button>";
    });
    host.innerHTML = html;
  }

  function runRestjes() {
    var cands = window._restCands || [];
    var picked = [];
    Object.keys(S._restPick || {}).forEach(function (i) {
      if (S._restPick[i] && cands[+i]) picked.push(cands[+i]);
    });
    if (!picked.length) {
      if (typeof toast === "function") toast("Kies minstens één restje");
      return;
    }
    if (typeof toast === "function") toast("Restjes zoeken…");
    suggestFromLeftovers(picked).then(function (res) {
      renderRestHits((res && res.suggestions) || [], res && res.source);
    });
  }

  function openRestjes() {
    restPanel().classList.add("on");
    S._restPick = {};
    drawRestjes();
  }

  function closeRestjes() {
    var el = document.getElementById("restjes");
    if (el) el.classList.remove("on");
  }

  function injectUiKnobs() {
    /* Suggest panel: slim refresh. */
    var sug = document.getElementById("suggest");
    if (sug && !document.getElementById("sugslim")) {
      var hd = sug.querySelector(".hd");
      if (hd) {
        var slim = document.createElement("button");
        slim.type = "button";
        slim.className = "btn s w";
        slim.id = "sugslim";
        slim.textContent = "Slim";
        hd.appendChild(slim);
      }
    }
    /* Lijst: Opruimen onder lijstline (header was te vol). */
    var line = document.getElementById("lijstline");
    if (line && !document.getElementById("restentry")) {
      var rb = document.createElement("button");
      rb.type = "button";
      rb.className = "chip";
      rb.id = "restentry";
      rb.textContent = "Opruimen · wat nog in huis";
      rb.style.margin = "0 0 8px";
      if (line.nextSibling) line.parentNode.insertBefore(rb, line.nextSibling);
      else line.parentNode.appendChild(rb);
    } else if (document.getElementById("restentry")) {
      var re = document.getElementById("restentry");
      if (re.textContent.indexOf("Opruimen") < 0) re.textContent = "Opruimen · wat nog in huis";
    }
    /* Bord: opruimen-chip als weekplan-banner geen ruimte heeft (volle week). */
    var bordSc = document.querySelector("#bord .sc");
    var wp = document.getElementById("wpbanner");
    if (bordSc && !document.getElementById("restentrybord") && wp && wp.querySelector("#wpprimary") && !wp.querySelector("#restentry2")) {
      /* secondary slim already on banner when empty days — skip duplicate */
    }
    if (bordSc && !document.getElementById("restentrybord") && !document.getElementById("wpbanner")) {
      var row = document.getElementById("weekline");
      if (row) {
        var wrap = document.createElement("div");
        wrap.className = "row";
        wrap.style.margin = "0 0 10px";
        wrap.id = "restentrybord";
        wrap.innerHTML = "<button type=button class='chip' id=restentry2>Opruimen</button>";
        if (row.nextSibling) bordSc.insertBefore(wrap, row.nextSibling);
        else bordSc.appendChild(wrap);
      }
    }
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t && t.nodeType === 3) t = t.parentNode;
    if (!t || !t.closest) return;
    function hasId(id) {
      return t.id === id || (t.closest && t.closest("#" + id));
    }
    if (hasId("slimvoorstellen") || hasId("slimvoorstellen2") || hasId("sugslim")) {
      e.preventDefault();
      openSlimSuggest();
      return;
    }
    if (hasId("restentry") || hasId("restentry2")) {
      e.preventDefault();
      openRestjes();
      return;
    }
    if (hasId("restclose") || hasId("restclose2")) {
      e.preventDefault();
      closeRestjes();
      return;
    }
    if (hasId("restgo")) {
      e.preventDefault();
      runRestjes();
      return;
    }
    var pick = t.closest && t.closest("[data-act=restpick]");
    if (pick) {
      e.preventDefault();
      var i = +pick.getAttribute("data-i");
      S._restPick = S._restPick || {};
      S._restPick[i] = !S._restPick[i];
      pick.classList.toggle("on", !!S._restPick[i]);
      return;
    }
    var open = t.closest && t.closest("[data-act=restopen]");
    if (open) {
      e.preventDefault();
      var id = open.getAttribute("data-id");
      closeRestjes();
      /* Free day or today */
      var day = null;
      for (var di = 0; di < DAYS.length; di++) {
        if (dayNeedsMeal(DAYS[di])) {
          day = DAYS[di];
          break;
        }
      }
      if (!day) day = DAYS[(new Date().getDay() + 6) % 7];
      S.day = day;
      S.whoDraft = null;
      S._whoDay = null;
      S._fijnDraft = null;
      S._showAdd = false;
      S._receptBack = "bord";
      if (typeof openRecipe === "function") openRecipe(id);
      else if (typeof toast === "function") toast("Open " + id);
      return;
    }
  }, true);

  /* Hook folder draw to use improved matcher. */
  /* drawFolder already uses patched dealMatchKind — no second rematch pass (Actie snappy). */
  if (typeof drawFolder === "function" && !drawFolder._aiMatch) {
    drawFolder._aiMatch = true;
  }

  /* Patch folder matcher: plural-aware, still strict (uses saved original). */
  if (typeof dealMatchKind === "function" && !window._aiDealMatchPatched) {
    window._aiDealMatchPatched = 1;
    window._origDealMatchKind = dealMatchKind;
    window.dealMatchKind = dealMatchKind = function (r, sets) {
      return matchDealKindLocal(r, sets);
    };
  }

  if (typeof drawBord === "function" && !drawBord._ai) {
    var _db = drawBord;
    drawBord = function () {
      _db();
      setTimeout(injectUiKnobs, 0);
    };
    drawBord._ai = true;
  }
  if (typeof drawList === "function" && !drawList._ai) {
    var _dl = drawList;
    drawList = function () {
      _dl();
      setTimeout(injectUiKnobs, 0);
    };
    drawList._ai = true;
  }

  if (typeof show === "function" && !show._ai) {
    var _sh = show;
    show = function (id) {
      if (id !== "lijst" && id !== "bord") closeRestjes();
      _sh(id);
      setTimeout(injectUiKnobs, 0);
    };
    show._ai = true;
  }

  if (typeof openSuggest === "function" && !openSuggest._ai) {
    var _os = openSuggest;
    openSuggest = function (forceList) {
      _os(forceList);
      setTimeout(injectUiKnobs, 0);
    };
    openSuggest._ai = true;
  }

  window.WeAteAI = {
    suggestWeek: suggestWeek,
    suggestFromLeftovers: suggestFromLeftovers,
    matchListToActie: matchListToActie,
    matchDealKind: matchDealKindLocal,
    applyDealMatches: applyDealMatches,
    openSlimSuggest: openSlimSuggest,
    openRestjes: openRestjes,
    hasRemote: hasRemote,
    buildContext: buildContext,
    localSuggestWeek: localSuggestWeek,
    scoreRecSmart: scoreRecSmart
  };

  setTimeout(injectUiKnobs, 200);
})();
