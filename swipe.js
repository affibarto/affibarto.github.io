/* WeAte swipe-kiezer — ja zet het recept op die dag (zelfde plan als "Zet op het bord"),
   nee = volgende. Uit eten / Later blijven via avond.js. Geen GitHub-push. */
(function () {
  if (window._swipeKies) return;
  window._swipeKies = 1;

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
  function recipeCents(rec, day) {
    if (!rec) return 0;
    var who = typeof eatersOn === "function" ? eatersOn(day) : [];
    var scale = typeof portions === "function" ? portions(who.length ? who : (S.people || [])) / 4 : 1;
    var sum = 0;
    (rec.ing || []).forEach(function (it) {
      var cat = typeof CAT !== "undefined" && CAT[it.k];
      sum += window.weLineCents ? window.weLineCents(it.k, cat, (+it.q || 1) * scale) : Math.round(unitCents(cat) * ((+it.q || 1) * scale));
    });
    return sum;
  }
  function statusOf(day) {
    if (window.WeAteAvond && WeAteAvond.modeOfDay) return WeAteAvond.modeOfDay(day);
    var slot = S && S.plan && S.plan[day];
    var a = slot && slot.avond;
    return !a || a === "thuis" ? "thuis" : a;
  }
  function filled(day) {
    if (window.dayIsFilled) return dayIsFilled(day);
    var slot = S && S.plan && S.plan[day];
    return !!(slot && (slot.id || (slot.avond && slot.avond !== "thuis")));
  }
  function nextEmpty(from) {
    var i = DAYS.indexOf(from);
    if (i < 0) i = 0;
    for (var n = 1; n <= DAYS.length; n++) {
      var d = DAYS[(i + n) % DAYS.length];
      if (!filled(d)) return d;
    }
    return null;
  }
  function firstEmpty() {
    for (var i = 0; i < DAYS.length; i++) if (!filled(DAYS[i])) return DAYS[i];
    return S.day || "Ma";
  }
  function deckIds(day) {
    var eat = typeof eatersOn === "function" ? eatersOn(day) : [];
    var planned = {};
    DAYS.forEach(function (d) {
      var slot = S.plan && S.plan[d];
      if (slot && slot.id) planned[slot.id] = 1;
    });
    var list = (typeof REC !== 'undefined' ? REC : []).filter(function (r) {
      if (!r || !r.id || r.custom) return false;
      if (S.cuisine && S.cuisine !== "Alle" && r.c !== S.cuisine) return false;
      if (typeof hardBlock === "function" && hardBlock(r, eat).length) return false;
      return true;
    });
    list.sort(function (a, b) {
      var ap = planned[a.id] ? 1 : 0;
      var bp = planned[b.id] ? 1 : 0;
      if (ap !== bp) return ap - bp;
      return String(a.t).localeCompare(String(b.t), "nl");
    });
    return list.map(function (r) { return r.id; });
  }
  function state() {
    if (!window._swipeDeck) window._swipeDeck = { day: "", ids: [], i: 0 };
    return window._swipeDeck;
  }
  function syncDeck() {
    var st = state();
    var day = S.day;
    if (st.day !== day || !st.ids) {
      st.day = day;
      st.ids = deckIds(day);
      st.i = 0;
    }
    if (st.i >= st.ids.length) st.i = 0;
    return st;
  }
  function currentRec() {
    var st = syncDeck();
    var id = st.ids[st.i];
    return id && typeof recipeBy === "function" ? recipeBy(id) : null;
  }
  function cardHtml(rec, back) {
    if (!rec) return "";
    var eat = typeof eatersOn === "function" ? eatersOn(S.day) : [];
    var names = eat.map(function (p) { return p.name; }).slice(0, 4).join(", ");
    var taste = typeof tasteHits === "function" ? tasteHits(rec, eat) : [];
    var tag = rec.fijn ? "Fijn voor kids" : (rec.c || "Avondeten");
    return (
      "<article class='swipecard" + (back ? " back" : " front") + "' data-id='" + esc(rec.id) + "'>" +
      (rec.img ? "<img alt='' src='" + esc(rec.img) + "'/>" : "<div class='swipeph'></div>") +
      "<div class='swipestamp ja'>Ja</div><div class='swipestamp nee'>Nee</div>" +
      "<div class='swipebody'>" +
      "<span class='plantag'>" + esc(tag) + "</span>" +
      "<b>" + esc(rec.t) + "</b>" +
      "<div class='swipefacts'>" + (rec.time || 30) + " min · " + (eat.length || 0) + " pers. · " + euro(recipeCents(rec, S.day)) + "</div>" +
      (names ? "<div class='swipemeta'>" + esc(names) + " eten mee</div>" : "") +
      (taste.length ? "<div class='swipemeta'>Let op smaak · " + esc(taste[0].person) + "</div>" : "") +
      "</div></article>"
    );
  }
  function paint() {
    var sc = document.querySelector("#kies .sc");
    if (!sc || !S) return;
    var deck = document.getElementById("swipedeck");
    var recipes = document.getElementById("recipes");
    var cuis = document.getElementById("cuisines");
    var note = document.getElementById("kiesnote");
    var away = statusOf(S.day) !== "thuis";
    if (away) {
      if (deck) deck.style.display = "none";
      return;
    }
    if (S._kiesMode !== "list") S._kiesMode = "swipe";
    if (!deck) {
      deck = document.createElement("div");
      deck.id = "swipedeck";
      var strip = document.getElementById("avondstrip");
      if (strip && strip.nextSibling) sc.insertBefore(deck, strip.nextSibling);
      else if (strip) sc.insertBefore(deck, strip.nextSibling);
      else sc.insertBefore(deck, sc.firstChild);
    }
    if (S._kiesMode === "list") {
      deck.style.display = "";
      deck.innerHTML = "<button type='button' class='chip' data-act='backswipe'>Terug naar swipe</button>";
      if (recipes) recipes.style.display = "";
      if (cuis) cuis.style.display = "";
      if (note) note.style.display = "";
      return;
    }
    deck.style.display = "";
    if (recipes) recipes.style.display = "none";
    if (cuis) cuis.style.display = S._swipeFilter ? "" : "none";
    if (note) note.style.display = "none";
    var st = syncDeck();
    var rec = currentRec();
    var nxt = st.ids[st.i + 1] && typeof recipeBy === "function" ? recipeBy(st.ids[st.i + 1]) : null;
    var dayLab = DLAB[S.day] || S.day;
    if (!rec) {
      deck.innerHTML =
        "<p class='swipelead'>" + esc(dayLab) + "</p>" +
        "<div class='swipeempty'><b>Geen recept dat past</b><p>Pas het filter aan, of stel zelf iets samen.</p></div>" +
        "<div class='swiperow'>" +
        "<button type='button' class='swipebtn ghost' data-act='swipelist'>Alle recepten</button>" +
        "<button type='button' class='swipebtn yes' data-act='swipecustom'>Zelf</button></div>";
      return;
    }
    deck.innerHTML =
      "<p class='swipelead'>Sleep · " + esc(dayLab) + " · " + (st.i + 1) + "/" + st.ids.length + "</p>" +
      "<div class='swipestack'>" +
      (nxt ? cardHtml(nxt, true) : "") +
      cardHtml(rec, false) +
      "</div>" +
      "<div class='swiperow'>" +
      "<button type='button' class='swipebtn no' data-act='swipeno'>Nee</button>" +
      "<button type='button' class='swipebtn ghost' data-act='swipeopen'>Recept</button>" +
      "<button type='button' class='swipebtn yes' data-act='swipeyes'>Ja</button>" +
      "</div>" +
      "<div class='swipelinks'>" +
      "<button type='button' data-act='swipelist'>Alle recepten</button>" +
      "<button type='button' data-act='swipefilter'>Filter</button>" +
      "<button type='button' data-act='swipecustom'>Zelf</button>" +
      "</div>";
    var front = deck.querySelector(".swipecard.front");
    if (front) bindDrag(front);
  }
  function fly(card, dir, done) {
    card.style.transition = "transform .22s ease";
    card.style.transform = "translate(" + (dir * 420) + "px," + (dir * 20) + "px) rotate(" + (dir * 16) + "deg)";
    setTimeout(done, 180);
  }
  function bindDrag(card) {
    var startX = 0, startY = 0, on = false;
    card.addEventListener("pointerdown", function (e) {
      if (e.button != null && e.button !== 0) return;
      on = true;
      startX = e.clientX;
      startY = e.clientY;
      card.style.transition = "none";
      try { card.setPointerCapture(e.pointerId); } catch (err) {}
    });
    card.addEventListener("pointermove", function (e) {
      if (!on) return;
      var dx = e.clientX - startX;
      var dy = (e.clientY - startY) * 0.25;
      card.style.transform = "translate(" + dx + "px," + dy + "px) rotate(" + (dx / 18) + "deg)";
      card.classList.toggle("like", dx > 28);
      card.classList.toggle("nope", dx < -28);
    });
    function end(e) {
      if (!on) return;
      on = false;
      var dx = e.clientX - startX;
      if (dx > 88) fly(card, 1, function () { yes(); });
      else if (dx < -88) fly(card, -1, function () { no(); });
      else {
        card.style.transition = "transform .18s ease";
        card.style.transform = "";
        card.classList.remove("like", "nope");
      }
    }
    card.addEventListener("pointerup", end);
    card.addEventListener("pointercancel", end);
  }
  function no() {
    var st = syncDeck();
    if (!st.ids.length) return;
    st.i++;
    if (st.i >= st.ids.length) {
      st.i = 0;
      if (typeof toast === "function") toast("Opnieuw vanaf het begin");
    }
    paint();
  }
  function yes() {
    var rec = currentRec();
    if (!rec) return;
    var eat = typeof eatersOn === "function" ? eatersOn(S.day) : [];
    if (typeof hardBlock === "function" && hardBlock(rec, eat).length) {
      if (typeof toast === "function") toast("Past niet bij een dieet");
      no();
      return;
    }
    if (typeof ensureWhoDraft === "function") ensureWhoDraft(S.day);
    var kids = (S.people || []).filter(function (p) { return p.role === "child" && p.portion === "small"; });
    var fijn = typeof canFijn === "function" && canFijn(rec) ? kids.map(function (p) { return p.id; }) : [];
    S.look = rec.id;
    S.plan = S.plan || {};
    S.plan[S.day] = { id: rec.id, who: Object.assign({}, S.whoDraft || {}), fijn: fijn };
    if (S.eaten) delete S.eaten[S.day];
    if (typeof save === "function") save();
    if (typeof toast === "function") toast(rec.t + " staat op " + (DLAB[S.day] || S.day));
    var nxt = nextEmpty(S.day);
    window._swipeDeck = null;
    if (nxt && nxt !== S.day) {
      S.day = nxt;
      S.whoDraft = null;
      S._whoDay = null;
      if (typeof drawKies === "function") drawKies();
    } else if (typeof show === "function") show("bord");
  }
  function openCurrent() {
    var rec = currentRec();
    if (!rec || typeof openRecipe !== "function") return;
    S._fijnDraft = null;
    S._showAdd = false;
    S._receptBack = "kies";
    openRecipe(rec.id);
  }

  if (typeof drawKies === "function" && !drawKies._swipe) {
    var _dk = drawKies;
    drawKies = function () {
      _dk.apply(this, arguments);
      try { paint(); } catch (e) {}
    };
    drawKies._swipe = true;
  }

  document.addEventListener("click", function (e) {
    var t = e.target && e.target.closest && e.target.closest("[data-act]");
    if (!t) {
      var pill = e.target && e.target.closest && e.target.closest("#swipeopen");
      if (!pill) return;
      e.preventDefault();
      S._kiesMode = "swipe";
      S.day = firstEmpty();
      S.whoDraft = null;
      S._whoDay = null;
      window._swipeDeck = null;
      if (typeof show === "function") show("kies");
      if (typeof drawKies === "function") drawKies();
      return;
    }
    var act = t.getAttribute("data-act");
    if (act === "swipeno") { e.preventDefault(); no(); return; }
    if (act === "swipeyes") { e.preventDefault(); yes(); return; }
    if (act === "swipeopen") { e.preventDefault(); openCurrent(); return; }
    if (act === "swipelist") {
      e.preventDefault();
      S._kiesMode = "list";
      paint();
      return;
    }
    if (act === "swipefilter") {
      e.preventDefault();
      S._swipeFilter = !S._swipeFilter;
      paint();
      return;
    }
    if (act === "swipecustom") {
      e.preventDefault();
      if (typeof openCustomForDay === "function") openCustomForDay(S.day);
      return;
    }
    if (act === "backswipe") {
      e.preventDefault();
      S._kiesMode = "swipe";
      paint();
    }
  }, true);

  window.WeAteSwipe = { open: function () {
    S._kiesMode = "swipe";
    S.day = firstEmpty();
    window._swipeDeck = null;
    if (typeof show === "function") show("kies");
    if (typeof drawKies === "function") drawKies();
  }, paint: paint };
})();
