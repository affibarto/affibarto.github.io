/* WeAte plan-layout (v89): greeting, cost card, photo day cards, list head.
   Cream + terracotta only — layout inspired by a planner, not its palette or brand. */
(function () {
  if (window._planlook) return;
  window._planlook = 1;

  var DAYS = window.DAYS || ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
  var DLAB = window.DLAB || { Ma: "Maandag", Di: "Dinsdag", Wo: "Woensdag", Do: "Donderdag", Vr: "Vrijdag", Za: "Zaterdag", Zo: "Zondag" };

  function esc(s) {
    return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  }
  function euro(c) {
    return "€" + ((+c || 0) / 100).toFixed(2).replace(".", ",");
  }
  function unitCents(cat) {
    if (!cat) return 0;
    var a = (cat.ah || 0) + (cat.aExtra || 0);
    var b = cat.lidl != null ? cat.lidl : Math.max(40, (cat.ah || 100) - 25);
    if (a && b > a) b = a;
    var brand = (S && S.brand) || "MIX";
    if (brand === "A") return a || b;
    if (brand === "B" || brand === "CHEAP") return b || a;
    if (cat.aisle === "Vers" || cat.aisle === "Koeling") return a || b;
    return b || a;
  }
  function storeUnit(cat, sid) {
    if (!cat) return 0;
    var base = cat.ah || 0;
    if (sid === "lidl" || sid === "aldi") base = cat.lidl != null ? cat.lidl : base;
    else if (sid === "jumbo") base = cat.jumbo != null ? cat.jumbo : base;
    else if (sid === "picnic") base = cat.picnic != null ? cat.picnic : base;
    else if (sid === "dirk" || sid === "plus") base = cat.lidl != null ? Math.round(((cat.ah || cat.lidl) + cat.lidl) / 2) : base;
    var a = base + (cat.aExtra || 0);
    var b = cat.lidl != null ? Math.min(cat.lidl, a || cat.lidl) : base;
    if (a && b > a) b = a;
    var brand = (S && S.brand) || "MIX";
    if (brand === "A") return a || b;
    if (brand === "B" || brand === "CHEAP") return b || a;
    if (cat.aisle === "Vers" || cat.aisle === "Koeling") return a || b;
    return b || a;
  }
  function greet() {
    var h = new Date().getHours();
    if (h < 12) return "Goede morgen";
    if (h < 18) return "Goede middag";
    return "Goede avond";
  }
  function chefName() {
    var people = (S && S.people) || [];
    var roy = people.filter(function (p) { return /roy/i.test(p.name || ""); })[0];
    if (roy) return roy.name;
    var cook = people.filter(function (p) { return p.canCook; })[0];
    return (cook && cook.name) || (people[0] && people[0].name) || "Roy";
  }
  function eachMeal(fn) {
    DAYS.forEach(function (d) {
      var slot = S.plan && S.plan[d];
      if (!slot || !slot.id || slot.leftover) return;
      if (slot.avond && slot.avond !== "thuis") return;
      var rec = typeof recipeBy === "function" ? recipeBy(slot.id) : null;
      if (!rec) return;
      var who = typeof eatersOn === "function" ? eatersOn(d) : [];
      var scale = typeof portions === "function" ? portions(who.length ? who : (S.people || [])) / 4 : 1;
      fn(d, rec, slot, scale, who);
    });
  }
  /* One price model for Bord + Lijst: rank like the list (scoreListStores), price lines via lineUnit. */
  var _scCache = { t: 0, v: null };
  function topScore() {
    if (typeof scoreListStores !== "function") return null;
    var now = Date.now();
    if (_scCache.v && now - _scCache.t < 400) return _scCache.v;
    var sc = null;
    try { sc = scoreListStores(); } catch (e) { sc = null; }
    _scCache = { t: now, v: sc && sc.length && sc[0].nItems ? sc[0] : null };
    return _scCache.v;
  }
  window.weTopStore = topScore;
  window.weLineCents = function (k, cat, q) {
    var top = topScore();
    if (top && typeof lineUnit === "function" && cat) {
      var u = null;
      try { u = lineUnit(cat, top.id, { k: k, cat: cat, q: q }); } catch (e) { u = null; }
      if (u != null) return Math.round(u * q);
    }
    return Math.round(unitCents(cat) * q);
  };
  function recipeCents(rec, scale) {
    var sum = 0;
    (rec.ing || []).forEach(function (it) {
      if (!it.k) return;
      var cat = typeof CAT !== "undefined" && CAT[it.k];
      sum += window.weLineCents(it.k, cat, (+it.q || 1) * scale);
    });
    return sum;
  }
  function weekStats() {
    var cents = 0;
    var byStore = {};
    var stores = typeof activeStores === "function" ? activeStores() : [];
    stores.forEach(function (s) { byStore[s.id] = { n: s.n, cents: 0 }; });
    var lines = 0;
    var bought = 0;
    eachMeal(function (d, rec, slot, scale) {
      (rec.ing || []).forEach(function (it) {
        if (!it.k) return;
        if (S.omit && S.omit[d + ":" + slot.id + ":" + it.k]) return;
        var k = it.k + "@" + d;
        if (S.removed && S.removed[k]) return;
        var cat = typeof CAT !== "undefined" && CAT[it.k];
        var q = (+it.q || 1) * scale;
        cents += Math.round(unitCents(cat) * q);
        lines++;
        if (S.checked && S.checked[k]) bought++;
        stores.forEach(function (s) {
          if (byStore[s.id]) byStore[s.id].cents += Math.round(storeUnit(cat, s.id) * q);
        });
      });
    });
    var _top = topScore();
    if (_top) { cents = _top.total; }
    var best = null;
    Object.keys(byStore).forEach(function (id) {
      var row = byStore[id];
      if (!best || row.cents < best.cents) best = { id: id, n: row.n, cents: row.cents };
    });
    if (_top) best = { id: _top.id, n: _top.n, cents: _top.total };
    return { cents: cents, lines: lines, bought: bought, best: best };
  }
  function paintHome() {
    var sc = document.querySelector("#bord .sc");
    if (!sc || !S) return;
    var home = document.getElementById("planhome");
    if (!home) {
      home = document.createElement("div");
      home.id = "planhome";
      sc.insertBefore(home, sc.firstChild);
    } else if (home.parentNode === sc) {
      sc.insertBefore(home, sc.firstChild);
    }
    var st = weekStats();
    var budget = Math.max(1, +S.budget || 120);
    var euros = st.cents / 100;
    var pct = Math.max(0, Math.min(100, Math.round((euros / budget) * 100)));
    var storeTxt = (st.lines && st.best) ? ("goedkoopst bij " + st.best.n) : "jullie winkels";
    var bought = (window._listCounts && window._listCounts.total) ? window._listCounts.bought : st.bought;
    var total = (window._listCounts && window._listCounts.total) ? window._listCounts.total : st.lines;
    home.innerHTML =
      "<p class='eyebrow'>" + esc(greet()) + "</p>" +
      "<h1 class='greet'>Chef-kok " + esc(chefName()) + "!</h1>" +
      "<div class='storechip'><span class='storedot' aria-hidden='true'></span>" + esc(storeTxt) + "</div>" +
      "<div class='statrow'>" +
      "<div class='statcard'><span class='statk'>Geschatte kosten</span><b>" + euro(st.cents) + " <span>/ €" + budget + "</span></b>" +
      "<span class='statbar'><i style='width:" + pct + "%'></i></span></div>" +
      "<button type='button' class='statcard statlink' data-go='lijst'><span class='statk'>Tik om te bekijken</span><b>Boodschappenlijst</b><span class='statsub'>" + bought + "/" + total + " gekocht</span></button>" +
      "</div>";
    var cta = document.getElementById("plancta");
    if (!cta) {
      cta = document.createElement("div");
      cta.id = "plancta";
      cta.innerHTML = "<button type='button' class='planpill' id='swipeopen'>Kies met swipe</button><button type='button' class='planround' id='slimopen' aria-label='Slim voorstellen'>≡</button>";
      var bord = document.getElementById("bord");
      if (bord) bord.appendChild(cta);
    }
    paintDays();
  }
  function paintDays() {
    var host = document.getElementById("days");
    if (!host) return;
    host.querySelectorAll(".daycap").forEach(function (n) { n.remove(); });
    host.querySelectorAll(".dayrow").forEach(function (row) {
      var d = row.getAttribute("data-d");
      if (!d) return;
      var wrap = row.parentElement && row.parentElement.classList.contains("swipewrap") ? row.parentElement : row;
      var cap = document.createElement("div");
      cap.className = "daycap";
      cap.textContent = DLAB[d] || d;
      wrap.parentNode.insertBefore(cap, wrap);
      row.classList.add("plancard");
      var away = row.classList.contains("day-uit") || row.classList.contains("day-later") || row.classList.contains("day-anders") || row.classList.contains("day-weg");
      var slot = S.plan && S.plan[d];
      var rec = !away && slot && slot.id && typeof recipeBy === "function" ? recipeBy(slot.id) : null;
      var b = row.querySelector("b");
      var meta = row.querySelector(".meta");
      var tag = row.querySelector(".plantag");
      if (rec) {
        if (b) b.textContent = (slot.leftover ? "Restje " : "") + rec.t;
        if (!tag) {
          tag = document.createElement("span");
          tag.className = "plantag";
          if (b) b.insertAdjacentElement("afterend", tag);
        }
        tag.textContent = slot.leftover ? "Restje" : (rec.fijn ? "Fijn voor kids" : (rec.reheat ? "Warmt goed op" : (rec.c || "Avond")));
        var who = typeof eatersOn === "function" ? eatersOn(d) : [];
        var scale = typeof portions === "function" ? portions(who.length ? who : (S.people || [])) / 4 : 1;
        if (meta) meta.textContent = (rec.time || 30) + " min · " + (who.length || 0) + " pers. · " + euro(recipeCents(rec, scale));
      } else if (!away) {
        if (tag) tag.remove();
      }
    });
  }
  function paintListHead() {
    var sc = document.querySelector("#lijst .sc");
    if (!sc) return;
    var box = document.getElementById("listhead");
    if (!box) {
      box = document.createElement("div");
      box.id = "listhead";
      sc.insertBefore(box, sc.firstChild);
    }
    var c = window._listCounts || { bought: 0, total: 0 };
    var st = weekStats();
    var storeTxt = st.best ? st.best.n : "Winkels";
    box.innerHTML =
      "<p class='eyebrow'>Deze week</p>" +
      "<div class='listheadrow'><h1 class='greet'>Boodschappenlijst</h1></div>" +
      "<div class='storechip'><span class='storedot' aria-hidden='true'></span>" + esc(storeTxt) +
      " <span class='listcount'>" + (c.bought || 0) + "/" + (c.total || 0) + " gekocht</span></div>";
  }

  if (typeof drawBord === "function" && !drawBord._planlook) {
    var _db = drawBord;
    drawBord = function () {
      _db.apply(this, arguments);
      try { paintHome(); } catch (e) {}
    };
    drawBord._planlook = true;
    try { if (typeof _viewDirty !== "undefined") _viewDirty.bord = 1; if (document.getElementById("days") && document.getElementById("days").children.length) drawBord(); } catch (e) {}
  }
  if (typeof drawList === "function" && !drawList._planlook) {
    var _dl = drawList;
    drawList = function () {
      var r = _dl.apply(this, arguments);
      try { paintListHead(); } catch (e) {}
      return r;
    };
    drawList._planlook = true;
  }
  document.addEventListener("click", function (e) {
    var slim = e.target && e.target.closest && e.target.closest("#slimopen");
    if (!slim) return;
    e.preventDefault();
    if (window.WeAteAI && typeof WeAteAI.openSlimSuggest === "function") WeAteAI.openSlimSuggest();
    else if (typeof openSuggest === "function") openSuggest();
  }, true);
})();
