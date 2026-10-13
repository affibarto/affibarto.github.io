#!/usr/bin/env node
/**
 * WeAte — verify A/B/mix store-total invariants against live bonus.json.
 * Run: node scripts/check-brand-totals.js
 * Exit 1 on failure.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const bonus = JSON.parse(fs.readFileSync(path.join(root, "bonus.json"), "utf8"));

function P(name, aisle, cents, extra) {
  return Object.assign(
    { name, aisle, ah: cents, jumbo: cents - 10, lidl: Math.max(40, cents - 25), picnic: cents + 8, missing: [], aExtra: 35 },
    extra || {}
  );
}
const CAT = {
  pasta: P("pasta 500g", "Houdbaar", 189),
  melk: P("halfvolle melk 1,5L", "Koeling", 119),
  kip: P("kipfilet 600g", "Koeling", 449),
  rijst: P("rijst 1kg", "Houdbaar", 159),
  ui: P("uien 1kg", "Vers", 89),
  wortel: P("wortelen 1kg", "Vers", 99),
  aardappel: P("aardappelen 3kg", "Vers", 199),
  kaas: P("geraspte kaas 200g", "Koeling", 249),
  tomaat: P("tomatenblokjes 400g", "Houdbaar", 79),
  brood: P("heel brood", "Vers", 189),
  sla: P("ijsbergsla", "Vers", 119, { label: "IJsbergsla" }),
  spinazie: P("spinazie diepvries", "Vers", 149, { label: "Spinazie" }),
  mozzarella: P("mozzarella", "Koeling", 199, { label: "Mozzarella" }),
  boter: P("roomboter", "Koeling", 219, { label: "Roomboter" }),
  ham: P("achterham", "Koeling", 279, { label: "Achterham" }),
  paprika: P("paprika 3-pack", "Vers", 99, { label: "Paprika" }),
};
const LIST = Object.keys(CAT).map((k) => ({ k, cat: CAT[k], q: 1, aisle: CAT[k].aisle, n: CAT[k].name }));
const STORES = ["dirk", "ah", "lidl", "jumbo", "plus"];

const HOUSE =
  /^(ah|albert\s*heijn|jumbo|plus|lidl|dirk|aldi|gwoon|g['\u2019]?woon|picnic|hoogvliet|dekamarkt|vomar|ekoplaza|boni|euro\s*shopper|everyday|1\s*de\s*beste|eerlijke\s*prijs|garant|tasty)\b/i;
const FOOD_LEAD =
  /^(pasta|spaghetti|penne|melk|kip|kipfilet|rijst|ui|uien|wortel|wortelen|aardappel|aardappelen|kaas|tomaat|tomaten|brood|sla|spinazie|boter|ham|paprika|gehakt|yoghurt|kwark|ei|eieren|zalm|pesto|wraps|wrap|champignon|champignons|komkommer|fruit|hagelslag|lasagne|mozzarella|rookworst|beleg)$/i;

const STOP = { voor: 1, met: 1, van: 1, een: 1, het: 1, de: 1, en: 1, per: 1, stuks: 1, pack: 1, doos: 1, vers: 1 };
const CORE = { kaas: 1, melk: 1, ui: 1, uien: 1, ei: 1, eieren: 1, ham: 1, sla: 1, rijst: 1, kip: 1, kipfilet: 1, pasta: 1, boter: 1, gehakt: 1, brood: 1, zalm: 1, spinazie: 1, yoghurt: 1, tomaat: 1, tomaten: 1, paprika: 1, mozzarella: 1 };
const SNACK = { chips: 1, chip: 1, snoep: 1, koek: 1, reep: 1, snack: 1, pringles: 1, biscuit: 1, chocolade: 1, milka: 1, tablet: 1, peanuts: 1, pinda: 1, pindas: 1, nootjes: 1, noten: 1, nuts: 1 };
const DISH = { saus: 1, sauce: 1, soep: 1, salade: 1, salad: 1, maaltijd: 1, pizza: 1, wrap: 1, wraps: 1, burger: 1, nugget: 1, pan: 1, schotel: 1, poeder: 1, carbonara: 1, bolognese: 1, frito: 1, creations: 1, sensatie: 1, piccolinis: 1, olvarit: 1, mix: 1, kruidenmix: 1, good: 1, tomato: 1, hutspot: 1, stamppot: 1, trattoria: 1, toscana: 1, rondo: 1, rondos: 1, schnitzel: 1 };
const SIMPLE = { pasta: 1, pesto: 1, spinazie: 1, tomaat: 1, paprika: 1, kaas: 1, melk: 1, boter: 1, rijst: 1, gehakt: 1, kip: 1, ui: 1, uien: 1, sla: 1, ham: 1, aardappel: 1, wortel: 1, brood: 1, yoghurt: 1 };
const FRESH = { paprika: 1, ui: 1, uien: 1, tomaat: 1, sla: 1, aardappel: 1, wortel: 1, spinazie: 1 };

function words(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^\wäöüßà-ÿ0-9]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}
function isToken(t) {
  if (!t || STOP[t] || /^\d/.test(t)) return false;
  if (t.length >= 5) return true;
  return !!CORE[t];
}
function needTokens(k, name) {
  const keyLow = String(k || "").toLowerCase();
  const labelToks = words(name).filter(isToken);
  const spec = labelToks.filter(
    (t) => t !== keyLow && (t.indexOf(keyLow) === 0 || keyLow.indexOf(t) === 0)
  );
  if (spec.length) {
    spec.sort((a, b) => b.length - a.length);
    return [spec[0]];
  }
  if (isToken(keyLow) || CORE[keyLow] || keyLow.length >= 2) return [keyLow];
  return labelToks;
}
const ALIASES = {
  pasta: ["spaghetti", "penne", "fusilli", "macaroni"],
  kip: ["kipfilet", "kipfilets"],
  sla: ["ijsbergsla", "kropsla"],
  ham: ["achterham"],
  aardappel: ["aardappelen"],
  ui: ["uien"],
  wortel: ["wortelen"],
  mozzarella: ["mozzarella"],
};
function aliasNeedSets(k) {
  return (ALIASES[k] || []).map((a) => words(a).filter(isToken)).filter((t) => t.length);
}
function dishReject(titleWords, k, need) {
  const main = need[0] || "";
  for (const w of titleWords) {
    if (DISH[w]) return true;
  }
  if (main === "pasta" || k === "pasta") {
    if (titleWords.includes("pesto") || titleWords.includes("saus")) return true;
  }
  return false;
}
function dealMatchesEntry(r, entry) {
  const titleWords = words(r.n);
  const titleSet = {};
  titleWords.forEach((t) => (titleSet[t] = 1));
  const titleSnack = titleWords.some((w) => SNACK[w]);
  function tryNeed(need) {
    if (!need || !need.length) return false;
    for (const n of need) if (!titleSet[n]) return false;
    const simple =
      entry.aisle === "Vers" ||
      SIMPLE[entry.k] ||
      FRESH[entry.k] ||
      need.some((t) => SIMPLE[t] || FRESH[t]);
    if (simple && titleSnack) return false;
    if (simple && dishReject(titleWords, entry.k, need)) return false;
    if (/smuldier|purina|pedigree|olvarit|honden|katten|knijpfruit|catisfaction/i.test(r.n || ""))
      return false;
    return true;
  }
  if (tryNeed(needTokens(entry.k, entry.n))) return true;
  for (const set of aliasNeedSets(entry.k)) {
    if (tryNeed(set)) return true;
  }
  return false;
}

function detectBrandTier(deal) {
  if (!deal) return "";
  const brand = String(deal.b || deal.brand || "").trim();
  const name = String(deal.n || deal.name || "").trim();
  if (brand && HOUSE.test(brand)) return "B";
  if (!brand && name && HOUSE.test(name)) return "B";
  if (brand) return "A";
  if (name) {
    const first = name.split(/\s+/)[0] || "";
    if (first && !FOOD_LEAD.test(first) && !/^\d/.test(first) && /^[A-ZÀ-Ýa-zà-ÿ]/.test(first)) {
      if (!HOUSE.test(first)) return "A";
    }
  }
  return "";
}

function catalogBrandPrice(cat, retailer, brand) {
  if (!cat) return null;
  let base = cat[retailer];
  if (base == null) {
    if (retailer === "plus" || retailer === "picnic") base = cat.jumbo;
    else if (["dirk", "aldi", "dekamarkt", "hoogvliet", "vomar", "ekoplaza"].includes(retailer)) base = cat.lidl;
    else return null;
  }
  if (brand === "A") return base + (cat.aExtra || 0);
  if (brand === "B") return Math.round(base * 0.86);
  return base;
}

function bonusOf(k, r) {
  return (bonus[r] && bonus[r][k]) || null;
}

/** BEFORE (v82-ish): accept any bonus, weak tier, no clamp */
function unitPriceBefore(cat, retailer, brand, k) {
  const b = bonusOf(k, retailer);
  if (b) {
    const brandField = b.brand || "";
    const name = b.name || "";
    const bl = (brandField || name).toLowerCase();
    let t = "";
    if (/^(ah|jumbo|plus|lidl|dirk|aldi|gwoon|picnic|hoogvliet|dekamarkt|vomar|ekoplaza|boni|euroshopper|everyday)\b/.test(bl)) t = "B";
    else if (brandField) t = "A";
    if (!brand || brand === "MIX" || !t || t === brand) return b.now;
    return catalogBrandPrice(cat, retailer, brand);
  }
  return catalogBrandPrice(cat, retailer, brand);
}

/** AFTER (v83): strict match + house brands + B≤A */
function storeLinePricesAfter(cat, retailer, k) {
  let catalogA = catalogBrandPrice(cat, retailer, "A");
  let catalogB = catalogBrandPrice(cat, retailer, "B");
  let a = null, b = null, aSrc = "cat", bSrc = "cat";
  const raw = bonusOf(k, retailer);
  if (raw && raw.now != null) {
    const row = { n: raw.name || "", b: raw.brand || "", name: raw.name || "", brand: raw.brand || "" };
    const entry = { n: cat.label || cat.name || k, k, aisle: cat.aisle || "" };
    if (dealMatchesEntry(row, entry)) {
      const t = detectBrandTier(row);
      if (!t) {
        a = raw.now; b = raw.now; aSrc = bSrc = "actie";
      } else if (t === "A") {
        a = raw.now; aSrc = "actie";
      } else if (t === "B") {
        b = raw.now; bSrc = "actie";
      }
    }
  }
  if (a == null) { a = catalogA; aSrc = "cat"; }
  if (b == null) {
    if (a != null && aSrc !== "cat") { b = a; bSrc = aSrc; }
    else { b = catalogB; bSrc = "cat"; }
  }
  if (a == null && b != null) a = b;
  if (b == null && a != null) b = a;
  if (a != null && b != null && b > a) b = a;
  return { a, b };
}

function priceAfter(cat, retailer, brand, k) {
  const p = storeLinePricesAfter(cat, retailer, k);
  if (brand === "laagste") {
    if (p.a == null) return p.b;
    if (p.b == null) return p.a;
    return Math.min(p.a, p.b);
  }
  if (brand === "B") return p.b;
  if (brand === "A") return p.a;
  return p.a;
}

function effectiveBrand(item, Sbrand) {
  if (Sbrand === "A" || Sbrand === "B") return Sbrand;
  if (Sbrand === "CHEAP") return "laagste";
  return item.aisle === "Vers" || item.aisle === "Koeling" ? "A" : "B";
}

function score(mode, unitFn) {
  return STORES.map((sid) => {
    let total = 0;
    LIST.forEach((i) => {
      const brand = effectiveBrand(i, mode);
      const pr = unitFn(i.cat, sid, brand, i.k);
      if (pr != null) total += pr;
    });
    return { sid, total };
  }).sort((a, b) => a.total - b.total);
}

function euro(c) {
  return "€" + (c / 100).toFixed(2);
}

function report(label, unitFn) {
  console.log("\n=== " + label + " ===");
  const modes = ["A", "MIX", "B", "CHEAP"];
  const byMode = {};
  for (const m of modes) {
    byMode[m] = score(m, unitFn);
    console.log(
      m.padEnd(5),
      byMode[m].map((x) => x.sid + ":" + euro(x.total)).join(" | "),
      "→ cheapest " + byMode[m][0].sid
    );
  }
  let broken = 0;
  console.log("Invariant B ≤ MIX ≤ A per store:");
  for (const sid of STORES) {
    const tA = byMode.A.find((x) => x.sid === sid).total;
    const tM = byMode.MIX.find((x) => x.sid === sid).total;
    const tB = byMode.B.find((x) => x.sid === sid).total;
    const ok = tB <= tM && tM <= tA;
    if (!ok) broken++;
    console.log(" ", sid, "B", euro(tB), "MIX", euro(tM), "A", euro(tA), ok ? "OK" : "BROKEN");
  }
  /* CHEAP ≤ B when B≤A (after clamp CHEAP should equal B) */
  let cheapBad = 0;
  for (const sid of STORES) {
    const tB = byMode.B.find((x) => x.sid === sid).total;
    const tC = byMode.CHEAP.find((x) => x.sid === sid).total;
    if (tC > tB) cheapBad++;
  }
  const dirkAlways =
    byMode.A[0].sid === "dirk" && byMode.MIX[0].sid === "dirk" && byMode.B[0].sid === "dirk";
  const totalsDiffer =
    byMode.A.find((x) => x.sid === "dirk").total !== byMode.B.find((x) => x.sid === "dirk").total ||
    byMode.A.find((x) => x.sid === "ah").total !== byMode.B.find((x) => x.sid === "ah").total;
  return { broken, cheapBad, dirkAlways, totalsDiffer, byMode };
}

const before = report("BEFORE (loose bonus / weak tier)", unitPriceBefore);
const after = report("AFTER (strict match + house brand + B≤A)", (cat, r, brand, k) =>
  priceAfter(cat, r, brand, k)
);

console.log("\n=== Line samples Dirk AFTER ===");
LIST.forEach((i) => {
  const p = storeLinePricesAfter(i.cat, "dirk", i.k);
  const raw = bonusOf(i.k, "dirk");
  let keep = "";
  if (raw) {
    const row = { n: raw.name || "", b: raw.brand || "" };
    keep = dealMatchesEntry(row, { n: i.n, k: i.k, aisle: i.aisle }) ? "KEEP " + raw.name : "DROP " + raw.name;
  }
  console.log(i.k, "A", p.a, "B", p.b, keep);
});

let failed = 0;
if (after.broken) {
  console.error("FAIL: invariant broken on", after.broken, "stores");
  failed++;
}
if (after.cheapBad) {
  console.error("FAIL: CHEAP > B on", after.cheapBad, "stores");
  failed++;
}
if (after.dirkAlways) {
  console.error("FAIL: Dirk artificially cheapest in A+MIX+B");
  failed++;
}
/* A-mode should not keep Dirk as winner solely via mis-tiered huismerk acties */
if (after.byMode.A[0].sid === "dirk" && after.byMode.B[0].sid === "dirk" && before.byMode.A[0].sid === "dirk") {
  const aBefore = before.byMode.A.find((x) => x.sid === "dirk").total;
  const aAfter = after.byMode.A.find((x) => x.sid === "dirk").total;
  if (aAfter <= aBefore) {
    console.error("FAIL: expected Dirk A-total to rise after dropping mis-tiered/false bonuses", aBefore, "→", aAfter);
    failed++;
  }
}
const gap = after.byMode.A.find((x) => x.sid === "dirk").total - after.byMode.B.find((x) => x.sid === "dirk").total;
if (gap < 200) {
  console.error("FAIL: expected visible A vs B gap at Dirk (>=€2), got", gap, "cents");
  failed++;
}
if (!after.totalsDiffer) {
  console.error("FAIL: A and B totals identical — brandbar would not change euros");
  failed++;
}
/* Expect improvement: before had more identical A/B on lines with false bonuses */
console.log("\nBefore Dirk-always-all-modes:", before.dirkAlways, "| After:", after.dirkAlways);
console.log("Before invariant breaks:", before.broken, "| After:", after.broken);

if (failed) {
  console.error("\n" + failed + " check(s) failed");
  process.exit(1);
}
console.log("\nAll checks passed.");
