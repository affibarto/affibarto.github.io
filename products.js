/* WeAte eigen productcatalogus — géén volledige AH/Jumbo-assortiment-scrape.
   Seed: recept-ingrediënten (CAT) + veelgebruikte huis/lijst-items.
   Aliases voeden Actie-matching (strict whole-word, zie folder.js).
   Free-text toevoegen upsert naar localStorage (weate.products.extra). */
(function () {
  "use strict";

  var SEED = [
  {
    "id": "aardappel",
    "name": "Aardappelen",
    "brand": null,
    "pack": "3kg",
    "aisle": "Vers",
    "aliases": [
      "aardappel",
      "krieltjes"
    ],
    "stores": null
  },
  {
    "id": "ham",
    "name": "Achterham",
    "brand": null,
    "pack": "150 g",
    "aisle": "Koeling",
    "aliases": [
      "ham",
      "beenham"
    ],
    "stores": null
  },
  {
    "id": "afwasmiddel",
    "name": "Afwasmiddel",
    "brand": null,
    "pack": null,
    "aisle": "Huis",
    "aliases": [
      "afwas",
      "afwasmiddel"
    ],
    "stores": null
  },
  {
    "id": "appel",
    "name": "Appels",
    "brand": null,
    "pack": null,
    "aisle": "Vers",
    "aliases": [
      "appel",
      "appels"
    ],
    "stores": null
  },
  {
    "id": "azijn",
    "name": "Azijn",
    "brand": null,
    "pack": null,
    "aisle": "Houdbaar",
    "aliases": [
      "azijn",
      "natuurazijn"
    ],
    "stores": null
  },
  {
    "id": "fruit",
    "name": "Bananen",
    "brand": null,
    "pack": "1 stuks",
    "aisle": "Vers",
    "aliases": [
      "fruit",
      "trossen bananen",
      "banaan",
      "tros bananen"
    ],
    "stores": null
  },
  {
    "id": "bloem",
    "name": "Bloem",
    "brand": null,
    "pack": "1kg",
    "aisle": "Houdbaar",
    "aliases": [
      "tarwebloem"
    ],
    "stores": null
  },
  {
    "id": "bloemkool",
    "name": "Bloemkool",
    "brand": null,
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [],
    "stores": null
  },
  {
    "id": "boerenkool",
    "name": "Boerenkool gesneden",
    "brand": null,
    "pack": "500g",
    "aisle": "Vers",
    "aliases": [
      "boerenkool"
    ],
    "stores": null
  },
  {
    "id": "boterhamworst",
    "name": "Boterhamworst",
    "brand": null,
    "pack": null,
    "aisle": "Koeling",
    "aliases": [
      "boterhamworst"
    ],
    "stores": null
  },
  {
    "id": "braadvlees",
    "name": "Braadlappen / slavink",
    "brand": null,
    "pack": "600g",
    "aisle": "Koeling",
    "aliases": [
      "braadvlees",
      "braadlappen",
      "slavink",
      "slavinkjes"
    ],
    "stores": null
  },
  {
    "id": "broccoli",
    "name": "Broccoli",
    "brand": null,
    "pack": null,
    "aisle": "Vers",
    "aliases": [
      "broccoli"
    ],
    "stores": null
  },
  {
    "id": "brood",
    "name": "Brood",
    "brand": null,
    "pack": "1 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "heel brood",
      "sneetjes brood"
    ],
    "stores": null
  },
  {
    "id": "champignon",
    "name": "Champignons",
    "brand": null,
    "pack": "250g",
    "aisle": "Vers",
    "aliases": [
      "champignon"
    ],
    "stores": null
  },
  {
    "id": "chips",
    "name": "Chips",
    "brand": null,
    "pack": null,
    "aisle": "Houdbaar",
    "aliases": [
      "chips",
      "aardappelchips"
    ],
    "stores": null
  },
  {
    "id": "cola",
    "name": "Cola",
    "brand": null,
    "pack": "1,5L",
    "aisle": "Houdbaar",
    "aliases": [
      "cola"
    ],
    "stores": null
  },
  {
    "id": "courgette",
    "name": "Courgette",
    "brand": null,
    "pack": null,
    "aisle": "Vers",
    "aliases": [
      "courgette"
    ],
    "stores": null
  },
  {
    "id": "room",
    "name": "Crème fraîche",
    "brand": null,
    "pack": "125g",
    "aisle": "Koeling",
    "aliases": [
      "room",
      "creme fraiche"
    ],
    "stores": null
  },
  {
    "id": "ei",
    "name": "Eieren",
    "brand": null,
    "pack": "10 stuks",
    "aisle": "Koeling",
    "aliases": [
      "ei",
      "doos eieren 10",
      "scharreleieren"
    ],
    "stores": null
  },
  {
    "id": "fruitsap",
    "name": "Fruitsap",
    "brand": null,
    "pack": "1L",
    "aisle": "Koeling",
    "aliases": [
      "sinaasappelsap",
      "fruitsap"
    ],
    "stores": null
  },
  {
    "id": "garnalen",
    "name": "Garnalen",
    "brand": null,
    "pack": "200g",
    "aisle": "Koeling",
    "aliases": [
      "garnaal"
    ],
    "stores": null
  },
  {
    "id": "gember",
    "name": "Gember",
    "brand": null,
    "pack": "50 g",
    "aisle": "Vers",
    "aliases": [
      "verse gember"
    ],
    "stores": null
  },
  {
    "id": "kaas",
    "name": "Geraspte kaas",
    "brand": null,
    "pack": "200g",
    "aisle": "Koeling",
    "aliases": [
      "kaas",
      "kaas geraspt",
      "geraspte jong belegen"
    ],
    "stores": null
  },
  {
    "id": "pastaGF",
    "name": "Glutenvrije pasta",
    "brand": null,
    "pack": "500g",
    "aisle": "Houdbaar",
    "aliases": [
      "pastagf",
      "pasta glutenvrij"
    ],
    "stores": null
  },
  {
    "id": "guacamole",
    "name": "Guacamole",
    "brand": null,
    "pack": null,
    "aisle": "Koeling",
    "aliases": [
      "guacamole"
    ],
    "stores": null
  },
  {
    "id": "hagelslag",
    "name": "Hagelslag",
    "brand": null,
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "chocoladehagel"
    ],
    "stores": null
  },
  {
    "id": "melk",
    "name": "Halfvolle melk",
    "brand": null,
    "pack": "1,5L",
    "aisle": "Koeling",
    "aliases": [
      "melk",
      "melk halfvol",
      "houdbare melk"
    ],
    "stores": null
  },
  {
    "id": "hummus",
    "name": "Hummus",
    "brand": null,
    "pack": null,
    "aisle": "Koeling",
    "aliases": [
      "hummus",
      "hoemoes"
    ],
    "stores": null
  },
  {
    "id": "sla",
    "name": "IJsbergsla",
    "brand": null,
    "pack": "200 g",
    "aisle": "Vers",
    "aliases": [
      "sla",
      "kropsla"
    ],
    "stores": null
  },
  {
    "id": "jus",
    "name": "Jus",
    "brand": null,
    "pack": "1 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "jus poeder of bakje jus",
      "juspoeder",
      "bakje jus"
    ],
    "stores": null
  },
  {
    "id": "boterhamkaas",
    "name": "Kaas (beleg)",
    "brand": null,
    "pack": null,
    "aisle": "Koeling",
    "aliases": [
      "jong belegen",
      "kaasplakken",
      "belegen kaas"
    ],
    "stores": null
  },
  {
    "id": "kerrie",
    "name": "Kerriepasta",
    "brand": null,
    "pack": "1 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "kerrie",
      "milde kerriepasta",
      "milde kerrie"
    ],
    "stores": null
  },
  {
    "id": "tomaatKers",
    "name": "Kerstomaat",
    "brand": null,
    "pack": "250g",
    "aisle": "Vers",
    "aliases": [
      "tomaatkers",
      "kerstomaten",
      "cherrytomaat"
    ],
    "stores": null
  },
  {
    "id": "ketjap",
    "name": "Ketjap manis",
    "brand": null,
    "pack": "250ml",
    "aisle": "Houdbaar",
    "aliases": [
      "ketjap"
    ],
    "stores": null
  },
  {
    "id": "keukenPapier",
    "name": "Keukenpapier",
    "brand": null,
    "pack": null,
    "aisle": "Huis",
    "aliases": [
      "keukenrol",
      "keukenpapier"
    ],
    "stores": null
  },
  {
    "id": "kip",
    "name": "Kipfilet",
    "brand": null,
    "pack": "600g",
    "aisle": "Koeling",
    "aliases": [
      "kip",
      "kipfilets",
      "kipfilet reepjes"
    ],
    "stores": null
  },
  {
    "id": "knoflook",
    "name": "Knoflook",
    "brand": null,
    "pack": "1 teen",
    "aisle": "Vers",
    "aliases": [
      "teentje knoflook",
      "knoflookteen"
    ],
    "stores": null
  },
  {
    "id": "koffie",
    "name": "Koffie",
    "brand": null,
    "pack": null,
    "aisle": "Houdbaar",
    "aliases": [
      "koffie",
      "koffiebonen",
      "filterkoffie"
    ],
    "stores": null
  },
  {
    "id": "kokosmelk",
    "name": "Kokosmelk",
    "brand": null,
    "pack": "400ml",
    "aisle": "Houdbaar",
    "aliases": [
      "kokosmelk"
    ],
    "stores": null
  },
  {
    "id": "komkommer",
    "name": "Komkommer",
    "brand": null,
    "pack": "1 stuks",
    "aisle": "Vers",
    "aliases": [],
    "stores": null
  },
  {
    "id": "kurkuma",
    "name": "Kurkuma",
    "brand": null,
    "pack": "1 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "kurkuma gemalen"
    ],
    "stores": null
  },
  {
    "id": "kwark",
    "name": "Kwark",
    "brand": null,
    "pack": "500g",
    "aisle": "Koeling",
    "aliases": [
      "magere kwark"
    ],
    "stores": null
  },
  {
    "id": "lasagne",
    "name": "Lasagneplaten",
    "brand": null,
    "pack": "1 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "lasagne",
      "lasagnebladen"
    ],
    "stores": null
  },
  {
    "id": "lasagneGF",
    "name": "Lasagneplaten glutenvrij",
    "brand": null,
    "pack": "1 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "lasagnegf"
    ],
    "stores": null
  },
  {
    "id": "mais",
    "name": "Mais",
    "brand": null,
    "pack": null,
    "aisle": "Houdbaar",
    "aliases": [
      "mais",
      "maiskorrels",
      "blik mais"
    ],
    "stores": null
  },
  {
    "id": "mayo",
    "name": "Mayonaise",
    "brand": null,
    "pack": "350ml",
    "aisle": "Houdbaar",
    "aliases": [
      "mayo"
    ],
    "stores": null
  },
  {
    "id": "mozzarella",
    "name": "Mozzarella",
    "brand": null,
    "pack": "125 g",
    "aisle": "Koeling",
    "aliases": [],
    "stores": null
  },
  {
    "id": "nasiMix",
    "name": "Nasi kruidenmix",
    "brand": null,
    "pack": "1 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "nasimix",
      "nasi goreng kruidenmix",
      "nasi mix"
    ],
    "stores": null
  },
  {
    "id": "nootmuskaat",
    "name": "Nootmuskaat",
    "brand": null,
    "pack": "1 stuks",
    "aisle": "Houdbaar",
    "aliases": [],
    "stores": null
  },
  {
    "id": "olie",
    "name": "Olie",
    "brand": null,
    "pack": null,
    "aisle": "Houdbaar",
    "aliases": [
      "olijfolie",
      "zonnebloemolie",
      "bakolie",
      "olie"
    ],
    "stores": null
  },
  {
    "id": "panko",
    "name": "Panko paneermeel",
    "brand": null,
    "pack": "200g",
    "aisle": "Houdbaar",
    "aliases": [
      "panko",
      "paneermeel"
    ],
    "stores": null
  },
  {
    "id": "meel",
    "name": "Pannenkoekmix",
    "brand": null,
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "meel",
      "pannenkoekenmix"
    ],
    "stores": null
  },
  {
    "id": "paprika",
    "name": "Paprika",
    "brand": null,
    "pack": "3-pack",
    "aisle": "Vers",
    "aliases": [
      "paprika's",
      "paprikas",
      "zoete paprika"
    ],
    "stores": null
  },
  {
    "id": "pasta",
    "name": "Pasta",
    "brand": null,
    "pack": "500g",
    "aisle": "Houdbaar",
    "aliases": [
      "macaroni",
      "penne",
      "spaghetti",
      "fusilli"
    ],
    "stores": null
  },
  {
    "id": "pesto",
    "name": "Pesto",
    "brand": null,
    "pack": "190g",
    "aisle": "Houdbaar",
    "aliases": [
      "groene pesto"
    ],
    "stores": null
  },
  {
    "id": "beleg",
    "name": "Pindakaas",
    "brand": null,
    "pack": "350 g",
    "aisle": "Houdbaar",
    "aliases": [
      "beleg",
      "pindasmeer"
    ],
    "stores": null
  },
  {
    "id": "pindasaus",
    "name": "Pindasaus kant-en-klaar",
    "brand": null,
    "pack": "350g",
    "aisle": "Houdbaar",
    "aliases": [
      "pindasaus",
      "satésaus",
      "satesaus"
    ],
    "stores": null
  },
  {
    "id": "pita",
    "name": "Pitabrood",
    "brand": null,
    "pack": "6 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "pita",
      "pitabroodjes"
    ],
    "stores": null
  },
  {
    "id": "bodem",
    "name": "Pizzabodem",
    "brand": null,
    "pack": "1 stuks",
    "aisle": "Koeling",
    "aliases": [
      "bodem",
      "pizzabodems"
    ],
    "stores": null
  },
  {
    "id": "prei",
    "name": "Prei",
    "brand": null,
    "pack": null,
    "aisle": "Vers",
    "aliases": [
      "prei",
      "preien"
    ],
    "stores": null
  },
  {
    "id": "ricotta",
    "name": "Ricotta",
    "brand": null,
    "pack": "250g",
    "aisle": "Koeling",
    "aliases": [],
    "stores": null
  },
  {
    "id": "rijst",
    "name": "Rijst",
    "brand": null,
    "pack": "1kg",
    "aisle": "Houdbaar",
    "aliases": [
      "basmatirijst",
      "zilvervliesrijst"
    ],
    "stores": null
  },
  {
    "id": "linzen",
    "name": "Rode linzen",
    "brand": null,
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "linzen"
    ],
    "stores": null
  },
  {
    "id": "rookworst",
    "name": "Rookworst",
    "brand": null,
    "pack": "1 stuks",
    "aisle": "Koeling",
    "aliases": [
      "gelderse rookworst"
    ],
    "stores": null
  },
  {
    "id": "boter",
    "name": "Roomboter",
    "brand": null,
    "pack": "250 g",
    "aisle": "Koeling",
    "aliases": [
      "boter",
      "ongezouten boter"
    ],
    "stores": null
  },
  {
    "id": "gehakt",
    "name": "Rundergehakt",
    "brand": null,
    "pack": "500g",
    "aisle": "Koeling",
    "aliases": [
      "gehakt",
      "gehakt rund",
      "gemengd gehakt"
    ],
    "stores": null
  },
  {
    "id": "sambal",
    "name": "Sambal oelek",
    "brand": null,
    "pack": "200g",
    "aisle": "Houdbaar",
    "aliases": [
      "sambal"
    ],
    "stores": null
  },
  {
    "id": "sesamolie",
    "name": "Sesamolie",
    "brand": null,
    "pack": "150ml",
    "aisle": "Houdbaar",
    "aliases": [],
    "stores": null
  },
  {
    "id": "sinaasappel",
    "name": "Sinaasappels",
    "brand": null,
    "pack": null,
    "aisle": "Vers",
    "aliases": [
      "sinaasappel",
      "sinaasappels",
      "appelsien"
    ],
    "stores": null
  },
  {
    "id": "soja",
    "name": "Sojasaus",
    "brand": null,
    "pack": "50 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "soja",
      "tamari"
    ],
    "stores": null
  },
  {
    "id": "spinazie",
    "name": "Spinazie",
    "brand": null,
    "pack": "450 g",
    "aisle": "Koeling",
    "aliases": [
      "spinazie diepvries",
      "diepvriesspinazie",
      "bladspinazie"
    ],
    "stores": null
  },
  {
    "id": "suiker",
    "name": "Suiker",
    "brand": null,
    "pack": "1kg",
    "aisle": "Houdbaar",
    "aliases": [
      "suiker",
      "kristalsuiker"
    ],
    "stores": null
  },
  {
    "id": "sweetChili",
    "name": "Sweet chili saus",
    "brand": null,
    "pack": "250ml",
    "aisle": "Houdbaar",
    "aliases": [
      "sweetchili",
      "sweet chili",
      "sweet chilisaus",
      "zoete chilisaus"
    ],
    "stores": null
  },
  {
    "id": "tandenpasta",
    "name": "Tandenpasta",
    "brand": null,
    "pack": null,
    "aisle": "Huis",
    "aliases": [
      "tandenpasta",
      "tandpasta"
    ],
    "stores": null
  },
  {
    "id": "thee",
    "name": "Thee",
    "brand": null,
    "pack": null,
    "aisle": "Houdbaar",
    "aliases": [
      "thee",
      "theezakjes"
    ],
    "stores": null
  },
  {
    "id": "toiletPapier",
    "name": "Toiletpapier",
    "brand": null,
    "pack": "6-pack",
    "aisle": "Huis",
    "aliases": [
      "wc papier",
      "toiletpapier",
      "toilet papier"
    ],
    "stores": null
  },
  {
    "id": "toiletreiniger",
    "name": "Toiletreiniger",
    "brand": null,
    "pack": null,
    "aisle": "Huis",
    "aliases": [
      "wc reiniger",
      "toiletreiniger"
    ],
    "stores": null
  },
  {
    "id": "tomaatVers",
    "name": "Tomaat (vers)",
    "brand": null,
    "pack": null,
    "aisle": "Vers",
    "aliases": [
      "verse tomaat",
      "tomaten vers",
      "vleestomaat"
    ],
    "stores": null
  },
  {
    "id": "tomaat",
    "name": "Tomatenblokjes",
    "brand": null,
    "pack": "400g",
    "aisle": "Houdbaar",
    "aliases": [
      "tomaat",
      "blik tomaten",
      "passata"
    ],
    "stores": null
  },
  {
    "id": "tortillaChips",
    "name": "Tortillachips",
    "brand": null,
    "pack": null,
    "aisle": "Houdbaar",
    "aliases": [
      "nacho chips",
      "tortillachips",
      "nachos"
    ],
    "stores": null
  },
  {
    "id": "tzatziki",
    "name": "Tzatziki",
    "brand": null,
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [],
    "stores": null
  },
  {
    "id": "ui",
    "name": "Uien",
    "brand": null,
    "pack": "1kg",
    "aisle": "Vers",
    "aliases": [
      "ui",
      "rode ui"
    ],
    "stores": null
  },
  {
    "id": "wasmiddel",
    "name": "Wasmiddel",
    "brand": null,
    "pack": null,
    "aisle": "Huis",
    "aliases": [
      "wasmiddel",
      "waspoeder"
    ],
    "stores": null
  },
  {
    "id": "water",
    "name": "Water",
    "brand": null,
    "pack": "1,5L",
    "aisle": "Houdbaar",
    "aliases": [
      "mineraalwater",
      "bronwater"
    ],
    "stores": null
  },
  {
    "id": "noedels",
    "name": "Woknoedels",
    "brand": null,
    "pack": "300 g",
    "aisle": "Houdbaar",
    "aliases": [
      "noedels",
      "mie"
    ],
    "stores": null
  },
  {
    "id": "wortel",
    "name": "Wortelen",
    "brand": null,
    "pack": "1kg",
    "aisle": "Vers",
    "aliases": [
      "wortel",
      "winterpeen"
    ],
    "stores": null
  },
  {
    "id": "wraps",
    "name": "Wraps",
    "brand": null,
    "pack": "8 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "wrap",
      "tortilla wraps"
    ],
    "stores": null
  },
  {
    "id": "yoghurt",
    "name": "Yoghurt",
    "brand": null,
    "pack": "1kg",
    "aisle": "Koeling",
    "aliases": [
      "magere yoghurt",
      "volle yoghurt"
    ],
    "stores": null
  },
  {
    "id": "zalm",
    "name": "Zalmfilet",
    "brand": null,
    "pack": "2 stuks",
    "aisle": "Koeling",
    "aliases": [
      "zalm"
    ],
    "stores": null
  },
  {
    "id": "zout",
    "name": "Zout",
    "brand": null,
    "pack": null,
    "aisle": "Houdbaar",
    "aliases": [
      "zout",
      "keukenzout"
    ],
    "stores": null
  }
];

  var EXTRA_KEY = "weate.products.extra";
  var _byId = {};
  var _list = [];

  function norm(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/['\u2019]/g, "")
      .replace(/[^\wäöüßà-ÿ0-9]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function loadExtras() {
    try {
      var raw = localStorage.getItem(EXTRA_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function saveExtras(arr) {
    try {
      localStorage.setItem(EXTRA_KEY, JSON.stringify(arr || []));
    } catch (e) {}
  }

  function slugId(name) {
    var s = norm(name).replace(/\s+/g, "_").replace(/[^a-z0-9_à-ÿ]/g, "");
    if (!s) s = "p" + Date.now().toString(36);
    if (/^[0-9]/.test(s)) s = "p_" + s;
    return s.slice(0, 40);
  }

  function indexAll() {
    _byId = {};
    _list = [];
    SEED.forEach(function (p) {
      _byId[p.id] = Object.assign({}, p, { aliases: (p.aliases || []).slice(), _seed: true });
    });
    loadExtras().forEach(function (p) {
      if (!p || !p.id) return;
      var cur = _byId[p.id];
      if (cur) {
        var aliases = {};
        (cur.aliases || []).forEach(function (a) { aliases[norm(a)] = a; });
        (p.aliases || []).forEach(function (a) { aliases[norm(a)] = a; });
        cur.aliases = Object.keys(aliases).map(function (k) { return aliases[k]; });
        if (p.name) cur.name = p.name;
        if (p.pack != null) cur.pack = p.pack;
        if (p.brand != null) cur.brand = p.brand;
        if (p.aisle) cur.aisle = p.aisle;
        if (p.stores) cur.stores = p.stores;
      } else {
        _byId[p.id] = Object.assign({}, p, { aliases: (p.aliases || []).slice(), _seed: false });
      }
    });
    _list = Object.keys(_byId).map(function (k) { return _byId[k]; });
    _list.sort(function (a, b) {
      return String(a.name || "").localeCompare(String(b.name || ""), "nl");
    });
  }

  function get(id) {
    return id ? _byId[id] || null : null;
  }

  function all() {
    return _list.slice();
  }

  function findByName(name) {
    var n = norm(name);
    if (!n) return null;
    var i, p, a;
    for (i = 0; i < _list.length; i++) {
      p = _list[i];
      if (norm(p.name) === n || norm(p.id) === n) return p;
      for (a = 0; a < (p.aliases || []).length; a++) {
        if (norm(p.aliases[a]) === n) return p;
      }
    }
    var hits = [];
    for (i = 0; i < _list.length; i++) {
      p = _list[i];
      var hay = norm(p.name + " " + (p.aliases || []).join(" ") + " " + p.id);
      if (hay.indexOf(n) >= 0) hits.push(p);
    }
    if (hits.length === 1) return hits[0];
    return null;
  }

  function search(q, limit) {
    q = norm(q);
    limit = limit || 12;
    if (!q) return _list.slice(0, limit);
    var scored = [];
    _list.forEach(function (p) {
      var name = norm(p.name);
      var score = 0;
      if (name === q || norm(p.id) === q) score = 100;
      else if (name.indexOf(q) === 0) score = 80;
      else if (name.indexOf(q) >= 0) score = 50;
      (p.aliases || []).forEach(function (al) {
        var a = norm(al);
        if (a === q) score = Math.max(score, 90);
        else if (a.indexOf(q) === 0) score = Math.max(score, 70);
        else if (a.indexOf(q) >= 0) score = Math.max(score, 40);
      });
      if (score) scored.push({ p: p, score: score });
    });
    scored.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      return String(a.p.name).localeCompare(String(b.p.name), "nl");
    });
    return scored.slice(0, limit).map(function (x) { return x.p; });
  }

  function upsert(input) {
    if (!input) return null;
    var name = String(input.name || input.n || "").trim();
    if (!name) return null;
    var existing = (input.id && get(input.id)) || findByName(name);
    var id = (existing && existing.id) || input.id || slugId(name);
    var pack = input.pack != null ? input.pack : (existing && existing.pack) || null;
    var brand = input.brand != null ? input.brand : (existing && existing.brand) || null;
    var aisle = input.aisle || input.s || (existing && existing.aisle) || "Huis";
    var aliases = {};
    if (existing) (existing.aliases || []).forEach(function (a) { aliases[norm(a)] = a; });
    (input.aliases || []).forEach(function (a) { aliases[norm(a)] = a; });
    aliases[norm(name)] = name;
    var product = {
      id: id,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      brand: brand,
      pack: pack,
      aisle: aisle,
      aliases: Object.keys(aliases).filter(function (k) { return k && k !== norm(name); }).map(function (k) { return aliases[k]; }),
      stores: input.stores || (existing && existing.stores) || null
    };
    var extras = loadExtras().filter(function (p) { return p && p.id !== id; });
    extras.push(product);
    saveExtras(extras);
    indexAll();
    return get(id);
  }

  function aliasesFor(idOrName) {
    var p = get(idOrName) || findByName(idOrName);
    if (!p) return [];
    var out = [p.id, p.name].concat(p.aliases || []);
    var seen = {};
    return out
      .map(function (a) { return String(a || "").trim(); })
      .filter(function (a) {
        var k = norm(a);
        if (!k || seen[k]) return false;
        seen[k] = 1;
        return true;
      });
  }

  function preferLabel(idOrName, fallback) {
    var p = get(idOrName) || findByName(idOrName);
    if (!p) return fallback || idOrName || "";
    return p.name;
  }

  function preferMeta(idOrName) {
    var p = get(idOrName) || findByName(idOrName);
    if (!p) return { brand: "", pack: "", aisle: "" };
    return { brand: p.brand || "", pack: p.pack || "", aisle: p.aisle || "" };
  }

  indexAll();

  window.WeAteProducts = {
    all: all,
    get: get,
    search: search,
    findByName: findByName,
    upsert: upsert,
    aliasesFor: aliasesFor,
    preferLabel: preferLabel,
    preferMeta: preferMeta,
    reload: indexAll,
    seedSize: function () { return SEED.length; },
    size: function () { return _list.length; }
  };
})();
