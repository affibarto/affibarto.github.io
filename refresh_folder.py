#!/usr/bin/env python3
"""Haal folder/acties op bij PrijsProfeet: bonus.json + folder-{store}.json."""
import json, time, urllib.parse, urllib.request
from datetime import date, timedelta

UA = "WeAte/1.0 (https://affibarto.github.io/; family list)"
WANT = {
    "albert_heijn": "ah",
    "jumbo": "jumbo",
    "lidl": "lidl",
    "plus": "plus",
    "dirk": "dirk",
}
STORES = list(WANT.values())
PER_STORE_CAP = 100

# Stricter for bonus.json board matching
BAN_BONUS = (
    "baby", "6m", "8m", "knijpfruit", "deodorant", "roller", "pringles", "puzzle",
    "biscuit", "chewing", "heat & eat", "muscle meat", "cup-a-soup", "airfryer",
    "soep in zak", "ovenschotel", "honden", "katten", "purina", "rosewood",
    "chips", "cheetos", "lay's", "lays ", "hipro", "reep ", "disney",
    "verspakket", "maaltijd", "cordon bleu", "fish cuisine", "bloemkool rijst",
    "chocolonely", "mullermilk", "müllermilk", "sojadrink", "tortellini",
    "mezzelune", "pizza", "nougatine", "koek", "cookie", "toetje",
)

# Light ban for Actie folder — prefer volume, only clear non-food
BAN_FOLDER = (
    "deodorant", "shampoo", "conditioner", "tandenborstel", "tandpasta",
    "wasmiddel", "afwasmiddel", "toilet", "hondenvoer", "kattenvoer",
    "honden ", "katten ", "purina", "kitten", "puppy", "kattenbak",
    "luiers", "maandverband", "tampon", "scheerschuim", "scheermes",
    "batterijen", "lamp ", "gloeilamp", "wc-papier", "keukenpapier",
    "haar masker", "haarmasker", "haarkleur", "haarverf", "garnier",
    "nivea", "dove ", "axe ", "gillette", "wasverzachter", "allesreiniger",
    "biodermal", "after sun", "aftersun", "zonnebrand", "bodylotion", "body lotion",
    "douchegel", "handzeep", "handcreme", "mascara", "make-up",
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

# Broad food searches for Actie folder volume
FOLDER_QUERIES = [
    "vlees", "kip", "gehakt", "worst", "vis", "zalm", "varkensvlees", "rundvlees",
    "zuivel", "melk", "kaas", "yoghurt", "boter", "eieren", "kwark", "room",
    "groente", "fruit", "aardappel", "salade", "tomaat", "komkommer", "paprika",
    "pasta", "rijst", "brood", "bakkerij", "noodles", "couscous",
    "diepvries", "pizza", "soep", "ijskoffie",
    "frisdrank", "sap", "koffie", "thee", "water", "bier", "wijn",
    "chips", "koek", "chocolade", "snoep", "noten", "pindakaas",
    "olijfolie", "saus", "kruiden", "mayo", "ketchup", "honing",
]

PROMO_TYPE_NL = {
    "one_plus_one": "1+1",
    "two_plus_one": "2+1",
    "three_plus_one": "3+1",
    "second_half_price": "2e half",
    "second_half": "2e half",
    "multi_buy": "multipack",
    "percentage": "korting",
    "percentage_discount": "korting",
    "fixed_price": "actieprijs",
    "promotional": "actie",
}


def get(q, page_size=50, page=1):
    url = (
        "https://www.prijsprofeet.nl/api/v1/search?q="
        + urllib.parse.quote(q)
        + f"&page_size={page_size}&page={page}"
    )
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.load(r)


def banned(name, ban):
    n = (name or "").lower()
    return any(b in n for b in ban)


def ok_bonus(name, need):
    n = (name or "").lower()
    if banned(n, BAN_BONUS):
        return False
    return any(t in n for t in need)


def useless_deal(s):
    return (s or "").strip().lower() in {
        "", "feed", "folder", "actie", "bonus", "promotie", "promotional",
    }


def weak_kw(kw):
    k = (kw or "").strip().lower()
    if useless_deal(k):
        return True
    if "gratis bezorg" in k or "bezorging" in k:
        return True
    return False


def human_deal(x):
    kws = x.get("promotional_keywords") or []
    for kw in kws:
        kw = (kw or "").strip()
        if kw and not weak_kw(kw):
            return kw
    ptype = (x.get("promotion_type") or "").strip().lower()
    if ptype in PROMO_TYPE_NL:
        label = PROMO_TYPE_NL[ptype]
        if label != "korting":
            return label
        pct = x.get("savings_percentage")
        if pct:
            return f"{int(round(pct))}% korting"
        return label
    if ptype and not useless_deal(ptype):
        return ptype.replace("_", " ")
    # last resort from prices
    price = x.get("price") or 0
    orig = x.get("original_price") or 0
    if orig > price > 0:
        pct = int(round(100 * (orig - price) / orig))
        if pct >= 5:
            return f"{pct}% korting"
    if kws:
        return (kws[0] or "").strip() or "actie"
    return "actie"


def fmt_until(raw):
    if not raw:
        return ""
    s = str(raw)[:10]
    try:
        y, m, d = s.split("-")
        months = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"]
        return f"{int(d)} {months[int(m) - 1]}"
    except Exception:
        return s


def make_desc(brand, qty, deal, until, category):
    parts = []
    if brand:
        parts.append(brand)
    if qty:
        parts.append(qty)
    if deal and not useless_deal(deal):
        parts.append(deal)
    u = fmt_until(until)
    if u:
        parts.append(f"geldig t/m {u}")
    elif category:
        parts.append(str(category).replace("-", " "))
    return " · ".join(parts)


def dedupe_key(x, rid):
    pid = x.get("product_id") or x.get("base_product_id")
    if pid:
        return f"id:{pid}"
    ean = x.get("ean")
    if ean:
        return f"ean:{ean}:{rid}"
    return f"n:{(x.get('name') or '').strip().lower()}:{rid}"


def item_from(x, rid):
    price = x.get("price") or 0
    orig = x.get("original_price") or price
    deal = human_deal(x)
    brand = (x.get("brand") or "").strip()
    qty = (x.get("quantity") or "").strip()
    until = x.get("valid_until") or ""
    cat = x.get("unified_category") or ""
    return {
        "s": rid,
        "n": x.get("name") or "",
        "b": brand,
        "deal": deal,
        "was": int(round(orig * 100)) if orig else 0,
        "now": int(round(price * 100)) if price else 0,
        "qty": qty,
        "img": x.get("image_url") or "",
        "c": cat,
        "until": until,
        "desc": make_desc(brand, qty, deal, until, cat),
    }


def build_bonus(today, monday, sunday):
    out = {k: {} for k in STORES}
    for key, (q, need) in PRODUCTS.items():
        try:
            data = get(q, page_size=20)
        except Exception:
            time.sleep(0.4)
            continue
        best = {}
        for x in data.get("results") or []:
            rid = WANT.get(x.get("retailer"))
            if not rid or not x.get("is_promotional"):
                continue
            if not ok_bonus(x.get("name"), need):
                continue
            price = x.get("price") or 0
            if price <= 0 or price > 10:
                continue
            deal = human_deal(x)
            if useless_deal(deal):
                deal = "folder"
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
    return out


def build_folders(today, monday, sunday):
    buckets = {s: [] for s in STORES}
    seen = {s: set() for s in STORES}
    def ingest(results):
        for x in results or []:
            rid = WANT.get(x.get("retailer"))
            if not rid or not x.get("is_promotional"):
                continue
            if banned(x.get("name"), BAN_FOLDER):
                continue
            price = x.get("price") or 0
            if price <= 0:
                continue
            key = dedupe_key(x, rid)
            if key in seen[rid]:
                continue
            if len(buckets[rid]) >= PER_STORE_CAP:
                continue
            seen[rid].add(key)
            buckets[rid].append(item_from(x, rid))

    for q in FOLDER_QUERIES:
        for page in (1, 2):
            # Skip page 2 once every store is near the cap
            if page > 1 and all(len(buckets[s]) >= 60 for s in STORES):
                break
            try:
                data = get(q, page_size=50, page=page)
            except Exception as e:
                print(f"folder query fail q={q} page={page}: {e}")
                time.sleep(0.4)
                continue
            ingest(data.get("results"))
            time.sleep(0.22)
            total = data.get("total") or 0
            if total <= 50:
                break
        if all(len(buckets[s]) >= 70 for s in STORES):
            break

    week = f"{monday.day}–{sunday.day} {sunday.strftime('%b').lower()} {sunday.year}"
    counts = {}
    for store, items in buckets.items():
        # Prefer items with images, then with clearer deals
        def rank(it):
            has_img = 1 if it.get("img") else 0
            deal = (it.get("deal") or "").lower()
            weak = 1 if deal in {"actie", "bonus", "folder", "feed", "korting"} else 0
            return (-has_img, weak, -(it.get("was", 0) - it.get("now", 0)))

        items.sort(key=rank)
        items = items[:PER_STORE_CAP]
        blob = {
            "week": week,
            "source": "PrijsProfeet",
            "fetched": today.isoformat(),
            "store": store,
            "note": "Indicatie, geen kassaprijs",
            "items": items,
        }
        path = f"folder-{store}.json"
        with open(path, "w", encoding="utf-8") as f:
            json.dump(blob, f, ensure_ascii=False, separators=(",", ":"))
            f.write("\n")
        counts[store] = len(items)
        print(f"wrote {path} items={len(items)}")
    return counts


def main():
    today = date.today()
    monday = today - timedelta(days=today.weekday())
    sunday = monday + timedelta(days=6)
    build_bonus(today, monday, sunday)
    counts = build_folders(today, monday, sunday)
    print("folder totals:", counts)


if __name__ == "__main__":
    main()
