#!/usr/bin/env python3
"""Haal folder/acties op bij PrijsProfeet: bonus.json + folder-{store}.json + folder-index.json.

Alle retailers die PrijsProfeet kent (incl. Picnic). Geen vaste allowlist van 5.
"""
import json, re, time, urllib.parse, urllib.request
from datetime import date, timedelta

UA = "WeAte/1.0 (https://affibarto.github.io/; family list)"

# PP retailer id -> (our short id, display name). albert_heijn stays "ah" for compat.
KNOWN = {
    "albert_heijn": ("ah", "Albert Heijn"),
    "aldi": ("aldi", "Aldi"),
    "dekamarkt": ("dekamarkt", "Dekamarkt"),
    "dirk": ("dirk", "Dirk"),
    "ekoplaza": ("ekoplaza", "Ekoplaza"),
    "hoogvliet": ("hoogvliet", "Hoogvliet"),
    "jumbo": ("jumbo", "Jumbo"),
    "lidl": ("lidl", "Lidl"),
    "picnic": ("picnic", "Picnic"),
    "plus": ("plus", "Plus"),
    "vomar": ("vomar", "Vomar"),
}
# Preferred chip / STORES order
ORDER = [
    "dirk", "ah", "lidl", "jumbo", "plus",
    "aldi", "dekamarkt", "ekoplaza", "hoogvliet", "vomar", "picnic",
]
PER_STORE_CAP = 100
META_KEYS = {"week", "source", "fetched", "note"}

BAN_BONUS = (
    "baby", "6m", "8m", "knijpfruit", "deodorant", "roller", "pringles", "puzzle",
    "biscuit", "chewing", "heat & eat", "muscle meat", "cup-a-soup", "airfryer",
    "soep in zak", "ovenschotel", "honden", "katten", "purina", "rosewood",
    "chips", "cheetos", "lay's", "lays ", "hipro", "reep ", "disney",
    "verspakket", "maaltijd", "cordon bleu", "fish cuisine", "bloemkool rijst",
    "chocolonely", "mullermilk", "müllermilk", "sojadrink", "tortellini",
    "mezzelune", "pizza", "nougatine", "koek", "cookie", "toetje",
)
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


def map_retailer(pp_id):
    """Return (short_id, display_name) for any PP retailer id."""
    if not pp_id:
        return None
    pp_id = str(pp_id).strip().lower()
    if pp_id in KNOWN:
        return KNOWN[pp_id]
    # Unknown future chain: keep slug, title-case for display
    sid = re.sub(r"[^a-z0-9_]+", "_", pp_id).strip("_") or pp_id
    name = sid.replace("_", " ").title()
    return sid, name


def get_json(url, retries=5):
    last = None
    for attempt in range(retries):
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                return json.load(r)
        except Exception as e:
            last = e
            msg = str(e)
            if "429" in msg or "503" in msg or "timed out" in msg.lower():
                wait = 4 * (attempt + 1)
                print(f"  backoff {wait}s after {e}")
                time.sleep(wait)
                continue
            raise
    raise last


def search(q, page_size=50, page=1, retailer=None):
    qs = f"q={urllib.parse.quote(q)}&page_size={page_size}&page={page}"
    if retailer:
        qs += "&retailer=" + urllib.parse.quote(retailer)
    return get_json("https://www.prijsprofeet.nl/api/v1/search?" + qs)


def promo_all(retailer=None, page_size=100, page=1):
    qs = f"page_size={page_size}&page={page}"
    if retailer:
        qs += "&retailer=" + urllib.parse.quote(retailer)
    return get_json("https://www.prijsprofeet.nl/api/v1/products/promotional/all?" + qs)


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


def discover_pp_retailers():
    """Union of known chains + any ids seen on promotional/all."""
    found = set(KNOWN.keys())
    # Probe known + a few pages of unfiltered promos for unknowns
    try:
        for page in (1, 2, 3, 5, 10):
            data = promo_all(page_size=100, page=page)
            for x in data.get("products") or []:
                rid = (x.get("retailer") or "").strip().lower()
                if rid:
                    found.add(rid)
            time.sleep(0.15)
    except Exception as e:
        print(f"discover walk fail: {e}")
    # Also confirm each known via total (incl. empty picnic)
    confirmed = []
    for pp in sorted(found):
        try:
            data = promo_all(retailer=pp, page_size=1, page=1)
            total = int(data.get("total") or 0)
            confirmed.append((pp, total))
            print(f"retailer {pp} total={total}")
        except Exception as e:
            print(f"retailer {pp} probe fail: {e}")
            confirmed.append((pp, -1))
        time.sleep(0.12)
    return confirmed


def build_bonus(today, monday, sunday, short_ids):
    out = {sid: {} for sid in short_ids}
    for key, (q, need) in PRODUCTS.items():
        try:
            data = search(q, page_size=50)
        except Exception:
            time.sleep(0.4)
            continue
        best = {}
        for x in data.get("results") or []:
            mapped = map_retailer(x.get("retailer"))
            if not mapped:
                continue
            rid = mapped[0]
            if not x.get("is_promotional"):
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
            if rid not in out:
                out[rid] = {}
            out[rid][key] = rec
        time.sleep(0.2)
    week = f"{monday.day}–{sunday.day} {sunday.strftime('%b').lower()} {sunday.year}"
    blob = {
        "week": week,
        "source": "PrijsProfeet",
        "fetched": today.isoformat(),
        "note": "Folder/actie, automatisch. Geen kassaprijs.",
    }
    for sid in sorted(out.keys()):
        blob[sid] = out[sid]
    with open("bonus.json", "w", encoding="utf-8") as f:
        json.dump(blob, f, ensure_ascii=False, indent=2)
        f.write("\n")
    n = sum(len(v) for v in out.values())
    print(f"wrote bonus.json hits={n} stores={len(out)} date={today.isoformat()}")
    return out


def rank_item(it):
    has_img = 1 if it.get("img") else 0
    deal = (it.get("deal") or "").lower()
    weak = 1 if deal in {"actie", "bonus", "folder", "feed", "korting"} else 0
    return (-has_img, weak, -(it.get("was", 0) - it.get("now", 0)))


def fetch_folder_for(pp_id, sid):
    buckets = []
    seen = set()
    page = 1
    while len(buckets) < PER_STORE_CAP and page <= 8:
        try:
            data = promo_all(retailer=pp_id, page_size=100, page=page)
        except Exception as e:
            print(f"folder {pp_id} page {page} fail: {e}")
            break
        products = data.get("products") or []
        if not products:
            break
        for x in products:
            if banned(x.get("name"), BAN_FOLDER):
                continue
            price = x.get("price") or 0
            if price <= 0:
                continue
            # skip obvious non-food feed junk with absurd discounts under €0.10
            if price < 0.10 and (x.get("promotion_type") or "") == "feed":
                continue
            key = dedupe_key(x, sid)
            if key in seen:
                continue
            seen.add(key)
            buckets.append(item_from(x, sid))
            if len(buckets) >= PER_STORE_CAP * 2:
                break
        total = int(data.get("total") or 0)
        if page * 100 >= total:
            break
        page += 1
        time.sleep(0.2)
    buckets.sort(key=rank_item)
    return buckets[:PER_STORE_CAP]


def build_folders(today, monday, sunday, pp_list):
    """pp_list: list of (pp_id, total_hint)."""
    week = f"{monday.day}–{sunday.day} {sunday.strftime('%b').lower()} {sunday.year}"
    name_by_sid = {}
    counts = {}
    store_meta = []

    # Ensure every known chain appears even if total=0 (e.g. picnic)
    pp_ids = []
    seen_pp = set()
    for pp, _tot in pp_list:
        if pp not in seen_pp:
            pp_ids.append(pp)
            seen_pp.add(pp)
    for pp in KNOWN:
        if pp not in seen_pp:
            pp_ids.append(pp)
            seen_pp.add(pp)

    for pp_id in pp_ids:
        mapped = map_retailer(pp_id)
        if not mapped:
            continue
        sid, name = mapped
        name_by_sid[sid] = name
        items = fetch_folder_for(pp_id, sid)
        blob = {
            "week": week,
            "source": "PrijsProfeet",
            "fetched": today.isoformat(),
            "store": sid,
            "pp": pp_id,
            "note": "Indicatie, geen kassaprijs",
            "items": items,
        }
        path = f"folder-{sid}.json"
        with open(path, "w", encoding="utf-8") as f:
            json.dump(blob, f, ensure_ascii=False, separators=(",", ":"))
            f.write("\n")
        counts[sid] = len(items)
        store_meta.append({"id": sid, "n": name, "pp": pp_id, "file": path, "count": len(items)})
        print(f"wrote {path} items={len(items)}")
        time.sleep(1.2)

    # Stable order for index
    order_idx = {s: i for i, s in enumerate(ORDER)}
    store_meta.sort(key=lambda s: (order_idx.get(s["id"], 100), s["n"].lower()))

    index = {
        "week": week,
        "source": "PrijsProfeet",
        "fetched": today.isoformat(),
        "stores": store_meta,
    }
    with open("folder-index.json", "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"wrote folder-index.json stores={len(store_meta)}")
    return counts, name_by_sid


def main():
    today = date.today()
    monday = today - timedelta(days=today.weekday())
    sunday = monday + timedelta(days=6)
    pp_list = discover_pp_retailers()
    short_ids = []
    for pp, _t in pp_list:
        m = map_retailer(pp)
        if m and m[0] not in short_ids:
            short_ids.append(m[0])
    for sid, _n in KNOWN.values():
        if sid not in short_ids:
            short_ids.append(sid)
    build_bonus(today, monday, sunday, short_ids)
    counts, _names = build_folders(today, monday, sunday, pp_list)
    print("folder totals:", counts)


if __name__ == "__main__":
    main()
