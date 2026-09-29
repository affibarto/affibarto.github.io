/* A/B merk: per-regel zichtbaar + winkeltotalen herberekend (v82)
 * - itemBrand keys genormaliseerd (melk@Ma → melk) zodat toggle totals raakt
 * - Echte Folder/Actie A/B-prijzen als die er zijn; anders catalogus-indicatie
 * - Nooit verzonnen "bespaar €X"; wel eerlijk A €x · huismerk €y of "geen A/B-prijs"
 */
S.itemBrand = S.itemBrand || {};
S.brand = S.brand || "MIX";

function brandKey(k) {
  k = String(k || "");
  if (!k) return "";
  if (/^e:\d+:/.test(k)) return k;
  /* listview day keys: product@Ma or add:x@Ma#0 */
  var at = k.indexOf("@");
  if (at >= 0) k = k.slice(0, at);
  return k;
}
(function migrateBrandKeys(){
  var ib=S.itemBrand||{};
  var dirty=false;
  Object.keys(ib).forEach(function(k){
    var b=brandKey(k);
    if(b&&b!==k){
      if(ib[b]===undefined)ib[b]=ib[k];
      delete ib[k];
      dirty=true;
    }
    if(ib[b]==="auto"){delete ib[b];dirty=true;}
  });
  if(dirty&&typeof save==="function")try{save();}catch(e){}
})();


function brandHint() {
  return {
    A: "Standaard A-merk. Per regel hieronder te overrulen.",
    B: "Standaard huismerk. Per regel hieronder te overrulen.",
    MIX: "Mix: vers/koel A, houdbaar huismerk. Per regel te overrulen.",
    CHEAP: "Laagste indicatie per product. Per regel nog A of B zetten."
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

/** Catalogus-indicatie zonder Actie (A = base+aExtra, B = ~86%). */
function catalogBrandPrice(cat, retailer, brand) {
  if (!cat) return null;
  if ((cat.missing || []).includes(retailer)) return null;
  var base = cat[retailer];
  if (base == null) {
    if (retailer === "plus" || retailer === "picnic") base = cat.jumbo;
    else if (retailer === "dirk" || retailer === "aldi" || retailer === "dekamarkt" || retailer === "hoogvliet" || retailer === "vomar" || retailer === "ekoplaza") base = cat.lidl;
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

function dealTier(deal) {
  if (!deal) return "";
  if (typeof detectBrandTier === "function") {
    return detectBrandTier({
      b: deal.b || deal.brand || "",
      brand: deal.b || deal.brand || "",
      n: deal.n || deal.name || ""
    }) || "";
  }
  var brand = String(deal.b || deal.brand || "").trim();
  var name = String(deal.n || deal.name || "");
  var bl = (brand || name).toLowerCase();
  if (/^(ah|jumbo|plus|lidl|dirk|aldi|gwoon|picnic|hoogvliet|dekamarkt|vomar|ekoplaza|boni|euroshopper|everyday)\b/.test(bl)) return "B";
  if (brand) return "A";
  return "";
}

function bonusDeal(k, retailer) {
  k = brandKey(k);
  if (!k || typeof bonusOf !== "function") return null;
  var b = bonusOf(k, retailer);
  if (!b || b.now == null) return null;
  return {
    now: b.now,
    was: b.was,
    deal: b.deal || "",
    n: b.name || "",
    b: b.brand || "",
    brand: b.brand || "",
    name: b.name || "",
    sid: retailer,
    source: "bonus"
  };
}

/** Zoek Folder-hit voor dit product + gewenst merk (A of B). */
function folderDealForBrand(k, cat, brand, retailer) {
  k = brandKey(k);
  var items = (window.FOLDER_FULL && window.FOLDER_FULL.items) || [];
  if (!items.length || (brand !== "A" && brand !== "B")) return null;
  var needles = [];
  var label = (cat && (cat.label || cat.name)) || k;
  if (typeof _tokens === "function") {
    /* optional shared tokenizer not always exported */
  }
  var raw = String(label || "").toLowerCase().replace(/[^\wäöüßà-ÿ0-9]+/g, " ").split(/\s+/).filter(function (t) {
    return t.length >= 4;
  });
  needles = raw.slice(0, 4);
  if (k && k.length >= 3) needles.push(k.toLowerCase());
  if (window.WeAteProducts && typeof WeAteProducts.aliasesFor === "function") {
    try {
      (WeAteProducts.aliasesFor(k) || []).forEach(function (a) {
        var t = String(a || "").toLowerCase();
        if (t.length >= 3) needles.push(t);
      });
    } catch (e) {}
  }
  var best = null, bestScore = 0;
  for (var i = 0; i < items.length; i++) {
    var r = items[i];
    if (!r || r.now == null) continue;
    if (retailer && r.s && r.s !== retailer) continue;
    var tier = dealTier(r);
    if (tier !== brand) continue;
    var hay = (r.n + " " + (r.b || "") + " " + (r.qty || r.q || "")).toLowerCase();
    var score = 0;
    for (var j = 0; j < needles.length; j++) {
      if (needles[j] && hay.indexOf(needles[j]) >= 0) score += needles[j].length >= 5 ? 3 : 2;
    }
    if (k && hay.indexOf(String(k).toLowerCase()) >= 0) score += 4;
    if (score > bestScore) {
      bestScore = score;
      best = r;
    }
  }
  if (bestScore < 5 || !best) return null;
  return {
    now: best.now,
    was: best.was,
    deal: best.deal || "",
    n: best.n || "",
    b: best.b || "",
    brand: best.b || "",
    name: best.n || "",
    sid: best.s || retailer,
    source: "folder"
  };
}

/**
 * Beste unit-prijs voor één merk over activeStores.
 * Voorkeur: Actie/Folder die bij het merk past → anders catalogus-indicatie.
 */
function bestPriceForBrand(cat, k, brand) {
  k = brandKey(k);
  var stores = activeStoreIds();
  var best = null;
  var meta = null;
  stores.forEach(function (sid) {
    var deal = bonusDeal(k, sid);
    if (deal) {
      var t = dealTier(deal);
      /* Merk-mismatch: Actie niet forceren — zoek folder-alternatief of catalogus. */
      if (t && brand && brand !== "laagste" && t !== brand) deal = null;
    }
    if (!deal) deal = folderDealForBrand(k, cat, brand === "laagste" ? null : brand, sid);
    if (brand === "laagste") {
      /* pick later */
    }
    var pr = null;
    var src = "cat";
    if (deal && deal.now != null) {
      pr = deal.now;
      src = deal.source || "actie";
    } else {
      pr = catalogBrandPrice(cat, sid, brand === "laagste" ? null : brand);
    }
    if (pr == null || !isFinite(pr)) return;
    if (best == null || pr < best) {
      best = pr;
      meta = { sid: sid, cents: pr, source: src, deal: deal };
    }
  });
  return { cents: best, meta: meta };
}

/**
 * A/B prijspaar voor één lijstregel.
 * paired=true alleen bij echt verschil (Actie/Folder of catalogus-indicatie).
 */
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
    var nA = 0, nB = 0, nPair = 0, nSame = 0;
    items.forEach(function (i) {
      var eb = effectiveBrand(i);
      if (eb === "B") nB++;
      else if (eb === "A") nA++;
      var pair = abPricePair(i.cat, i.k);
      if (pair.paired) nPair++;
      else nSame++;
    });
    s.textContent =
      nA + "× A-merk · " + nB + "× huismerk · " +
      (nPair ? nPair + " regels met prijsverschil" : "geen A/B-prijsverschil in data") +
      ". Indicatie, geen kassaprijs.";
  }
}

/** Wrap unitPrice: genormaliseerde override + merk-passende Actie. */
if (typeof unitPrice === "function" && !unitPrice._brandWrapped82) {
  var _up = unitPrice._raw || unitPrice;
  unitPrice._raw = _up;
  unitPrice = function (cat, retailer, brand, k) {
    var key = brandKey(k);
    var ov = key && S.itemBrand && S.itemBrand[key];
    if (ov === "A" || ov === "B") brand = ov;

    if (brand === "laagste") {
      /* Tijdelijk override uit zodat A én B berekend worden. */
      var had = key && S.itemBrand && Object.prototype.hasOwnProperty.call(S.itemBrand, key);
      var prev = had ? S.itemBrand[key] : null;
      if (had) delete S.itemBrand[key];
      var pA = unitPrice(cat, retailer, "A", key);
      var pB = unitPrice(cat, retailer, "B", key);
      if (had) S.itemBrand[key] = prev;
      if (pA == null) return pB;
      if (pB == null) return pA;
      return Math.min(pA, pB);
    }

    /* Actie alleen meenemen als merk past (of onbekend). */
    if (key) {
      var deal = bonusDeal(key, retailer);
      if (deal) {
        var t = dealTier(deal);
        if (!brand || brand === "MIX" || !t || t === brand) return deal.now;
        /* mismatch → folder-alternatief voor dit merk */
        var alt = folderDealForBrand(key, cat, brand, retailer);
        if (alt && alt.now != null) return alt.now;
        return catalogBrandPrice(cat, retailer, brand);
      }
      if (brand === "A" || brand === "B") {
        var fd = folderDealForBrand(key, cat, brand, retailer);
        if (fd && fd.now != null) return fd.now;
      }
    }
    return catalogBrandPrice(cat, retailer, brand);
  };
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
  return (
    "<span class=abpick data-k=\"" + String(brandKey(k)).replace(/"/g, "") + "\">" +
      "<button type=button class=\"chip s abchip" + aOn + "\" data-act=itembrand data-k=\"" + String(brandKey(k)).replace(/"/g, "") + "\" data-b=A title=\"A-merk\">A " + aTxt + "</button>" +
      "<button type=button class=\"chip s abchip" + bOn + "\" data-act=itembrand data-k=\"" + String(brandKey(k)).replace(/"/g, "") + "\" data-b=B title=\"Huismerk\">B " + bTxt + "</button>" +
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
      /* zet vóór qtybox/price indien aanwezig, anders achteraan */
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
      /*zelfde tik = terug naar auto (volgt standaard) */
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

try {
  paintBrand();
  if (document.getElementById("lijst") && document.getElementById("lijst").classList.contains("on")) stampItemBrands();
} catch (e) {}
