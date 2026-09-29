/* A/B merk + winkeltotalen (v83)
 * - Strict Actie-match (zelfde regels als folder.js) — géén petfood/rijst-mismatches
 * - Huismerken (1 de Beste, AH, Jumbo, …) = B-tier
 * - Per winkel+regel: priceB ≤ priceA (eerlijke fallback), mix = aisle A/B, goedkoopst = min
 * - Indicatie, geen kassaprijs; geen verzonnen "bespaar"
 */
S.itemBrand = S.itemBrand || {};
S.brand = S.brand || "MIX";

function brandKey(k) {
  k = String(k || "");
  if (!k) return "";
  if (/^e:\d+:/.test(k)) return k;
  var at = k.indexOf("@");
  if (at >= 0) k = k.slice(0, at);
  return k;
}
(function migrateBrandKeys(){
  var ib = S.itemBrand || {};
  var dirty = false;
  Object.keys(ib).forEach(function (k) {
    var b = brandKey(k);
    if (b && b !== k) {
      if (ib[b] === undefined) ib[b] = ib[k];
      delete ib[k];
      dirty = true;
    }
    if (ib[b] === "auto") { delete ib[b]; dirty = true; }
  });
  if (dirty && typeof save === "function") try { save(); } catch (e) {}
})();

function brandHint() {
  return {
    A: "Standaard A-merk. Per regel hieronder te overrulen.",
    B: "Standaard huismerk. Per regel hieronder te overrulen.",
    MIX: "Mix: vers/koel A, houdbaar huismerk. Per regel te overrulen.",
    CHEAP: "Laagste prijs per product (A of huismerk). Per regel nog A of B zetten."
  }[S.brand] || "";
}

function extraBrandTier(k) {
  if (!k || String(k).indexOf("e:") !== 0 || !S.extras) return "";
  var m = String(k).match(/^e:(\d+):(.*)$/);
  if (!m) return "";
  var name = m[2], idx = +m[1];
  var ex = S.extras[idx];
  if (ex && ex.n === name && (ex.brandTier === "A" || ex.brandTier === "B")) return ex.brandTier;
  for (var i = 0; i < S.extras.length; i++) {
    ex = S.extras[i];
    if (ex && ex.n === name && (ex.brandTier === "A" || ex.brandTier === "B")) return ex.brandTier;
  }
  return "";
}

function itemMode(k) {
  k = brandKey(k);
  var v = S.itemBrand && S.itemBrand[k];
  if (v === "A" || v === "B" || v === "auto") return v;
  var fb = extraBrandTier(k);
  if (fb === "A" || fb === "B") return fb;
  return "auto";
}

function effectiveBrand(item) {
  var ov = itemMode(item && item.k);
  if (ov === "A" || ov === "B") return ov;
  if (S.brand === "A" || S.brand === "B") return S.brand;
  if (S.brand === "CHEAP") return "laagste";
  var aisle = (item && (item.aisle || (item.cat && item.cat.aisle))) || "";
  return (aisle === "Vers" || aisle === "Koeling") ? "A" : "B";
}

function euroc(c) {
  if (c == null || !isFinite(c)) return "—";
  return "\u20ac" + ((+c) / 100).toFixed(2).replace(".", ",");
}

function activeStoreIds() {
  var stores = typeof activeStores === "function" ? activeStores() : (typeof STORES !== "undefined" ? STORES : []);
  return stores.map(function (r) { return r.id || r; });
}

function productEntry(cat, k) {
  k = brandKey(k);
  return {
    n: (cat && (cat.label || cat.name)) || k,
    k: k,
    aisle: (cat && cat.aisle) || ""
  };
}

/** Catalogus-indicatie (A = base+aExtra, B ≈ 86%). */
function catalogBrandPrice(cat, retailer, brand) {
  if (!cat) return null;
  if ((cat.missing || []).includes(retailer)) return null;
  var base = cat[retailer];
  if (base == null) {
    if (retailer === "plus" || retailer === "picnic") base = cat.jumbo;
    else if (
      retailer === "dirk" || retailer === "aldi" || retailer === "dekamarkt" ||
      retailer === "hoogvliet" || retailer === "vomar" || retailer === "ekoplaza"
    ) base = cat.lidl;
    else return null;
  }
  if (base == null || !isFinite(base)) return null;
  if (brand === "A") return base + (cat.aExtra || 0);
  if (brand === "B") return Math.round(base * 0.86);
  if (brand === "MIX") {
    return ["Koeling", "Vers"].includes(cat.aisle)
      ? base + Math.round((cat.aExtra || 0) * 0.35)
      : Math.round(base * 0.9);
  }
  return base;
}

var _HOUSE_BRAND =
  /^(ah|albert\s*heijn|jumbo|plus|lidl|dirk|aldi|gwoon|g['\u2019]?woon|picnic|hoogvliet|dekamarkt|vomar|ekoplaza|boni|euro\s*shopper|everyday|1\s*de\s*beste|eerlijke\s*prijs|garant|tasty)\b/i;

var _FOOD_LEAD =
  /^(pasta|spaghetti|penne|melk|kip|kipfilet|rijst|ui|uien|wortel|wortelen|aardappel|aardappelen|kaas|tomaat|tomaten|brood|sla|spinazie|boter|ham|paprika|gehakt|yoghurt|kwark|ei|eieren|zalm|pesto|wraps|wrap|champignon|champignons|komkommer|fruit|hagelslag|lasagne|mozzarella|rookworst|beleg)$/i;

/**
 * A vs huismerk uit deal brand/naam.
 * "1 de Beste …", "AH …", "Jumbo …" → B. Merknaam vooraan → A. Anders "".
 */
function detectBrandTier(deal) {
  if (!deal) return "";
  var brand = String(deal.b || deal.brand || "").trim();
  var name = String(deal.n || deal.name || "").trim();
  if (brand && _HOUSE_BRAND.test(brand)) return "B";
  if (!brand && name && _HOUSE_BRAND.test(name)) return "B";
  if (brand) return "A";
  if (name) {
    var first = name.split(/\s+/)[0] || "";
    if (first && !_FOOD_LEAD.test(first) && !/^\d/.test(first) && /^[A-ZÀ-Ýa-zà-ÿ]/.test(first)) {
      /* Hak, Knorr, Arla, Campina, De Cecco, … */
      if (!_HOUSE_BRAND.test(first)) return "A";
    }
  }
  return "";
}

function dealRowFromBonus(b, retailer) {
  if (!b) return null;
  return {
    n: b.name || b.n || "",
    b: b.brand || b.b || "",
    brand: b.brand || b.b || "",
    name: b.name || b.n || "",
    now: b.now,
    was: b.was,
    deal: b.deal || "",
    s: retailer,
    sid: retailer,
    source: "bonus"
  };
}

/** Bonus alleen als titel strikt bij product past (folder.js-regels). */
function strictBonusDeal(k, cat, retailer) {
  k = brandKey(k);
  if (!k || typeof bonusOf !== "function") return null;
  var b = bonusOf(k, retailer);
  if (!b || b.now == null) return null;
  var row = dealRowFromBonus(b, retailer);
  var entry = productEntry(cat, k);
  if (typeof dealMatchesEntry === "function") {
    if (!dealMatchesEntry(row, entry)) return null;
  } else {
    /* Minimale fallback zonder folder.js */
    var hay = String(row.n || "").toLowerCase();
    var key = String(k).toLowerCase();
    if (!hay || (key.length >= 3 && hay.indexOf(key) < 0)) return null;
    if (/smuldier|purina|pedigree|olvarit|honden|katten|knijpfruit/i.test(hay)) return null;
  }
  row.tier = detectBrandTier(row);
  return row;
}

/** Strict folder-hit voor gewenst merk bij deze retailer. */
function strictFolderDeal(k, cat, brand, retailer) {
  k = brandKey(k);
  if (typeof dealsForProduct !== "function") return null;
  if (brand !== "A" && brand !== "B" && brand !== "laagste" && brand) return null;
  var entry = productEntry(cat, k);
  var hits = dealsForProduct(entry) || [];
  var best = null;
  for (var i = 0; i < hits.length; i++) {
    var r = hits[i];
    if (!r || r.now == null) continue;
    if (retailer && r.s && r.s !== retailer) continue;
    var t = detectBrandTier(r);
    if (brand === "A" || brand === "B") {
      if (t && t !== brand) continue;
      /* unbranded (t==="") mag voor beide — bekende schaprijjs */
    }
    if (!best || r.now < best.now) {
      best = {
        now: r.now,
        was: r.was,
        deal: r.deal || "",
        n: r.n || "",
        b: r.b || "",
        brand: r.b || "",
        name: r.n || "",
        sid: r.s || retailer,
        s: r.s || retailer,
        source: "folder",
        tier: t || ""
      };
    }
  }
  return best;
}

/**
 * Per winkel + product: A- en B-centen.
 * - Actie/Folder alleen bij strikte match + passende tier
 * - Ontbrekende B → eerlijk A (of catalogus-B); nooit B > A op dezelfde regel
 */
function storeLinePrices(cat, retailer, k) {
  k = brandKey(k);
  var catalogA = catalogBrandPrice(cat, retailer, "A");
  var catalogB = catalogBrandPrice(cat, retailer, "B");
  var a = null, b = null, aSrc = "cat", bSrc = "cat";

  var bonus = strictBonusDeal(k, cat, retailer);
  if (bonus) {
    var t = bonus.tier || detectBrandTier(bonus);
    if (!t) {
      a = bonus.now; b = bonus.now; aSrc = bSrc = bonus.source || "actie";
    } else if (t === "A") {
      a = bonus.now; aSrc = bonus.source || "actie";
    } else if (t === "B") {
      b = bonus.now; bSrc = bonus.source || "actie";
    }
  }

  if (a == null) {
    var fdA = strictFolderDeal(k, cat, "A", retailer);
    if (fdA) { a = fdA.now; aSrc = "folder"; }
    else { a = catalogA; aSrc = "cat"; }
  }
  if (b == null) {
    var fdB = strictFolderDeal(k, cat, "B", retailer);
    if (fdB) { b = fdB.now; bSrc = "folder"; }
    else if (a != null && aSrc !== "cat") {
      /* Geen huismerk-actie: gebruik bekende A-prijs i.p.v. duurdere catalogus-B */
      b = a; bSrc = aSrc;
    } else {
      b = catalogB; bSrc = "cat";
    }
  }

  if (a == null && b != null) { a = b; aSrc = bSrc; }
  if (b == null && a != null) { b = a; bSrc = aSrc; }

  /* Invariant: huismerk nooit duurder dan A op dezelfde regel */
  if (a != null && b != null && b > a) {
    b = a;
    bSrc = aSrc;
  }

  return {
    a: a,
    b: b,
    aSrc: aSrc,
    bSrc: bSrc,
    paired: a != null && b != null && a !== b,
    real: (aSrc !== "cat") || (bSrc !== "cat")
  };
}

/** unitPrice voor één merkvoorkeur op één winkel. */
function priceForBrandPref(cat, retailer, brand, k) {
  var p = storeLinePrices(cat, retailer, k);
  if (brand === "laagste" || brand === "CHEAP") {
    if (p.a == null) return p.b;
    if (p.b == null) return p.a;
    return Math.min(p.a, p.b);
  }
  if (brand === "B") return p.b;
  if (brand === "A") return p.a;
  if (brand === "MIX") {
    var aisle = (cat && cat.aisle) || "";
    if (aisle === "Vers" || aisle === "Koeling") return p.a;
    return p.b;
  }
  return p.a;
}

function bestPriceForBrand(cat, k, brand) {
  k = brandKey(k);
  var stores = activeStoreIds();
  var best = null, meta = null;
  stores.forEach(function (sid) {
    var p = storeLinePrices(cat, sid, k);
    var pr = null, src = "cat";
    if (brand === "laagste") {
      if (p.a == null) { pr = p.b; src = p.bSrc; }
      else if (p.b == null) { pr = p.a; src = p.aSrc; }
      else if (p.a <= p.b) { pr = p.a; src = p.aSrc; }
      else { pr = p.b; src = p.bSrc; }
    } else if (brand === "B") { pr = p.b; src = p.bSrc; }
    else if (brand === "A") { pr = p.a; src = p.aSrc; }
    else {
      var aisle = (cat && cat.aisle) || "";
      if (aisle === "Vers" || aisle === "Koeling") { pr = p.a; src = p.aSrc; }
      else { pr = p.b; src = p.bSrc; }
    }
    if (pr == null || !isFinite(pr)) return;
    if (best == null || pr < best) {
      best = pr;
      meta = { sid: sid, cents: pr, source: src };
    }
  });
  return { cents: best, meta: meta };
}

function abPricePair(cat, k) {
  k = brandKey(k);
  var a = bestPriceForBrand(cat, k, "A");
  var b = bestPriceForBrand(cat, k, "B");
  var paired = a.cents != null && b.cents != null && a.cents !== b.cents;
  var real =
    (a.meta && a.meta.source !== "cat") ||
    (b.meta && b.meta.source !== "cat");
  return {
    k: k,
    a: a.cents,
    b: b.cents,
    paired: paired,
    real: !!real,
    aMeta: a.meta,
    bMeta: b.meta
  };
}

function setItemBrand(k, brand) {
  k = brandKey(k);
  if (!k) return;
  S.itemBrand = S.itemBrand || {};
  if (brand === "A" || brand === "B") S.itemBrand[k] = brand;
  else delete S.itemBrand[k];
}

function refreshBrandUi() {
  if (typeof save === "function") save();
  if (typeof drawList === "function") drawList();
  else {
    paintBrand();
    stampItemBrands();
  }
  if (typeof paintScore === "function") paintScore();
  if (typeof paintStores === "function") paintStores();
  else if (typeof drawStores === "function") drawStores();
}

function paintBrand() {
  document.querySelectorAll(".brandbar .chip").forEach(function (c) {
    c.classList.toggle("on", c.dataset.b === S.brand);
    if (c.dataset.b === "A") c.classList.toggle("hard", S.brand === "A");
  });
  var h = brandHint();
  var a = document.getElementById("lijstbrandhint");
  if (a) a.textContent = h;
  var b = document.getElementById("winkelbrandhint");
  if (b) b.textContent = h;
  var s = document.getElementById("brandsave");
  if (s && typeof buildList === "function") {
    var items = buildList().filter(function (i) { return !(S.checked && S.checked[i.k]); });
    var nA = 0, nB = 0, nPair = 0;
    items.forEach(function (i) {
      var eb = effectiveBrand(i);
      if (eb === "B") nB++;
      else if (eb === "A") nA++;
      var pair = abPricePair(i.cat, i.k);
      if (pair.paired) nPair++;
    });
    s.textContent =
      nA + "× A-merk · " + nB + "× huismerk · " +
      (nPair ? nPair + " regels met prijsverschil" : "geen A/B-prijsverschil in data") +
      ". Indicatie, geen kassaprijs.";
  }
}

/** Wrap unitPrice: genormaliseerde override + strikte merkprijzen. */
if (typeof unitPrice === "function" && !unitPrice._brandWrapped83) {
  var _up = unitPrice._raw || unitPrice;
  unitPrice._raw = _up;
  unitPrice = function (cat, retailer, brand, k) {
    var key = brandKey(k);
    var ov = key && S.itemBrand && S.itemBrand[key];
    if (ov === "A" || ov === "B") brand = ov;
    return priceForBrandPref(cat, retailer, brand, key);
  };
  unitPrice._brandWrapped83 = true;
  unitPrice._brandWrapped82 = true;
  unitPrice._wrapped = true;
}

function abLineHtml(k, cat) {
  var pair = abPricePair(cat, k);
  var mode = itemMode(k);
  var eb;
  if (mode === "A" || mode === "B") eb = mode;
  else {
    eb = effectiveBrand({ k: k, cat: cat, aisle: cat && cat.aisle });
  }
  var aOn = eb === "A" ? " on hard" : "";
  var bOn = eb === "B" ? " on" : "";
  var hint;
  if (pair.a == null && pair.b == null) {
    hint = "<span class=abhint>geen prijs</span>";
  } else if (!pair.paired) {
    hint = "<span class=abhint>geen A/B-prijs</span>";
  } else {
    var delta = Math.abs(pair.a - pair.b);
    hint =
      "<span class=abhint>" +
      (pair.real ? "Actie/Folder" : "indicatie") +
      " · \u0394 " + euroc(delta) +
      "</span>";
  }
  var aTxt = pair.a != null ? euroc(pair.a) : "—";
  var bTxt = pair.b != null ? euroc(pair.b) : "—";
  var esc = String(brandKey(k)).replace(/"/g, "");
  return (
    "<span class=abpick data-k=\"" + esc + "\">" +
      "<button type=button class=\"chip s abchip" + aOn + "\" data-act=itembrand data-k=\"" + esc + "\" data-b=A title=\"A-merk\">A " + aTxt + "</button>" +
      "<button type=button class=\"chip s abchip" + bOn + "\" data-act=itembrand data-k=\"" + esc + "\" data-b=B title=\"Huismerk\">B " + bTxt + "</button>" +
      hint +
    "</span>"
  );
}

function stampItemBrands() {
  var root = document.getElementById("lijstbody");
  if (!root) return;
  root.querySelectorAll(".swipewrap").forEach(function (w) {
    var k = w.dataset.k;
    if (!k) return;
    var base = brandKey(k);
    var cat = (typeof CAT !== "undefined" && CAT[base]) ? CAT[base] : null;
    if (!cat && S.extras && /^e:/.test(base)) {
      var m = base.match(/^e:(\d+):/);
      var ex = m && S.extras[+m[1]];
      if (ex) cat = { name: ex.n, aisle: ex.s || "Houdbaar", ah: ex.cents || 0, jumbo: ex.cents || 0, lidl: ex.cents || 0, aExtra: 0 };
    }
    var row = w.querySelector(".listrow");
    if (!row) return;
    var host = row.querySelector(".abpick");
    var html = abLineHtml(base, cat);
    if (host) {
      host.outerHTML = html;
    } else {
      var wrap = document.createElement("div");
      wrap.innerHTML = html;
      var node = wrap.firstChild;
      var qty = row.querySelector(".qtybox, .qtyn, .price");
      if (qty) row.insertBefore(node, qty);
      else row.appendChild(node);
    }
  });
}

document.addEventListener("click", function (e) {
  var ib = e.target.closest && e.target.closest("[data-act=itembrand]");
  if (ib) {
    e.preventDefault();
    e.stopPropagation();
    var k = ib.getAttribute("data-k");
    var want = ib.getAttribute("data-b");
    var cur = itemMode(k);
    if (want === "A" || want === "B") {
      if (cur === want) setItemBrand(k, "auto");
      else setItemBrand(k, want);
    } else {
      var order = ["auto", "A", "B"];
      if (cur !== "auto" && cur !== "A" && cur !== "B") cur = "auto";
      setItemBrand(k, order[(order.indexOf(cur) + 1) % 3]);
    }
    var next = itemMode(k);
    if (typeof toast === "function") {
      toast(next === "A" ? "Dit product: A-merk" : next === "B" ? "Dit product: huismerk" : "Dit product volgt de standaard");
    }
    refreshBrandUi();
    return;
  }
  var t = e.target.closest && e.target.closest(".brandbar [data-b]");
  if (!t) return;
  S.brand = t.dataset.b;
  if (typeof toast === "function") {
    toast(
      S.brand === "A" ? "Standaard: A-merk" :
      S.brand === "B" ? "Standaard: huismerk" :
      S.brand === "CHEAP" ? "Standaard: laagste indicatie" :
      "Standaard: mix"
    );
  }
  refreshBrandUi();
});

if (typeof drawList === "function" && !drawList._brandWrap) {
  var _dl = drawList;
  drawList = function () {
    _dl();
    paintBrand();
    stampItemBrands();
  };
  drawList._brandWrap = true;
}
if (typeof drawStores === "function" && !drawStores._brandWrap) {
  var _ds = drawStores;
  drawStores = function () {
    _ds();
    paintBrand();
  };
  drawStores._brandWrap = true;
}

window.brandKey = brandKey;
window.itemMode = itemMode;
window.effectiveBrand = effectiveBrand;
window.abPricePair = abPricePair;
window.paintBrand = paintBrand;
window.stampItemBrands = stampItemBrands;
window.setItemBrand = setItemBrand;
window.bestPriceForBrand = bestPriceForBrand;
window.storeLinePrices = storeLinePrices;
window.priceForBrandPref = priceForBrandPref;
window.detectBrandTier = detectBrandTier;
window.catalogBrandPrice = catalogBrandPrice;

try {
  paintBrand();
  if (document.getElementById("lijst") && document.getElementById("lijst").classList.contains("on")) stampItemBrands();
} catch (e) {}
