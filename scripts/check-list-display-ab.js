#!/usr/bin/env node
/**
 * WeAte — list row display follows A/B (v84).
 * Asserts: Huismerk never shows HEINZ/Knorr/Milka on bolognese staples;
 * B chip ≤ A chip; bad Actie enrichment rejected.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const root = path.join(__dirname, "..");
const bonus = JSON.parse(fs.readFileSync(path.join(root, "bonus.json"), "utf8"));

function P(name, aisle, cents, extra) {
  return Object.assign(
    { name, aisle, ah: cents, jumbo: cents - 10, lidl: Math.max(40, cents - 25), picnic: cents + 8, missing: [], aExtra: 35 },
    extra || {}
  );
}
const CAT = {
  gehakt: P("rundergehakt 500g", "Koeling", 399, { aExtra: 60, label: "Rundergehakt" }),
  ui: P("uien 1kg", "Vers", 129, { label: "Uien" }),
  tomaat: P("tomatenblokjes 400g", "Houdbaar", 89, { label: "Tomatenblokjes" }),
  pasta: P("pasta 500g", "Houdbaar", 119, { label: "Pasta" }),
};

const STORES = [
  { id: "ah", n: "AH" }, { id: "jumbo", n: "Jumbo" }, { id: "lidl", n: "Lidl" },
  { id: "dirk", n: "Dirk" }, { id: "aldi", n: "Aldi" }, { id: "plus", n: "Plus" },
  { id: "dekamarkt", n: "Dekamarkt" }, { id: "hoogvliet", n: "Hoogvliet" }, { id: "vomar", n: "Vomar" }
];

const folderItems = [];
for (const f of fs.readdirSync(root).filter((x) => x.startsWith("folder-") && x.endsWith(".json"))) {
  const d = JSON.parse(fs.readFileSync(path.join(root, f), "utf8"));
  (d.items || []).forEach((it) => folderItems.push(it));
}

const sandbox = {
  window: {},
  S: { brand: "B", itemBrand: {}, stores: {} },
  CAT,
  STORES,
  BONUS: bonus,
  BONUS_WEEK: "",
  productLabel: function (cat) {
    if (!cat) return "";
    if (cat.label) return cat.label;
    return String(cat.name || "").replace(/\s+\d+.*$/, "");
  },
  activeStores: function () { return STORES; },
  bonusOf: function (k, r) { return (bonus[r] && bonus[r][k]) || null; },
  unitPrice: function (cat, retailer, brand, k) {
    let base = cat[retailer];
    if (base == null) {
      if (retailer === "plus" || retailer === "picnic") base = cat.jumbo;
      else if (["dirk", "aldi", "dekamarkt", "hoogvliet", "vomar", "ekoplaza"].includes(retailer)) base = cat.lidl;
      else return null;
    }
    if (brand === "A") base += cat.aExtra || 0;
    if (brand === "B") base = Math.round(base * 0.86);
    return base;
  },
  document: { getElementById: () => null, addEventListener: () => {}, querySelectorAll: () => [] },
  console,
  FOLDER_FULL: { items: folderItems },
  WeAteProducts: {
    get: function (id) {
      const map = {
        gehakt: { id: "gehakt", name: "Rundergehakt", pack: "500g", brandTier: "A", aliases: ["gehakt", "rundergehakt"] },
        ui: { id: "ui", name: "Uien", pack: "1 kg", brandTier: "B", aliases: ["ui", "uien"] },
        tomaat: { id: "tomaat", name: "Tomatenblokjes", pack: "400g", brandTier: "B", aliases: ["tomaat", "tomatenblokjes", "tomaten"] },
        pasta: { id: "pasta", name: "Pasta", pack: "500g", brandTier: "B", aliases: ["pasta", "spaghetti", "macaroni", "penne"] }
      };
      return map[id] || null;
    },
    findByName: function () { return null; },
    aliasesFor: function (id) {
      const p = this.get(id);
      return p ? [p.id, p.name].concat(p.aliases || []) : [];
    },
    preferMeta: function (id) {
      const p = this.get(id);
      return p ? { brand: p.brand || "", pack: p.pack || "", brandTier: p.brandTier || "" } : { brand: "", pack: "", brandTier: "" };
    }
  }
};
sandbox.window = sandbox;
vm.createContext(sandbox);

const folderSrc = fs.readFileSync(path.join(root, "folder.js"), "utf8")
  .replace(/fetch\(/g, "((u)=>Promise.reject(u))||fetch(");
vm.runInContext(folderSrc, sandbox);

const brandsSrc = fs.readFileSync(path.join(root, "brands.js"), "utf8");
vm.runInContext(brandsSrc, sandbox);

function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exitCode = 1;
  } else {
    console.log("ok:", msg);
  }
}

const BAD = /heinz|knorr|milka|terra|frito|chocolade|biscuit|hutspot|peen en ui/i;

// --- Huismerk (B) on bolognese lines ---
sandbox.S.brand = "B";
sandbox.S.itemBrand = {};
for (const k of ["gehakt", "ui", "tomaat", "pasta"]) {
  const info = sandbox.lineDisplayInfo(k, CAT[k]);
  const blob = [info.title, info.brand, info.deal, info.store].join(" ");
  console.log("B-display", k, JSON.stringify(info));
  assert(info.tier === "B" || info.brand === "huismerk" || (info.brand && sandbox.detectBrandTier({ b: info.brand, n: info.title }) === "B") || !info.brand,
    "B-mode " + k + " tier-ish: " + JSON.stringify(info));
  assert(!BAD.test(blob), "B-mode " + k + " must not show A-junk: " + blob);
  assert(info.brandWant === "B", "B-mode brandWant for " + k);
}
{
  const ui = sandbox.lineDisplayInfo("ui", CAT.ui);
  assert(/ui/i.test(ui.title) && !/hutspot|peen/i.test(ui.title), "B ui title is onions: " + ui.title);
  const tom = sandbox.lineDisplayInfo("tomaat", CAT.tomaat);
  assert(!/heinz/i.test(tom.brand + tom.title), "B tomaat no HEINZ");
  const pasta = sandbox.lineDisplayInfo("pasta", CAT.pasta);
  assert(!/knorr/i.test(pasta.brand + pasta.title), "B pasta no Knorr");
}

// Explicit per-line B for tomaat must not show HEINZ
sandbox.S.brand = "A";
sandbox.S.itemBrand = { tomaat: "B" };
{
  const info = sandbox.lineDisplayInfo("tomaat", CAT.tomaat);
  assert(!/heinz/i.test(info.brand + info.title), "per-line B tomaat no HEINZ: " + JSON.stringify(info));
  assert(info.brandWant === "B", "per-line B want");
}

// A-mode may show A-merk when a strict match exists (not required)
sandbox.S.brand = "A";
sandbox.S.itemBrand = {};
{
  const info = sandbox.lineDisplayInfo("tomaat", CAT.tomaat);
  assert(info.brandWant === "A", "A-mode tomaat");
  // If enriched, must be A-tier
  if (info.brand && info.brand !== "A-merk") {
    const t = sandbox.detectBrandTier({ b: info.brand, n: info.title });
    assert(t === "A" || t === "", "A-mode tomaat brand tier " + t + " " + info.brand);
  }
}

// B ≤ A on chips for pasta (cross-store clamp)
sandbox.S.brand = "B";
{
  const pair = sandbox.abPricePair(CAT.pasta, "pasta");
  assert(pair.a != null && pair.b != null, "pasta has A and B cents");
  assert(pair.b <= pair.a, "pasta B≤A got A=" + pair.a + " B=" + pair.b);
}

// dealMatchesEntry rejects known junk
assert(!sandbox.dealMatchesEntry(
  { n: "Milka Chocolade biscuit tablet lu", b: "Milka" },
  { k: "ui", n: "Uien", aisle: "Vers" }
), "reject Milka→uien");
assert(!sandbox.dealMatchesEntry(
  { n: "Heinz Tomato Frito Creations met gekarameliseerde uien & sjalotten", b: "Heinz" },
  { k: "ui", n: "Uien", aisle: "Vers" }
), "reject Heinz Frito→uien");
assert(!sandbox.dealMatchesEntry(
  { n: "AH Terra Plantaardig rulgehakt", b: "AH Terra" },
  { k: "gehakt", n: "rundergehakt 500g", aisle: "Koeling" }
), "reject Terra rulgehakt");
assert(!sandbox.dealMatchesEntry(
  { n: "Knorr Mix voor spaghetti", b: "Knorr" },
  { k: "pasta", n: "pasta 500g", aisle: "Houdbaar" }
), "reject Knorr mix→pasta");

// Totals still B ≤ mix ≤ A (reuse storeLinePrices)
let sumA = 0, sumB = 0, sumMix = 0;
for (const k of Object.keys(CAT)) {
  const cat = CAT[k];
  let bestA = null, bestB = null, bestMix = null;
  for (const s of STORES) {
    const p = sandbox.storeLinePrices(cat, s.id, k);
    if (p.a != null) bestA = bestA == null ? p.a : Math.min(bestA, p.a);
    if (p.b != null) bestB = bestB == null ? p.b : Math.min(bestB, p.b);
    const mix = ["Vers", "Koeling"].includes(cat.aisle) ? p.a : p.b;
    if (mix != null) bestMix = bestMix == null ? mix : Math.min(bestMix, mix);
  }
  assert(bestB <= bestA, "line " + k + " bestB≤bestA");
  sumA += bestA; sumB += bestB; sumMix += bestMix;
}
assert(sumB <= sumMix && sumMix <= sumA, "totals B≤mix≤A " + [sumB, sumMix, sumA].join("/"));

if (process.exitCode) {
  console.error("\ncheck-list-display-ab FAILED");
  process.exit(1);
}
console.log("\ncheck-list-display-ab passed");
