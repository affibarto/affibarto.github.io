#!/usr/bin/env python3
"""Haal folder/acties op bij PrijsProfeet en schrijf bonus.json."""
import json, time, urllib.parse, urllib.request
from datetime import date, timedelta

UA = "WeAte/1.0 (https://affibarto.github.io/; family list)"
WANT = {"albert_heijn": "ah", "jumbo": "jumbo", "lidl": "lidl", "plus": "plus", "dirk": "dirk"}
BAN = (
    "baby", "6m", "8m", "knijpfruit", "deodorant", "roller", "pringles", "puzzle",
    "biscuit", "chewing", "heat & eat", "muscle meat", "cup-a-soup", "airfryer",
    "soep in zak", "ovenschotel", "honden", "katten", "purina", "rosewood",
    "chips", "cheetos", "lay's", "lays ", "hipro", "reep ", "disney",
    "verspakket", "maaltijd", "cordon bleu", "fish cuisine", "bloemkool rijst",
    "chocolonely", "mullermilk", "müllermilk", "sojadrink", "tortellini",
    "mezzelune", "pizza", "nougatine", "koek", "cookie", "toetje",
)
PRODUCTS = {
    "gehakt": ("rundergehakt", ["rundergehakt", "gehakt"]),
    "pasta": ("spaghetti", ["spaghetti", "penne", "fusilli"]),
    "tomaat": ("tomatenblokjes", ["tomatenblokjes", "tomatenstukjes"]),
    "melk": ("halfvolle melk", ["halfvolle melk"]),
    "kip": ("kipfilet", ["kipfilet"]),
    "aardappel": ("aardappelen kruimig", ["aardappelen"]),
    "wortel": ("wortelen", ["wortelen"]),
    "ui": ("uien", ["uien"]),
    "kaas": ("geraspte kaas", ["geraspte kaas"]),
    "boter": ("roomboter", ["roomboter"]),
    "yoghurt": ("yoghurt naturel", ["yoghurt"]),
    "pesto": ("groene pesto", ["pesto"]),
    "rijst": ("rijst", ["rijst"]),
    "wraps": ("wraps", ["wraps"]),
    "spinazie": ("spinazie", ["spinazie"]),
    "brood": ("vloerbrood", ["brood"]),
    "sla": ("ijsbergsla", ["ijsbergsla", "kropsla"]),
    "paprika": ("paprika", ["paprika"]),
    "ei": ("scharreleieren", ["eieren"]),
    "ham": ("achterham", ["achterham"]),
    "mozzarella": ("mozzarella", ["mozzarella"]),
    "rookworst": ("rookworst", ["rookworst"]),
    "beleg": ("pindakaas", ["pindakaas"]),
    "hagelslag": ("hagelslag", ["hagelslag"]),
    "fruit": ("bananen", ["bananen"]),
    "zalm": ("zalm", ["zalm"]),
    "komkommer": ("komkommer", ["komkommer"]),
    "champignon": ("champignons", ["champignons"]),
    "linzen": ("rode linzen", ["linzen"]),
    "lasagne": ("lasagnebladen", ["lasagneblad", "lasagnebladen"]),
}

def get(q):
    url = "https://www.prijsprofeet.nl/api/v1/search?q=" + urllib.parse.quote(q) + "&page_size=20"
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.load(r)

def ok(name, need):
    n = (name or "").lower()
    if any(b in n for b in BAN):
        return False
    return any(t in n for t in need)

def main():
    today = date.today()
    monday = today - timedelta(days=today.weekday())
    sunday = monday + timedelta(days=6)
    out = {k: {} for k in WANT.values()}
    for key, (q, need) in PRODUCTS.items():
        try:
            data = get(q)
        except Exception:
            time.sleep(0.4)
            continue
        best = {}
        for x in data.get("results") or []:
            rid = WANT.get(x.get("retailer"))
            if not rid or not x.get("is_promotional"):
                continue
            if not ok(x.get("name"), need):
                continue
            price = x.get("price") or 0
            if price <= 0 or price > 10:
                continue
            deal = ((x.get("promotional_keywords") or [None])[0] or "folder")
            rec = {
                "was": int(round((x.get("original_price") or price) * 100)),
                "now": int(round(price * 100)),
                "deal": deal,
                "name": x.get("name"),
                "until": x.get("valid_until") or "",
            }
            sav = rec["was"] - rec["now"]
            prev = best.get(rid)
            if prev is None or sav > (prev["was"] - prev["now"]):
                best[rid] = rec
        for rid, rec in best.items():
            out[rid][key] = rec
        time.sleep(0.2)
    blob = {
        "week": f"{monday.day}–{sunday.day} {sunday.strftime('%b').lower()} {sunday.year}",
        "source": "PrijsProfeet",
        "fetched": today.isoformat(),
        "note": "Folder/actie, automatisch. Geen kassaprijs.",
        "ah": out["ah"],
        "jumbo": out["jumbo"],
        "lidl": out["lidl"],
        "plus": out["plus"],
        "dirk": out["dirk"],
    }
    with open("bonus.json", "w", encoding="utf-8") as f:
        json.dump(blob, f, ensure_ascii=False, indent=2)
        f.write("\n")
    n = sum(len(v) for v in out.values())
    print(f"wrote bonus.json hits={n} date={today.isoformat()}")

if __name__ == "__main__":
    main()
