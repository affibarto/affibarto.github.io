/* WeAte avondstatus — per dag Thuis / Uit eten / Later / Anders / Weg.
   Uit eten e.d.: geen recept, geen Lijst-ingrediënten, geen Actie-druk.
   Sync via S.plan (al in Firebase SYNC_KEYS). */
(function () {
  if (window._avond) return;
  window._avond = 1;

  var DAYS = window.DAYS || ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];
  var DLAB = window.DLAB || {
    Ma: "Maandag", Di: "Dinsdag", Wo: "Woensdag", Do: "Donderdag",
    Vr: "Vrijdag", Za: "Zaterdag", Zo: "Zondag"
  };

  var AVOND = [
    { id: "thuis", n: "Thuis", short: "Thuis", hint: "Koken — recept op het bord" },
    { id: "uit", n: "Uit eten", short: "Uit", hint: "Geen boodschappen, geen koken" },
    { id: "later", n: "Later", short: "Later", hint: "Avondeten komt later" },
    { id: "anders", n: "Anders", short: "Anders", hint: "Iedereen eet anders" },
    { id: "weg", n: "Weg", short: "Weg", hint: "Niemand thuis die avond" }
  ];

  function modeOfDay(d) {
    var slot = S && S.plan && S.plan[d];
    var a = slot && slot.avond;
    if (!a || a === "thuis") return "thuis";
    return a;
  }

  function isStatusOnly(d) {
    var m = modeOfDay(d);
    return m !== "thuis";
  }

  function dayIsFilled(d) {
    var slot = S && S.plan && S.plan[d];
    if (!slot) return false;
    if (slot.avond && slot.avond !== "thuis") return true;
    return !!slot.id;
  }

  function labelFor(m) {
    for (var i = 0; i < AVOND.length; i++) if (AVOND[i].id === m) return AVOND[i].n;
    return "Thuis";
  }

  function hintFor(m) {
    for (var i = 0; i < AVOND.length; i++) if (AVOND[i].id === m) return AVOND[i].hint;
    return "";
  }

  function setDayAvond(d, v) {
    if (!S) return;
    S.plan = S.plan || {};
    var prev = S.plan[d] || {};
    var who = prev.who ? Object.assign({}, prev.who) : {};
    v = v || "thuis";
    if (v === "thuis") {
      var kept = { who: who };
      if (prev.id && prev.avond !== "uit" && prev.avond !== "later" && prev.avond !== "anders" && prev.avond !== "weg") {
        kept.id = prev.id;
        if (prev.leftover) kept.leftover = true;
        if (prev.from) kept.from = prev.from;
        if (prev.fijn) kept.fijn = prev.fijn;
      }
      S.plan[d] = kept;
      if (typeof toast === "function") toast("Thuis koken · " + (DLAB[d] || d));
    } else {
      var oldId = prev.id;
      S.plan[d] = { avond: v, who: who };
      if (S.eaten) delete S.eaten[d];
      if (oldId && typeof purgeCustomIfUnused === "function") {
        try { purgeCustomIfUnused(oldId); } catch (e) {}
      }
      if (typeof toast === "function") toast(labelFor(v) + " · " + (DLAB[d] || d));
    }
    if (typeof save === "function") save();
    var recept = document.getElementById("recept");
    var onRecept = recept && recept.classList.contains("on");
    if (v !== "thuis" && onRecept && typeof show === "function") {
      show("bord");
    } else {
      if (typeof drawBord === "function") drawBord();
      var kies = document.getElementById("kies");
      if (kies && kies.classList.contains("on") && typeof drawKies === "function") drawKies();
      if (onRecept && typeof openRecipe === "function" && S.look) {
        try { openRecipe(S.look); } catch (e) {}
      }
    }
    var lijst = document.getElementById("lijst");
    if (lijst && lijst.classList.contains("on") && typeof drawList === "function") {
      if (typeof afterPaint === "function") afterPaint(function () { drawList(); });
      else drawList();
    }
  }

  window.WeAteAvond = {
    MODES: AVOND,
    modeOfDay: modeOfDay,
    isStatusOnly: isStatusOnly,
    dayIsFilled: dayIsFilled,
    setDayAvond: setDayAvond,
    labelFor: labelFor,
    hintFor: hintFor
  };
  window.dayAvond = modeOfDay;
  window.isUitEten = function (d) { return modeOfDay(d) === "uit"; };
  window.dayIsFilled = dayIsFilled;
  window.setDayAvond = setDayAvond;

  /* —— Bord: inject status into dayrows after paint —— */
  function enhanceBord() {
    var host = document.getElementById("days");
    if (!host || !S || !S.plan) return;
    host.querySelectorAll(".dayrow").forEach(function (row) {
      var d = row.getAttribute("data-d");
      if (!d) return;
      var m = modeOfDay(d);
      row.classList.remove("day-uit", "day-later", "day-anders", "day-weg", "day-filled", "day-empty");
      if (m !== "thuis") {
        row.classList.add("day-" + m);
        var title = row.querySelector("b");
        var meta = row.querySelector(".meta");
        if (title) title.textContent = labelFor(m);
        if (meta) meta.textContent = hintFor(m);
        var thumb = row.querySelector(".daythumb");
        if (!thumb) {
          thumb = document.createElement("div");
          thumb.className = "daythumb daythumb-status";
          thumb.setAttribute("aria-hidden", "true");
          var dow = row.querySelector(".dow");
          if (dow) row.insertBefore(thumb, dow.nextSibling);
          else row.insertBefore(thumb, row.firstChild);
        }
        thumb.className = "daythumb daythumb-status daythumb-" + m;
        /* replace gegeten / ensure one-tap terug */
        var oldBtn = row.querySelector("[data-act=gegeten]");
        if (oldBtn) oldBtn.remove();
        var oldTap = row.querySelector("[data-act=avondset]");
        if (oldTap) oldTap.remove();
        var badge = row.querySelector(".badge.avond");
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "badge avond avond-" + m;
          if (title && title.parentNode) title.parentNode.insertBefore(badge, title.nextSibling);
        }
        badge.className = "badge avond avond-" + m;
        badge.textContent = labelFor(m);
        var back = document.createElement("button");
        back.type = "button";
        back.className = "chip avondtap";
        back.setAttribute("data-act", "avondset");
        back.setAttribute("data-d", d);
        back.setAttribute("data-v", "thuis");
        back.textContent = "Thuis";
        row.appendChild(back);
      } else {
        var slot = S.plan[d];
        if (slot && slot.id) row.classList.add("day-filled");
        else {
          row.classList.add("day-empty");
          /* one-tap Uit eten on empty days */
          if (!row.querySelector("[data-act=avondset]")) {
            var tap = document.createElement("button");
            tap.type = "button";
            tap.className = "chip avondtap";
            tap.setAttribute("data-act", "avondset");
            tap.setAttribute("data-d", d);
            tap.setAttribute("data-v", "uit");
            tap.textContent = "Uit eten";
            row.appendChild(tap);
          }
        }
      }
    });
  }

  if (typeof drawBord === "function" && !drawBord._avond) {
    var _db = drawBord;
    drawBord = function () {
      _db.apply(this, arguments);
      enhanceBord();
    };
    drawBord._avond = true;
  }

  /* —— Kies: avondstatus strip —— */
  function paintKiesAvond() {
    var sc = document.querySelector("#kies .sc");
    if (!sc) return;
    var d = S && S.day;
    if (!d) return;
    var m = modeOfDay(d);
    var box = document.getElementById("avondstrip");
    if (!box) {
      box = document.createElement("div");
      box.id = "avondstrip";
      box.className = "avondstrip";
      sc.insertBefore(box, sc.firstChild);
    }
    var html = "<div class=sec>Avondstatus</div><div class=row avondrow>";
    AVOND.forEach(function (a) {
      html +=
        "<button type=button class='chip" +
        (m === a.id ? " on" : "") +
        (a.id === "uit" ? " avond-uit-chip" : "") +
        "' data-act=avondset data-d=" +
        d +
        " data-v=" +
        a.id +
        ">" +
        a.n +
        "</button>";
    });
    html += "</div>";
    if (m !== "thuis") {
      html +=
        "<div class='avondnote okbox'><b>" +
        labelFor(m) +
        "</b> — " +
        hintFor(m) +
        ". Geen recept nodig; niets op de Lijst.</div>";
      var recipes = document.getElementById("recipes");
      var cuis = document.getElementById("cuisines");
      var note = document.getElementById("kiesnote");
      if (recipes) recipes.style.display = "none";
      if (cuis) cuis.style.display = "none";
      if (note) note.style.display = "none";
    } else {
      var recipes2 = document.getElementById("recipes");
      var cuis2 = document.getElementById("cuisines");
      var note2 = document.getElementById("kiesnote");
      if (recipes2) recipes2.style.display = "";
      if (cuis2) cuis2.style.display = "";
      if (note2) note2.style.display = "";
    }
    box.innerHTML = html;
  }

  if (typeof drawKies === "function" && !drawKies._avond) {
    var _dk = drawKies;
    drawKies = function () {
      _dk.apply(this, arguments);
      paintKiesAvond();
    };
    drawKies._avond = true;
  }

  function paintReceptAvond() {
    var sc = document.querySelector("#recept .sc");
    if (!sc || !S) return;
    var d = S.day;
    if (!d) return;
    var box = document.getElementById("ravondstrip");
    if (!box) {
      box = document.createElement("div");
      box.id = "ravondstrip";
      box.className = "avondstrip";
      var rwho = document.getElementById("rwho");
      if (rwho && rwho.parentNode) rwho.parentNode.insertBefore(box, rwho);
      else sc.insertBefore(box, sc.firstChild);
    }
    var m = modeOfDay(d);
    var html = "<div class=sec>Avondstatus · " + (DLAB[d] || d) + "</div><div class=row avondrow>";
    AVOND.forEach(function (a) {
      html +=
        "<button type=button class='chip" +
        (m === a.id ? " on" : "") +
        "' data-act=avondset data-d=" +
        d +
        " data-v=" +
        a.id +
        ">" +
        a.n +
        "</button>";
    });
    html += "</div>";
    box.innerHTML = html;
  }

  if (typeof openRecipe === "function" && !openRecipe._avond) {
    var _or = openRecipe;
    openRecipe = function () {
      _or.apply(this, arguments);
      try { paintReceptAvond(); } catch (e) {}
    };
    openRecipe._avond = true;
  }

  /* —— Guard list / actie if status-only somehow still has id —— */
  if (typeof buildList === "function" && !buildList._avond) {
    var _bl = buildList;
    buildList = function () {
      var items = _bl.apply(this, arguments);
      /* buildList already skips missing id; status-only clears id */
      return items;
    };
    buildList._avond = true;
  }

  document.addEventListener(
    "click",
    function (e) {
      var t = e.target && e.target.closest && e.target.closest("[data-act=avondset]");
      if (!t) return;
      e.preventDefault();
      e.stopPropagation();
      var d = t.getAttribute("data-d") || (S && S.day);
      var v = t.getAttribute("data-v") || "thuis";
      if (!d) return;
      setDayAvond(d, v);
    },
    true
  );
})();
