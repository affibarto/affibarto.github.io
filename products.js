/* WeAte eigen productcatalogus — géén volledige AH/Jumbo-assortiment-scrape.
   Seed: NL boodschappen-staples (vers, zuivel, vlees/vis, voorraad, diepvries, bakkerij, huis).
   Aliases voeden Actie-matching (strict whole-word, zie folder.js).
   Free-text toevoegen upsert naar localStorage (weate.products.extra).
   Zoeken is typeahead-only: lege query → geen resultaten. */
(function () {
  "use strict";

  var SEED = [
  {
    "id": "aardappel",
    "name": "Aardappelen",
    "brand": null,
    "pack": "3 kg",
    "aisle": "Vers",
    "aliases": [
      "aardappel"
    ],
    "stores": null,
    "brandTier": "B",
    "img": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "aardbei",
    "name": "Aardbeien",
    "brand": null,
    "brandTier": "A",
    "pack": "250 g",
    "aisle": "Vers",
    "aliases": [
      "aardbei",
      "strawberries"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "jam_aardbei",
    "name": "Aardbeienjam",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "aardbeienjam",
      "jam"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "A",
    "img": null
  },
  {
    "id": "afwasborstel",
    "name": "Afwasborstel",
    "brand": null,
    "brandTier": null,
    "pack": "1 stuk",
    "aisle": "Huis",
    "aliases": [
      "afwasborstel"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "afwasmiddel",
    "name": "Afwasmiddel",
    "brand": null,
    "pack": "1 L",
    "aisle": "Huis",
    "aliases": [
      "afwas",
      "afwasmiddel"
    ],
    "stores": null,
    "brandTier": null,
    "img": null
  },
  {
    "id": "allesreiniger",
    "name": "Allesreiniger",
    "brand": null,
    "brandTier": null,
    "pack": "1 L",
    "aisle": "Huis",
    "aliases": [
      "allesreiniger"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "aluminiumfolie",
    "name": "Aluminiumfolie",
    "brand": null,
    "brandTier": null,
    "pack": "1 rol",
    "aisle": "Huis",
    "aliases": [
      "aluminium",
      "alufolie"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "amandelen",
    "name": "Amandelen",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Houdbaar",
    "aliases": [
      "amandel"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "amandelmelk",
    "name": "Amandelmelk",
    "brand": null,
    "brandTier": "A",
    "pack": "1 L",
    "aisle": "Koeling",
    "aliases": [
      "amandel drink"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "ananas",
    "name": "Ananas",
    "brand": null,
    "brandTier": "A",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "ananas"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "andijvie",
    "name": "Andijvie",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Vers",
    "aliases": [
      "andijvie gesneden"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "ansjovis",
    "name": "Ansjovis",
    "brand": null,
    "brandTier": "A",
    "pack": "50 g",
    "aisle": "Houdbaar",
    "aliases": [
      "ansjovis"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "appelazijn",
    "name": "Appelazijn",
    "brand": null,
    "brandTier": "A",
    "pack": "500 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "appelazijn"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "appel",
    "name": "Appels",
    "brand": null,
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "appel",
      "appels"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
  },
  {
    "id": "asperge",
    "name": "Asperges",
    "brand": null,
    "brandTier": "A",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "asperge",
      "witte asperge"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "aubergine",
    "name": "Aubergine",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "egg plant",
      "eierplant"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "augurken_pot",
    "name": "Augurken pot",
    "brand": null,
    "brandTier": "B",
    "pack": "680 g",
    "aisle": "Houdbaar",
    "aliases": [
      "augurken"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "avocado",
    "name": "Avocado",
    "brand": null,
    "brandTier": "A",
    "pack": "2 stuks",
    "aisle": "Vers",
    "aliases": [
      "avocado's",
      "avocados"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "azijn",
    "name": "Azijn",
    "brand": null,
    "pack": "1 L",
    "aisle": "Houdbaar",
    "aliases": [
      "azijn",
      "natuurazijn"
    ],
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "bakpoeder",
    "name": "Bakpoeder",
    "brand": null,
    "brandTier": "B",
    "pack": "1 blik",
    "aisle": "Houdbaar",
    "aliases": [
      "bakpoeder"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "bami_mix",
    "name": "Bamikruiden",
    "brand": null,
    "brandTier": "B",
    "pack": "1 zakje",
    "aisle": "Houdbaar",
    "aliases": [
      "bami mix"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "img": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
  },
  {
    "id": "basilicum",
    "name": "Basilicum",
    "brand": null,
    "brandTier": "A",
    "pack": "1 potje",
    "aisle": "Vers",
    "aliases": [
      "verse basilicum"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "basmatirijst",
    "name": "Basmatirijst",
    "brand": null,
    "brandTier": "A",
    "pack": "1 kg",
    "aisle": "Houdbaar",
    "aliases": [
      "basmati",
      "basmati rijst"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "suiker_bruin",
    "name": "Basterdsuiker",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "basterdsuiker"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "bataat",
    "name": "Bataat",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "bataat"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kaas_belegen",
    "name": "Belegen kaas",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "belegen"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "beschuit",
    "name": "Beschuit",
    "brand": null,
    "brandTier": "B",
    "pack": "1 rol",
    "aisle": "Houdbaar",
    "aliases": [
      "beschuit"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "biefstuk",
    "name": "Biefstuk",
    "brand": null,
    "brandTier": "A",
    "pack": "300 g",
    "aisle": "Koeling",
    "aliases": [
      "biefstuk"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "bier",
    "name": "Bier",
    "brand": null,
    "brandTier": "A",
    "pack": "6-pack",
    "aisle": "Houdbaar",
    "aliases": [
      "pils"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "bieslook",
    "name": "Bieslook",
    "brand": null,
    "brandTier": "B",
    "pack": "1 bos",
    "aisle": "Vers",
    "aliases": [
      "bieslook"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "eieren_bio",
    "name": "Biologische eieren",
    "brand": null,
    "brandTier": "A",
    "pack": "6 stuks",
    "aisle": "Koeling",
    "aliases": [
      "bio eieren"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_bitterballen",
    "name": "Bitterballen",
    "brand": null,
    "brandTier": "B",
    "pack": "1 doos",
    "aisle": "Diepvries",
    "aliases": [
      "bitterbal"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "bladerdeeg",
    "name": "Bladerdeeg",
    "brand": null,
    "brandTier": "B",
    "pack": "1 rol",
    "aisle": "Houdbaar",
    "aliases": [
      "bladerdeeg"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "bladspinazie",
    "name": "Bladspinazie vers",
    "brand": null,
    "brandTier": "B",
    "pack": "300 g",
    "aisle": "Vers",
    "aliases": [
      "verse spinazie",
      "babyspinazie",
      "baby spinazie"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "blauwe_bes",
    "name": "Blauwe bessen",
    "brand": null,
    "brandTier": "A",
    "pack": "125 g",
    "aisle": "Vers",
    "aliases": [
      "bosbes",
      "bosbessen",
      "blueberries"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "druif_blauw",
    "name": "Blauwe druiven",
    "brand": null,
    "brandTier": "A",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "blauwe druiven"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "blauwaderkaas",
    "name": "Blauwe kaas",
    "brand": null,
    "brandTier": "A",
    "pack": "150 g",
    "aisle": "Koeling",
    "aliases": [
      "gorgonzola",
      "roquefort"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "bleekselderij",
    "name": "Bleekselderij",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "selderij",
      "selderie"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "bloem",
    "name": "Bloem",
    "brand": null,
    "pack": "1 kg",
    "aisle": "Houdbaar",
    "aliases": [
      "tarwebloem"
    ],
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "bloemkool",
    "name": "Bloemkool",
    "brand": null,
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1568584711075-3d9217c3f9af?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
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
    "stores": null,
    "img": "https://images.unsplash.com/photo-1459411550239-aeb811961755?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
  },
  {
    "id": "bolletjes",
    "name": "Bolletjes",
    "brand": null,
    "brandTier": "B",
    "pack": "6 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "zachte bolletjes"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "bosui",
    "name": "Bosui",
    "brand": null,
    "brandTier": "B",
    "pack": "1 bos",
    "aisle": "Vers",
    "aliases": [
      "lente-ui",
      "lente ui",
      "voorjaarsui",
      "spring onion"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1584270354949-c26b0d82b65c?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "boterhamworst",
    "name": "Boterhamworst",
    "brand": null,
    "pack": "150 g",
    "aisle": "Koeling",
    "aliases": [
      "boterhamworst"
    ],
    "stores": null,
    "brandTier": null,
    "img": null
  },
  {
    "id": "boterhamzakjes",
    "name": "Boterhamzakjes",
    "brand": null,
    "brandTier": null,
    "pack": "50 stuks",
    "aisle": "Huis",
    "aliases": [
      "broodzakjes"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "img": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=400&q=60",
    "brandTier": "A"
  },
  {
    "id": "braadworst",
    "name": "Braadworsten",
    "brand": null,
    "brandTier": "B",
    "pack": "4 stuks",
    "aisle": "Koeling",
    "aliases": [
      "braadworst"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "braam",
    "name": "Bramen",
    "brand": null,
    "brandTier": "A",
    "pack": "125 g",
    "aisle": "Vers",
    "aliases": [
      "braam"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "brie",
    "name": "Brie",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "brie"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "broccoli",
    "name": "Broccoli",
    "brand": null,
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "broccoli"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
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
    "stores": null,
    "img": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
  },
  {
    "id": "brood_bruin",
    "name": "Bruin brood",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Houdbaar",
    "aliases": [
      "bruinbrood",
      "volkoren brood"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "bruine_bonen",
    "name": "Bruine bonen",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "bruine bonen"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "bulgur",
    "name": "Bulgur",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "bulgur"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "cacao",
    "name": "Cacaopoeder",
    "brand": null,
    "brandTier": "B",
    "pack": "250 g",
    "aisle": "Houdbaar",
    "aliases": [
      "cacao"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "camembert",
    "name": "Camembert",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "camembert"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "cashewnoten",
    "name": "Cashewnoten",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Houdbaar",
    "aliases": [
      "cashew"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "cervelaat",
    "name": "Cervelaat",
    "brand": null,
    "brandTier": "B",
    "pack": "100 g",
    "aisle": "Koeling",
    "aliases": [
      "cervelaat"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "img": "https://images.unsplash.com/photo-1504545102780-26774c1bb073?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
  },
  {
    "id": "cherry_tomaat",
    "name": "Cherrytomaten",
    "brand": null,
    "brandTier": "A",
    "pack": "250 g",
    "aisle": "Vers",
    "aliases": [
      "cherrytomaat",
      "kerstomaten",
      "cherry tomaat"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "chiazaad",
    "name": "Chiazaad",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Houdbaar",
    "aliases": [
      "chia"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "chilipeper",
    "name": "Chilipeper",
    "brand": null,
    "brandTier": "A",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "rode peper",
      "chili"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "chili_vlokken",
    "name": "Chilivlokken",
    "brand": null,
    "brandTier": "B",
    "pack": "40 g",
    "aisle": "Houdbaar",
    "aliases": [
      "chili flakes"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "chinese_kool",
    "name": "Chinese kool",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "chinese kool"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "chipolata",
    "name": "Chipolata",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "chipolata"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "worst_chipolata",
    "name": "Chipolataworsten",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "chipolataworst"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "chips",
    "name": "Chips",
    "brand": null,
    "pack": "200 g",
    "aisle": "Houdbaar",
    "aliases": [
      "chips",
      "aardappelchips"
    ],
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "chips_naturel",
    "name": "Chips naturel",
    "brand": null,
    "brandTier": "B",
    "pack": "200 g",
    "aisle": "Houdbaar",
    "aliases": [
      "aardappelchips"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "chips_paprika",
    "name": "Chips paprika",
    "brand": null,
    "brandTier": "B",
    "pack": "200 g",
    "aisle": "Houdbaar",
    "aliases": [
      "paprika chips"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "nutella",
    "name": "Choco pasta",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "nutella",
      "chocopasta"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "chocolademelk",
    "name": "Chocolademelk",
    "brand": null,
    "brandTier": "B",
    "pack": "1 L",
    "aisle": "Koeling",
    "aliases": [
      "chocomel"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "vla_chocolade",
    "name": "Chocoladevla",
    "brand": null,
    "brandTier": "B",
    "pack": "1 L",
    "aisle": "Koeling",
    "aliases": [
      "chocoladevla"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "citroen",
    "name": "Citroenen",
    "brand": null,
    "brandTier": "B",
    "pack": "3 stuks",
    "aisle": "Vers",
    "aliases": [
      "citroen"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "cornflakes",
    "name": "Cornflakes",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "cornflakes"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "courgette",
    "name": "Courgette",
    "brand": null,
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "courgette"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
  },
  {
    "id": "couscous",
    "name": "Couscous",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "couscous"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "crackers",
    "name": "Crackers",
    "brand": null,
    "brandTier": "B",
    "pack": "250 g",
    "aisle": "Houdbaar",
    "aliases": [
      "cracker",
      "knackebrod"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "A",
    "img": null
  },
  {
    "id": "croissant",
    "name": "Croissants",
    "brand": null,
    "brandTier": "A",
    "pack": "4 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "croissant"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "cruesli",
    "name": "Cruesli",
    "brand": null,
    "brandTier": "A",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "cruesli"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "curry_saus",
    "name": "Currysaus",
    "brand": null,
    "brandTier": "B",
    "pack": "400 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "currysaus"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "dadels",
    "name": "Dadels",
    "brand": null,
    "brandTier": "A",
    "pack": "250 g",
    "aisle": "Houdbaar",
    "aliases": [
      "dadel"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_andijvie",
    "name": "Diepvries andijvie",
    "brand": null,
    "brandTier": "B",
    "pack": "450 g",
    "aisle": "Diepvries",
    "aliases": [
      "andijvie diepvries"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_bladerdeeg",
    "name": "Diepvries bladerdeeg",
    "brand": null,
    "brandTier": "B",
    "pack": "1 rol",
    "aisle": "Diepvries",
    "aliases": [
      "bladerdeeg diepvries"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_boerenkool",
    "name": "Diepvries boerenkool",
    "brand": null,
    "brandTier": "B",
    "pack": "450 g",
    "aisle": "Diepvries",
    "aliases": [
      "boerenkool diepvries"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_bessen",
    "name": "Diepvries bosvruchten",
    "brand": null,
    "brandTier": "A",
    "pack": "300 g",
    "aisle": "Diepvries",
    "aliases": [
      "bosvruchten diepvries"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_broccoli",
    "name": "Diepvries broccoli",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Diepvries",
    "aliases": [
      "broccoli diepvries"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_brood",
    "name": "Diepvries brood",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Diepvries",
    "aliases": [
      "brood diepvries"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_doperwten",
    "name": "Diepvries doperwten",
    "brand": null,
    "brandTier": "B",
    "pack": "450 g",
    "aisle": "Diepvries",
    "aliases": [
      "doperwten diepvries",
      "erwtjes diepvries"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_garnalen",
    "name": "Diepvries garnalen",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Diepvries",
    "aliases": [
      "garnalen diepvries"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_balletjes",
    "name": "Diepvries gehaktballetjes",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Diepvries",
    "aliases": [
      "gehaktbal diepvries"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_maaltijd",
    "name": "Diepvries maaltijd",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Diepvries",
    "aliases": [
      "ovenmaaltijd"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_pizza",
    "name": "Diepvries pizza",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Diepvries",
    "aliases": [
      "pizza diepvries"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_roerbak",
    "name": "Diepvries roerbakgroente",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Diepvries",
    "aliases": [
      "roerbak diepvries"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_soep",
    "name": "Diepvries soepgroente",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Diepvries",
    "aliases": [
      "soepgroente"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_haricots",
    "name": "Diepvries sperziebonen",
    "brand": null,
    "brandTier": "B",
    "pack": "450 g",
    "aisle": "Diepvries",
    "aliases": [
      "sperziebonen diepvries"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_spinazie",
    "name": "Diepvries spinazie",
    "brand": null,
    "brandTier": "B",
    "pack": "450 g",
    "aisle": "Diepvries",
    "aliases": [
      "spinazie diepvries"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_zalm",
    "name": "Diepvries zalmfilet",
    "brand": null,
    "brandTier": "A",
    "pack": "250 g",
    "aisle": "Diepvries",
    "aliases": [
      "zalm diepvries"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "koek_digestive",
    "name": "Digestive koeken",
    "brand": null,
    "brandTier": "B",
    "pack": "1 pak",
    "aisle": "Houdbaar",
    "aliases": [
      "digestive"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "dille",
    "name": "Dille",
    "brand": null,
    "brandTier": "A",
    "pack": "1 bos",
    "aisle": "Vers",
    "aliases": [
      "verse dille"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "doperwten_blik",
    "name": "Doperwten blik",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "blik doperwten"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "doperwten_vers",
    "name": "Doperwten vers",
    "brand": null,
    "brandTier": "B",
    "pack": "300 g",
    "aisle": "Vers",
    "aliases": [
      "doperwt",
      "erwtjes vers"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "douchegel",
    "name": "Douchegel",
    "brand": null,
    "brandTier": null,
    "pack": "250 ml",
    "aisle": "Huis",
    "aliases": [
      "douchegel"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "druiven",
    "name": "Druiven",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "blauwe druiven",
      "witte druiven"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=400&q=60"
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
    "stores": null,
    "img": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=60",
    "brandTier": null
  },
  {
    "id": "eiersalade",
    "name": "Eiersalade",
    "brand": null,
    "brandTier": "B",
    "pack": "150 g",
    "aisle": "Koeling",
    "aliases": [
      "eiersalade"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "sla_eikenblad",
    "name": "Eikenbladsla",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "eikenblad"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "appel_elstar",
    "name": "Elstar appels",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "elstar"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "entrecote",
    "name": "Entrecote",
    "brand": null,
    "brandTier": "A",
    "pack": "300 g",
    "aisle": "Koeling",
    "aliases": [
      "entrecote"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "feta",
    "name": "Feta",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "fetakaas"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "filet_americain",
    "name": "Filet americain",
    "brand": null,
    "brandTier": "A",
    "pack": "150 g",
    "aisle": "Koeling",
    "aliases": [
      "americain"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "filodeeg",
    "name": "Filodeeg",
    "brand": null,
    "brandTier": "A",
    "pack": "1 pak",
    "aisle": "Houdbaar",
    "aliases": [
      "filodeeg"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "koffie_filter",
    "name": "Filterkoffie",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "gemalen koffie"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "framboos",
    "name": "Frambozen",
    "brand": null,
    "brandTier": "A",
    "pack": "125 g",
    "aisle": "Vers",
    "aliases": [
      "framboos"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "frisdrank",
    "name": "Frisdrank",
    "brand": null,
    "brandTier": "B",
    "pack": "1,5 L",
    "aisle": "Houdbaar",
    "aliases": [
      "sinas",
      "fanta"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_friet",
    "name": "Frites",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Diepvries",
    "aliases": [
      "friet",
      "patat",
      "frites"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": null,
    "img": null
  },
  {
    "id": "pasta_fusilli",
    "name": "Fusilli",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "fusilli",
      "schroefjes"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "img": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=400&q=60",
    "brandTier": "A"
  },
  {
    "id": "geitenkaas",
    "name": "Geitenkaas",
    "brand": null,
    "brandTier": "A",
    "pack": "100 g",
    "aisle": "Koeling",
    "aliases": [
      "geitenkaas"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "paprika_geel",
    "name": "Gele paprika",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "gele paprika"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "visfilet_gemengd",
    "name": "Gemengde visfilet",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "visfilet"
    ],
    "stores": null,
    "img": null
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
      "geraspte jong belegen",
      "rasp",
      "kaas_geraspt"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=400&q=60",
    "brandTier": "A"
  },
  {
    "id": "mozzarella_geraspt",
    "name": "Geraspte mozzarella",
    "brand": null,
    "brandTier": "B",
    "pack": "150 g",
    "aisle": "Koeling",
    "aliases": [
      "rasp mozzarella"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "gerookte_zalm",
    "name": "Gerookte zalm",
    "brand": null,
    "brandTier": "A",
    "pack": "100 g",
    "aisle": "Koeling",
    "aliases": [
      "smoked salmon"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "gesneden_andijvie",
    "name": "Gesneden andijvie",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Vers",
    "aliases": [
      "gesneden andijvie"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "gist",
    "name": "Gist",
    "brand": null,
    "brandTier": "B",
    "pack": "1 pak",
    "aisle": "Houdbaar",
    "aliases": [
      "verse gist",
      "droge gist"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "grapefruit",
    "name": "Grapefruit",
    "brand": null,
    "brandTier": "B",
    "pack": "2 stuks",
    "aisle": "Vers",
    "aliases": [
      "pompelmoes"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "yoghurt_grieks",
    "name": "Griekse yoghurt",
    "brand": null,
    "brandTier": "A",
    "pack": "500 g",
    "aisle": "Koeling",
    "aliases": [
      "griekse yoghurt"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "groene_asperge",
    "name": "Groene asperges",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Vers",
    "aliases": [
      "groene asperge"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "paprika_groen",
    "name": "Groene paprika",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "groene paprika"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "thee_groen",
    "name": "Groene thee",
    "brand": null,
    "brandTier": "A",
    "pack": "20 zakjes",
    "aisle": "Houdbaar",
    "aliases": [
      "groene thee"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "bouillon_groente",
    "name": "Groentebouillonblokjes",
    "brand": null,
    "brandTier": "B",
    "pack": "12 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "groentebouillon"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "guacamole",
    "name": "Guacamole",
    "brand": null,
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "guacamole"
    ],
    "stores": null,
    "brandTier": null,
    "img": null
  },
  {
    "id": "gyros",
    "name": "Gyros",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Koeling",
    "aliases": [
      "gyros"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "gehakt_halfom",
    "name": "Half-om-half gehakt",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Koeling",
    "aliases": [
      "half om half",
      "halfomhalf"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kwark_halfvol",
    "name": "Halfvolle kwark",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Koeling",
    "aliases": [
      "halfvolle kwark"
    ],
    "stores": null,
    "img": null
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
      "houdbare melk",
      "melk_halfvol"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=60",
    "brandTier": "A"
  },
  {
    "id": "hamburgerbroodje",
    "name": "Hamburgerbroodjes",
    "brand": null,
    "brandTier": "B",
    "pack": "4 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "bun",
      "hamburger broodjes"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "handzeep",
    "name": "Handzeep",
    "brand": null,
    "brandTier": null,
    "pack": "250 ml",
    "aisle": "Huis",
    "aliases": [
      "handzeep"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "haring",
    "name": "Haring",
    "brand": null,
    "brandTier": "A",
    "pack": "2 stuks",
    "aisle": "Koeling",
    "aliases": [
      "hollandse nieuwe"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "havermelk",
    "name": "Havermelk",
    "brand": null,
    "brandTier": "A",
    "pack": "1 L",
    "aisle": "Koeling",
    "aliases": [
      "haver drink",
      "oat milk"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "havermout",
    "name": "Havermout",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "havervlokken"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "brood_heel",
    "name": "Heel brood",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Houdbaar",
    "aliases": [
      "heel brood"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "honing",
    "name": "Honing",
    "brand": null,
    "brandTier": "A",
    "pack": "350 g",
    "aisle": "Houdbaar",
    "aliases": [
      "honing"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "honingmeloen",
    "name": "Honingmeloen",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "honing meloen"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "hotdogbroodje",
    "name": "Hotdogbroodjes",
    "brand": null,
    "brandTier": "B",
    "pack": "6 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "hotdog broodjes"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "hummus",
    "name": "Hummus",
    "brand": null,
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "hoemoes",
      "humus"
    ],
    "stores": null,
    "brandTier": null,
    "img": null
  },
  {
    "id": "ijs_thee",
    "name": "Ice tea",
    "brand": null,
    "brandTier": "B",
    "pack": "1,5 L",
    "aisle": "Houdbaar",
    "aliases": [
      "ice tea",
      "ijsthee"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "sla",
    "name": "IJsbergsla",
    "brand": null,
    "pack": "200 g",
    "aisle": "Vers",
    "aliases": [
      "sla",
      "kropsla",
      "ijsberg",
      "sla_ijsberg"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
  },
  {
    "id": "ijsbergsla",
    "name": "IJsbergsla krop",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "ijsbergsla krop"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "appel_jonagold",
    "name": "Jonagold appels",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "jonagold"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kaas_jongbelegen",
    "name": "Jong belegen kaas",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "jong belegen"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kaas_jong",
    "name": "Jonge kaas",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "jonge kaas"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "boterhamkaas",
    "name": "Kaas (beleg)",
    "brand": null,
    "pack": "300 g",
    "aisle": "Koeling",
    "aliases": [
      "jong belegen",
      "kaasplakken",
      "belegen kaas"
    ],
    "stores": null,
    "brandTier": null,
    "img": null
  },
  {
    "id": "kaas_plakken",
    "name": "Kaasplakken",
    "brand": null,
    "brandTier": "B",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "plakken kaas"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kabeljauw",
    "name": "Kabeljauwfilet",
    "brand": null,
    "brandTier": "A",
    "pack": "300 g",
    "aisle": "Koeling",
    "aliases": [
      "kabeljauw",
      "wijting",
      "witvis"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "kalkoenfilet",
    "name": "Kalkoenfilet",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "kalkoen"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kaneel",
    "name": "Kaneel",
    "brand": null,
    "brandTier": "B",
    "pack": "50 g",
    "aisle": "Houdbaar",
    "aliases": [
      "kaneel"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "capers",
    "name": "Kappertjes",
    "brand": null,
    "brandTier": "A",
    "pack": "100 g",
    "aisle": "Houdbaar",
    "aliases": [
      "kappertjes"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "karbonade",
    "name": "Karbonades",
    "brand": null,
    "brandTier": "B",
    "pack": "4 stuks",
    "aisle": "Koeling",
    "aliases": [
      "karbonade"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "karnemelk",
    "name": "Karnemelk",
    "brand": null,
    "brandTier": "B",
    "pack": "1 L",
    "aisle": "Koeling",
    "aliases": [
      "karnemelk"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kastanjechampignon",
    "name": "Kastanjechampignons",
    "brand": null,
    "brandTier": "A",
    "pack": "250 g",
    "aisle": "Vers",
    "aliases": [
      "kastanje champignon"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "kerriepoeder",
    "name": "Kerriepoeder",
    "brand": null,
    "brandTier": "B",
    "pack": "50 g",
    "aisle": "Houdbaar",
    "aliases": [
      "currypoeder"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kers",
    "name": "Kersen",
    "brand": null,
    "brandTier": "A",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "kers"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "img": "https://images.unsplash.com/photo-1592924357228-91b4eada47f4?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
  },
  {
    "id": "ketchup",
    "name": "Ketchup",
    "brand": null,
    "brandTier": "B",
    "pack": "500 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "tomatenketchup"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "keukenPapier",
    "name": "Keukenpapier",
    "brand": null,
    "pack": "2-pack",
    "aisle": "Huis",
    "aliases": [
      "keukenrol",
      "keukenpapier"
    ],
    "stores": null,
    "brandTier": null,
    "img": null
  },
  {
    "id": "kidneybonen",
    "name": "Kidneybonen",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "kidney",
      "rode bonen"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kikkererwten",
    "name": "Kikkererwten",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "kikkererwt"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kipdijfilet",
    "name": "Kipdijfilet",
    "brand": null,
    "brandTier": "A",
    "pack": "600 g",
    "aisle": "Koeling",
    "aliases": [
      "kipdij",
      "kipdijen",
      "dijfilet kip"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "kip",
    "name": "Kipfilet",
    "brand": null,
    "pack": "600 g",
    "aisle": "Koeling",
    "aliases": [
      "kip",
      "kipfilets",
      "kipfilet reepjes"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=60",
    "brandTier": "A"
  },
  {
    "id": "kipfilet_koud",
    "name": "Kipfilet koud",
    "brand": null,
    "brandTier": "B",
    "pack": "150 g",
    "aisle": "Koeling",
    "aliases": [
      "gekookte kipfilet"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kipgehakt",
    "name": "Kipgehakt",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Koeling",
    "aliases": [
      "kip gehakt"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_kipnuggets",
    "name": "Kipnuggets",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Diepvries",
    "aliases": [
      "nuggets",
      "kipnugget"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "bouillon_kip",
    "name": "Kippenbouillonblokjes",
    "brand": null,
    "brandTier": "B",
    "pack": "12 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "kippenbouillon",
      "bouillon"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kippenbouten",
    "name": "Kippenbouten",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Koeling",
    "aliases": [
      "kipbouten",
      "drumsticks",
      "kip drumsticks"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "kippenvleugels",
    "name": "Kippenvleugels",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Koeling",
    "aliases": [
      "chicken wings",
      "vleugels"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kip_saté",
    "name": "Kipsaté",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "kipsate",
      "saté"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kiwi",
    "name": "Kiwi",
    "brand": null,
    "brandTier": "B",
    "pack": "6 stuks",
    "aisle": "Vers",
    "aliases": [
      "kiwi's",
      "kiwis"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1585059899903-4d20e6c6c5d2?auto=format&fit=crop&w=400&q=60"
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "knoflookpoeder",
    "name": "Knoflookpoeder",
    "brand": null,
    "brandTier": "B",
    "pack": "50 g",
    "aisle": "Houdbaar",
    "aliases": [
      "knoflookpoeder"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "knolselderij",
    "name": "Knolselderij",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "celeriac"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "koffie",
    "name": "Koffie",
    "brand": null,
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "koffie",
      "koffiebonen",
      "filterkoffie"
    ],
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "koffiebonen",
    "name": "Koffiebonen",
    "brand": null,
    "brandTier": "A",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "bonen koffie"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "koffie_cups",
    "name": "Koffiecups",
    "brand": null,
    "brandTier": "A",
    "pack": "20 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "nespresso cups"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kokosdrink",
    "name": "Kokosdrink",
    "brand": null,
    "brandTier": "A",
    "pack": "1 L",
    "aisle": "Koeling",
    "aliases": [
      "kokosmelk drink"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "kokosolie",
    "name": "Kokosolie",
    "brand": null,
    "brandTier": "A",
    "pack": "500 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "kokosolie"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kokosrasp",
    "name": "Kokosrasp",
    "brand": null,
    "brandTier": "B",
    "pack": "200 g",
    "aisle": "Houdbaar",
    "aliases": [
      "kokosrasp"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "komijn",
    "name": "Komijnzaad",
    "brand": null,
    "brandTier": "B",
    "pack": "50 g",
    "aisle": "Houdbaar",
    "aliases": [
      "komijn",
      "cumin"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "komkommer",
    "name": "Komkommer",
    "brand": null,
    "pack": "1 stuks",
    "aisle": "Vers",
    "aliases": [
      "komkommers"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
  },
  {
    "id": "room_kook",
    "name": "Kookroom",
    "brand": null,
    "brandTier": "B",
    "pack": "250 ml",
    "aisle": "Koeling",
    "aliases": [
      "kookroom"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "koriander_vers",
    "name": "Koriander vers",
    "brand": null,
    "brandTier": "A",
    "pack": "1 bos",
    "aisle": "Vers",
    "aliases": [
      "verse koriander",
      "koriander"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "krabsalad",
    "name": "Krabsalade",
    "brand": null,
    "brandTier": "A",
    "pack": "150 g",
    "aisle": "Koeling",
    "aliases": [
      "krab salade"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kriel",
    "name": "Krielaardappelen",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "krielaardappel"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "krieltjes",
    "name": "Krieltjes",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "krielen",
      "krieltje",
      "krieltjes aardappel"
    ],
    "stores": null,
    "img": "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    "id": "diepvries_kroket",
    "name": "Kroketten",
    "brand": null,
    "brandTier": "B",
    "pack": "1 doos",
    "aisle": "Diepvries",
    "aliases": [
      "kroket"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "sla_kropsla",
    "name": "Kropsla",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "kropsla"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "aardappel_kruimig",
    "name": "Kruimige aardappelen",
    "brand": null,
    "brandTier": "B",
    "pack": "2 kg",
    "aisle": "Vers",
    "aliases": [
      "kruimig"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
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
    "stores": null,
    "brandTier": "A",
    "img": null
  },
  {
    "id": "melk_lactosevrij",
    "name": "Lactosevrije melk",
    "brand": null,
    "brandTier": "A",
    "pack": "1 L",
    "aisle": "Koeling",
    "aliases": [
      "lactosevrij"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "lamskotelet",
    "name": "Lamskoteletten",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "lamskotelet"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "lasagnebladen",
    "name": "Lasagnebladen",
    "brand": null,
    "brandTier": "B",
    "pack": "250 g",
    "aisle": "Houdbaar",
    "aliases": [
      "lasagneplaten"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "leverworst",
    "name": "Leverworst",
    "brand": null,
    "brandTier": "B",
    "pack": "150 g",
    "aisle": "Koeling",
    "aliases": [
      "leverworst"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "lijnzaad",
    "name": "Lijnzaad",
    "brand": null,
    "brandTier": "B",
    "pack": "250 g",
    "aisle": "Houdbaar",
    "aliases": [
      "lijnzaad"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "limoen",
    "name": "Limoenen",
    "brand": null,
    "brandTier": "A",
    "pack": "3 stuks",
    "aisle": "Vers",
    "aliases": [
      "limoen",
      "lime"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "pasta_linguine",
    "name": "Linguine",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "linguine"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "linzen_blik",
    "name": "Linzen blik",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "linzen"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_loempia",
    "name": "Loempia's",
    "brand": null,
    "brandTier": "B",
    "pack": "1 doos",
    "aisle": "Diepvries",
    "aliases": [
      "loempia"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "pasta_macaroni",
    "name": "Macaroni",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "macaroni"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kwark_mager",
    "name": "Magere kwark",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Koeling",
    "aliases": [
      "magere kwark",
      "kwark"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "melk_mager",
    "name": "Magere melk",
    "brand": null,
    "brandTier": "B",
    "pack": "1 L",
    "aisle": "Koeling",
    "aliases": [
      "magere melk"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "yoghurt_magere",
    "name": "Magere yoghurt",
    "brand": null,
    "brandTier": "B",
    "pack": "1 L",
    "aisle": "Koeling",
    "aliases": [
      "magere yoghurt"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "mais",
    "name": "Mais",
    "brand": null,
    "pack": "300 g",
    "aisle": "Houdbaar",
    "aliases": [
      "mais",
      "maiskorrels",
      "blik mais"
    ],
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "mais_blik",
    "name": "Mais blik",
    "brand": null,
    "brandTier": "B",
    "pack": "300 g",
    "aisle": "Houdbaar",
    "aliases": [
      "blik mais"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "maizena",
    "name": "Maizena",
    "brand": null,
    "brandTier": "B",
    "pack": "250 g",
    "aisle": "Houdbaar",
    "aliases": [
      "maiszetmeel"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "makreel",
    "name": "Makreelfilet",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "makreel"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "mandarijn",
    "name": "Mandarijnen",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "mandarijn",
      "clementine"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "mango",
    "name": "Mango",
    "brand": null,
    "brandTier": "A",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "mango"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "margarine",
    "name": "Margarine",
    "brand": null,
    "brandTier": "B",
    "pack": "250 g",
    "aisle": "Koeling",
    "aliases": [
      "halvarine"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "mascarpone",
    "name": "Mascarpone",
    "brand": null,
    "brandTier": "A",
    "pack": "250 g",
    "aisle": "Koeling",
    "aliases": [
      "mascarpone"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "brood_meergranen",
    "name": "Meergranenbrood",
    "brand": null,
    "brandTier": "A",
    "pack": "1 stuk",
    "aisle": "Houdbaar",
    "aliases": [
      "meergranen"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "chocolade_melk",
    "name": "Melkchocolade",
    "brand": null,
    "brandTier": "B",
    "pack": "100 g",
    "aisle": "Houdbaar",
    "aliases": [
      "melkchocola"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "water_spa",
    "name": "Mineraalwater",
    "brand": null,
    "brandTier": "B",
    "pack": "1,5 L",
    "aisle": "Houdbaar",
    "aliases": [
      "mineraalwater",
      "spa"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "mini_komkommer",
    "name": "Mini komkommers",
    "brand": null,
    "brandTier": "B",
    "pack": "1 bak",
    "aisle": "Vers",
    "aliases": [
      "minikomkommer"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "mosselen",
    "name": "Mosselen",
    "brand": null,
    "brandTier": "A",
    "pack": "1 kg",
    "aisle": "Koeling",
    "aliases": [
      "mossel"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "mosterd",
    "name": "Mosterd",
    "brand": null,
    "brandTier": "B",
    "pack": "250 g",
    "aisle": "Houdbaar",
    "aliases": [
      "mosterd"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "mozzarella",
    "name": "Mozzarella",
    "brand": null,
    "pack": "125 g",
    "aisle": "Koeling",
    "aliases": [],
    "stores": null,
    "brandTier": "A",
    "img": null
  },
  {
    "id": "muesli",
    "name": "Muesli",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Houdbaar",
    "aliases": [
      "muesli"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "munt",
    "name": "Munt",
    "brand": null,
    "brandTier": "A",
    "pack": "1 bos",
    "aisle": "Vers",
    "aliases": [
      "verse munt"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "naan",
    "name": "Naanbrood",
    "brand": null,
    "brandTier": "A",
    "pack": "2 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "naan"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "yoghurt_naturel",
    "name": "Naturelyoghurt",
    "brand": null,
    "brandTier": "B",
    "pack": "1 L",
    "aisle": "Koeling",
    "aliases": [
      "naturel yoghurt",
      "yoghurt"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "nectarine",
    "name": "Nectarines",
    "brand": null,
    "brandTier": "B",
    "pack": "4 stuks",
    "aisle": "Vers",
    "aliases": [
      "nectarine"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "nootmuskaat",
    "name": "Nootmuskaat",
    "brand": null,
    "pack": "1 stuks",
    "aisle": "Houdbaar",
    "aliases": [],
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "noten_mix",
    "name": "Notenmix",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Houdbaar",
    "aliases": [
      "gemengde noten",
      "noten"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "oesterzwam",
    "name": "Oesterzwammen",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Vers",
    "aliases": [
      "oesterzwam"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "olie",
    "name": "Olie",
    "brand": null,
    "pack": "1 L",
    "aisle": "Houdbaar",
    "aliases": [
      "zonnebloemolie",
      "bakolie",
      "olie"
    ],
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "olijfolie",
    "name": "Olijfolie",
    "brand": null,
    "brandTier": "A",
    "pack": "500 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "extra vierge olijfolie",
      "olive oil"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1474979266404-7ea403dc07a9?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "olijven",
    "name": "Olijven",
    "brand": null,
    "brandTier": "A",
    "pack": "240 g",
    "aisle": "Houdbaar",
    "aliases": [
      "olijven"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "ontbijtkoek",
    "name": "Ontbijtkoek",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Houdbaar",
    "aliases": [
      "peperkoek"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "ontbijtspek",
    "name": "Ontbijtspek",
    "brand": null,
    "brandTier": "A",
    "pack": "150 g",
    "aisle": "Koeling",
    "aliases": [
      "bacon"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "oregano",
    "name": "Oregano gedroogd",
    "brand": null,
    "brandTier": "B",
    "pack": "20 g",
    "aisle": "Houdbaar",
    "aliases": [
      "oregano"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kaas_oud",
    "name": "Oude kaas",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "oude kaas"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "paksoi",
    "name": "Paksoi",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "pak choi",
      "bok choy"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "rijst_pandan",
    "name": "Pandanrijst",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Houdbaar",
    "aliases": [
      "pandan",
      "jasminrijst"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "paneermeel",
    "name": "Paneermeel",
    "brand": null,
    "brandTier": "B",
    "pack": "200 g",
    "aisle": "Houdbaar",
    "aliases": [
      "paneermeel"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "pangasius",
    "name": "Pangasiusfilet",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Koeling",
    "aliases": [
      "pangasius"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
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
    "stores": null,
    "img": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
  },
  {
    "id": "paprikapoeder",
    "name": "Paprikapoeder",
    "brand": null,
    "brandTier": "B",
    "pack": "50 g",
    "aisle": "Houdbaar",
    "aliases": [
      "paprikapoeder"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "parmezaan",
    "name": "Parmezaanse kaas",
    "brand": null,
    "brandTier": "A",
    "pack": "100 g",
    "aisle": "Koeling",
    "aliases": [
      "parmezaan",
      "parmigiano"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "passata",
    "name": "Passata",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "passata"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "img": "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
  },
  {
    "id": "pastasaus",
    "name": "Pastasaus",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "spaghettisaus"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "pasta_penne",
    "name": "Penne",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "penne"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "peer",
    "name": "Peren",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "peer",
      "conference peer"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "perzik",
    "name": "Perziken",
    "brand": null,
    "brandTier": "B",
    "pack": "4 stuks",
    "aisle": "Vers",
    "aliases": [
      "perzik"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "peterselie",
    "name": "Peterselie",
    "brand": null,
    "brandTier": "B",
    "pack": "1 bos",
    "aisle": "Vers",
    "aliases": [
      "platte peterselie",
      "krulpeterselie"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "pinda",
    "name": "Pinda's",
    "brand": null,
    "brandTier": "B",
    "pack": "250 g",
    "aisle": "Houdbaar",
    "aliases": [
      "pinda"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "pistolet",
    "name": "Pistolets",
    "brand": null,
    "brandTier": "B",
    "pack": "6 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "pistolet",
      "broodje"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
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
    "stores": null,
    "brandTier": null,
    "img": null
  },
  {
    "id": "plantaardige_kaas",
    "name": "Plantaardige kaas",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "vegan kaas"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "plantaardige_yoghurt",
    "name": "Plantaardige yoghurt",
    "brand": null,
    "brandTier": "A",
    "pack": "500 g",
    "aisle": "Koeling",
    "aliases": [
      "vegan yoghurt"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "poedersuiker",
    "name": "Poedersuiker",
    "brand": null,
    "brandTier": "B",
    "pack": "250 g",
    "aisle": "Houdbaar",
    "aliases": [
      "poedersuiker"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "pompoen",
    "name": "Pompoen",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "butternut",
      "hokkaido"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "pompoenpitten",
    "name": "Pompoenpitten",
    "brand": null,
    "brandTier": "A",
    "pack": "150 g",
    "aisle": "Houdbaar",
    "aliases": [
      "pompoenpit"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "popcorn",
    "name": "Popcorn",
    "brand": null,
    "brandTier": "B",
    "pack": "1 pak",
    "aisle": "Houdbaar",
    "aliases": [
      "popcorn"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "postelein",
    "name": "Postelein",
    "brand": null,
    "brandTier": "B",
    "pack": "200 g",
    "aisle": "Vers",
    "aliases": [
      "postelein"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "prei",
    "name": "Prei",
    "brand": null,
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "prei",
      "preien"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1594282486552-05b4d8040dde?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
  },
  {
    "id": "pruim",
    "name": "Pruimen",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "pruim"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "pudding",
    "name": "Pudding",
    "brand": null,
    "brandTier": "B",
    "pack": "4 stuks",
    "aisle": "Koeling",
    "aliases": [
      "toetje",
      "vanillepudding"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "puntpaprika",
    "name": "Puntpaprika",
    "brand": null,
    "brandTier": "A",
    "pack": "2 stuks",
    "aisle": "Vers",
    "aliases": [
      "punt paprika"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "chocolade_puur",
    "name": "Puur chocolade",
    "brand": null,
    "brandTier": "A",
    "pack": "100 g",
    "aisle": "Houdbaar",
    "aliases": [
      "pure chocola"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "hagelslag_puur",
    "name": "Puur hagelslag",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "chocolade hagelslag"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "quinoa",
    "name": "Quinoa",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "quinoa"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "raapstelen",
    "name": "Raapstelen",
    "brand": null,
    "brandTier": "B",
    "pack": "300 g",
    "aisle": "Vers",
    "aliases": [
      "raapsteel"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "radijs",
    "name": "Radijs",
    "brand": null,
    "brandTier": "B",
    "pack": "1 bos",
    "aisle": "Vers",
    "aliases": [
      "radijsjes"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "rauwe_andijvie",
    "name": "Rauwe andijvie",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Vers",
    "aliases": [
      "rauwe andijvie"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "ricotta",
    "name": "Ricotta",
    "brand": null,
    "pack": "250g",
    "aisle": "Koeling",
    "aliases": [],
    "stores": null,
    "brandTier": "A",
    "img": null
  },
  {
    "id": "rijst",
    "name": "Rijst",
    "brand": null,
    "pack": "1 kg",
    "aisle": "Houdbaar",
    "aliases": [
      "zilvervliesrijst",
      "rijst"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
  },
  {
    "id": "rijstnoedels",
    "name": "Rijstnoedels",
    "brand": null,
    "brandTier": "A",
    "pack": "250 g",
    "aisle": "Houdbaar",
    "aliases": [
      "rijstnoodles"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "rijstwafels",
    "name": "Rijstwafels",
    "brand": null,
    "brandTier": "B",
    "pack": "1 pak",
    "aisle": "Houdbaar",
    "aliases": [
      "rijstwafel"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "rijst_risotto",
    "name": "Risottorijst",
    "brand": null,
    "brandTier": "A",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "arborio"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "rode_biet",
    "name": "Rode bieten",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "bieten",
      "rode biet"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "rode_kool",
    "name": "Rode kool",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "rodekool",
      "rode kool geraspt"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1594282486552-05b4d8040dde?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "rode_kool_vers",
    "name": "Rode kool vers",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "rode kool"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "paprika_rood",
    "name": "Rode paprika",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "rode paprika"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "ui_rood",
    "name": "Rode uien",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "rode ui",
      "rode uien"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "wijn_rood",
    "name": "Rode wijn",
    "brand": null,
    "brandTier": "A",
    "pack": "750 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "rode wijn"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "romanesco",
    "name": "Romanesco",
    "brand": null,
    "brandTier": "A",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "romanesco"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "ham_rook",
    "name": "Rookvlees",
    "brand": null,
    "brandTier": "A",
    "pack": "100 g",
    "aisle": "Koeling",
    "aliases": [
      "rookvlees"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "img": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=60",
    "brandTier": "A"
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
    "stores": null,
    "img": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=60",
    "brandTier": "A"
  },
  {
    "id": "diepvries_ijs",
    "name": "Roomijs",
    "brand": null,
    "brandTier": "A",
    "pack": "1 L",
    "aisle": "Diepvries",
    "aliases": [
      "roomijs",
      "ijsjes"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "roomkaas",
    "name": "Roomkaas",
    "brand": null,
    "brandTier": "A",
    "pack": "150 g",
    "aisle": "Koeling",
    "aliases": [
      "philadelphia"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "rozemarijn",
    "name": "Rozemarijn vers",
    "brand": null,
    "brandTier": "A",
    "pack": "1 bos",
    "aisle": "Vers",
    "aliases": [
      "verse rozemarijn"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "rozijnen",
    "name": "Rozijnen",
    "brand": null,
    "brandTier": "B",
    "pack": "250 g",
    "aisle": "Houdbaar",
    "aliases": [
      "rozijn"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "rucola",
    "name": "Rucola",
    "brand": null,
    "brandTier": "B",
    "pack": "75 g",
    "aisle": "Vers",
    "aliases": [
      "rucolasla",
      "raketsla"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=400&q=60"
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
      "gemengd gehakt",
      "gehakt_runder"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=60",
    "brandTier": "A"
  },
  {
    "id": "runderlappen",
    "name": "Runderlappen",
    "brand": null,
    "brandTier": "A",
    "pack": "600 g",
    "aisle": "Koeling",
    "aliases": [
      "draadjesvlees"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "salami",
    "name": "Salami",
    "brand": null,
    "brandTier": "A",
    "pack": "100 g",
    "aisle": "Koeling",
    "aliases": [
      "salami"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "sardines",
    "name": "Sardines blik",
    "brand": null,
    "brandTier": "B",
    "pack": "120 g",
    "aisle": "Houdbaar",
    "aliases": [
      "sardientjes"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "saucijs",
    "name": "Saucijzen",
    "brand": null,
    "brandTier": "B",
    "pack": "4 stuks",
    "aisle": "Koeling",
    "aliases": [
      "saucijs"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "savooiekool",
    "name": "Savooiekool",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "savooie"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "eieren_scharrel",
    "name": "Scharreleieren",
    "brand": null,
    "brandTier": "A",
    "pack": "10 stuks",
    "aisle": "Koeling",
    "aliases": [
      "scharrel ei"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "sesamolie",
    "name": "Sesamolie",
    "brand": null,
    "pack": "150ml",
    "aisle": "Houdbaar",
    "aliases": [],
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "sesamzaad",
    "name": "Sesamzaad",
    "brand": null,
    "brandTier": "B",
    "pack": "100 g",
    "aisle": "Houdbaar",
    "aliases": [
      "sesam"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "shampoo",
    "name": "Shampoo",
    "brand": null,
    "brandTier": null,
    "pack": "250 ml",
    "aisle": "Huis",
    "aliases": [
      "shampoo"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "shiitake",
    "name": "Shiitake",
    "brand": null,
    "brandTier": "A",
    "pack": "150 g",
    "aisle": "Vers",
    "aliases": [
      "shiitake"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "shoarma",
    "name": "Shoarmavlees",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Koeling",
    "aliases": [
      "shoarma",
      "shoarmareepjes"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "sinaasappel",
    "name": "Sinaasappels",
    "brand": null,
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "sinaasappel",
      "sinaasappels",
      "appelsien"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1547514701-42782126185d?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
  },
  {
    "id": "jus_sinaasappel",
    "name": "Sinaasappelsap",
    "brand": null,
    "brandTier": "B",
    "pack": "1 L",
    "aisle": "Houdbaar",
    "aliases": [
      "sinaasappelsap"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "sjalot",
    "name": "Sjalotten",
    "brand": null,
    "brandTier": "A",
    "pack": "250 g",
    "aisle": "Vers",
    "aliases": [
      "sjalot",
      "sjalotjes"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "room_slag",
    "name": "Slagroom",
    "brand": null,
    "brandTier": "A",
    "pack": "250 ml",
    "aisle": "Koeling",
    "aliases": [
      "slagroom"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "slavink",
    "name": "Slavinken",
    "brand": null,
    "brandTier": "B",
    "pack": "4 stuks",
    "aisle": "Koeling",
    "aliases": [
      "slavink"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "smeerkaas",
    "name": "Smeerkaas",
    "brand": null,
    "brandTier": "B",
    "pack": "150 g",
    "aisle": "Koeling",
    "aliases": [
      "smeerkaas"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "smoothie_groente",
    "name": "Smoothie groente vers",
    "brand": null,
    "brandTier": "A",
    "pack": "500 ml",
    "aisle": "Vers",
    "aliases": [
      "groentesmoothie"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "smoothie_koel",
    "name": "Smoothie koelvers",
    "brand": null,
    "brandTier": "A",
    "pack": "250 ml",
    "aisle": "Koeling",
    "aliases": [
      "verse smoothie"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_smoothie",
    "name": "Smoothiemix diepvries",
    "brand": null,
    "brandTier": "A",
    "pack": "300 g",
    "aisle": "Diepvries",
    "aliases": [
      "smoothie mix"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "snacktomaat",
    "name": "Snacktomaten",
    "brand": null,
    "brandTier": "A",
    "pack": "250 g",
    "aisle": "Vers",
    "aliases": [
      "snacktomaat",
      "trostomaat snack"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "wortel_snack",
    "name": "Snackworteltjes",
    "brand": null,
    "brandTier": "B",
    "pack": "200 g",
    "aisle": "Vers",
    "aliases": [
      "snackpeen",
      "baby carrots"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "snijbonen",
    "name": "Snijbonen",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Vers",
    "aliases": [
      "snijboon"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "sojamelk",
    "name": "Sojamelk",
    "brand": null,
    "brandTier": "B",
    "pack": "1 L",
    "aisle": "Koeling",
    "aliases": [
      "soja drink"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "pasta_spaghetti",
    "name": "Spaghetti",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "spaghetti"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "spekblokjes",
    "name": "Spekblokjes",
    "brand": null,
    "brandTier": "B",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "spekreepjes",
      "baconblokjes",
      "baconreepjes"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1528607929212-2636ec44253e?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "speklappen",
    "name": "Speklappen",
    "brand": null,
    "brandTier": "A",
    "pack": "500 g",
    "aisle": "Koeling",
    "aliases": [
      "speklap",
      "speklapjes",
      "varkensspeklappen"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1432139509613-5c4255815697?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "sperziebonen",
    "name": "Sperziebonen",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Vers",
    "aliases": [
      "sperzieboon",
      "prinsessenbonen"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "spinazie",
    "name": "Spinazie diepvries",
    "brand": null,
    "pack": "450 g",
    "aisle": "Koeling",
    "aliases": [
      "spinazie diepvries",
      "diepvriesspinazie"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
  },
  {
    "id": "spinazie_vers",
    "name": "Spinazie vers",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Vers",
    "aliases": [
      "verse spinazie"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_spinazie_blok",
    "name": "Spinazieblokjes",
    "brand": null,
    "brandTier": "B",
    "pack": "450 g",
    "aisle": "Diepvries",
    "aliases": [
      "spinazieblokjes"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "spitskool",
    "name": "Spitskool",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "spitskool"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "sponsjes",
    "name": "Sponsjes",
    "brand": null,
    "brandTier": null,
    "pack": "6 stuks",
    "aisle": "Huis",
    "aliases": [
      "spons"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "spruitjes",
    "name": "Spruitjes",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "spruiten",
      "brussels sprouts"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1615485290397-4e4f4f8c0c8a?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "stokbrood",
    "name": "Stokbrood",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Houdbaar",
    "aliases": [
      "baguette"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "keukenzout_huis",
    "name": "Strooizout",
    "brand": null,
    "brandTier": null,
    "pack": "1 kg",
    "aisle": "Huis",
    "aliases": [
      "strooizout"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "stroop",
    "name": "Stroop",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "appelstroop"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "stroopwafel",
    "name": "Stroopwafels",
    "brand": null,
    "brandTier": "B",
    "pack": "1 pak",
    "aisle": "Houdbaar",
    "aliases": [
      "stroopwafel"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "suiker",
    "name": "Suiker",
    "brand": null,
    "pack": "1 kg",
    "aisle": "Houdbaar",
    "aliases": [
      "suiker",
      "kristalsuiker"
    ],
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "suikermais_vers",
    "name": "Suikermais",
    "brand": null,
    "brandTier": "B",
    "pack": "2 kolven",
    "aisle": "Vers",
    "aliases": [
      "mais kolf",
      "suikermais"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "sukadelappen",
    "name": "Sukadelappen",
    "brand": null,
    "brandTier": "A",
    "pack": "600 g",
    "aisle": "Koeling",
    "aliases": [
      "sukade",
      "runderlappen",
      "draadjesvlees"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=400&q=60"
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "taco_kruiden",
    "name": "Tacokruiden",
    "brand": null,
    "brandTier": "B",
    "pack": "1 zakje",
    "aisle": "Houdbaar",
    "aliases": [
      "taco"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "pasta_tagliatelle",
    "name": "Tagliatelle",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "tagliatelle"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "tandenpasta",
    "name": "Tandenpasta",
    "brand": null,
    "pack": "75 ml",
    "aisle": "Huis",
    "aliases": [
      "tandenpasta",
      "tandpasta"
    ],
    "stores": null,
    "brandTier": null,
    "img": null
  },
  {
    "id": "tempeh",
    "name": "Tempeh",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "tempeh"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "thee",
    "name": "Thee",
    "brand": null,
    "pack": "20 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "thee",
      "theezakjes"
    ],
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "tijgerbrood",
    "name": "Tijgerbrood",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Houdbaar",
    "aliases": [
      "tijger"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "tijm",
    "name": "Tijm vers",
    "brand": null,
    "brandTier": "A",
    "pack": "1 bos",
    "aisle": "Vers",
    "aliases": [
      "verse tijm"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "tissues",
    "name": "Tissues",
    "brand": null,
    "brandTier": null,
    "pack": "1 doos",
    "aisle": "Huis",
    "aliases": [
      "zakdoekjes"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "toast",
    "name": "Toast",
    "brand": null,
    "brandTier": "B",
    "pack": "1 pak",
    "aisle": "Houdbaar",
    "aliases": [
      "melba toast"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "tofu",
    "name": "Tofu",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "tofu"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": null,
    "img": null
  },
  {
    "id": "toiletreiniger",
    "name": "Toiletreiniger",
    "brand": null,
    "pack": "750 ml",
    "aisle": "Huis",
    "aliases": [
      "wc reiniger",
      "toiletreiniger"
    ],
    "stores": null,
    "brandTier": null,
    "img": null
  },
  {
    "id": "tomaatVers",
    "name": "Tomaat (vers)",
    "brand": null,
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "verse tomaat",
      "tomaten vers",
      "vleestomaat"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
  },
  {
    "id": "tomaten",
    "name": "Tomaten",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "tomaat",
      "vleestomaat"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "img": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
  },
  {
    "id": "tomatenpuree",
    "name": "Tomatenpuree",
    "brand": null,
    "brandTier": "B",
    "pack": "140 g",
    "aisle": "Houdbaar",
    "aliases": [
      "tomatenpuree"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "tonijn",
    "name": "Tonijn blik",
    "brand": null,
    "brandTier": "B",
    "pack": "160 g",
    "aisle": "Houdbaar",
    "aliases": [
      "tonijn",
      "blik tonijn",
      "tuna",
      "tonijn_blik"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "tonijnsteak",
    "name": "Tonijnsteak",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "tonijn steak"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "tortillaChips",
    "name": "Tortillachips",
    "brand": null,
    "pack": "200 g",
    "aisle": "Houdbaar",
    "aliases": [
      "nacho chips",
      "tortillachips",
      "nachos"
    ],
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "trostomaat",
    "name": "Trostomaten",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "trostomaat"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "tunasalade",
    "name": "Tunasalade",
    "brand": null,
    "brandTier": "B",
    "pack": "150 g",
    "aisle": "Koeling",
    "aliases": [
      "tonijnsalade"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "tzatziki",
    "name": "Tzatziki",
    "brand": null,
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [],
    "stores": null,
    "brandTier": null,
    "img": null
  },
  {
    "id": "ui",
    "name": "Uien",
    "brand": null,
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "ui",
      "rode ui"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
  },
  {
    "id": "uienpoeder",
    "name": "Uienpoeder",
    "brand": null,
    "brandTier": "B",
    "pack": "50 g",
    "aisle": "Houdbaar",
    "aliases": [
      "uienpoeder"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "vaatwastabletten",
    "name": "Vaatwastabletten",
    "brand": null,
    "brandTier": null,
    "pack": "30 stuks",
    "aisle": "Huis",
    "aliases": [
      "vaatwas"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kwark_vanille",
    "name": "Vanillekwark",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Koeling",
    "aliases": [
      "vanille kwark"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "vanillesuiker",
    "name": "Vanillesuiker",
    "brand": null,
    "brandTier": "B",
    "pack": "10 zakjes",
    "aisle": "Houdbaar",
    "aliases": [
      "vanillesuiker"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "vla_vanille",
    "name": "Vanillevla",
    "brand": null,
    "brandTier": "B",
    "pack": "1 L",
    "aisle": "Koeling",
    "aliases": [
      "vla",
      "vanillevla"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "varkensgehakt",
    "name": "Varkensgehakt",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Koeling",
    "aliases": [
      "gehakt varken",
      "half-om-half gehakt"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "varkenshaas",
    "name": "Varkenshaas",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "varkenshaas"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "aardappel_vast",
    "name": "Vastkokende aardappelen",
    "brand": null,
    "brandTier": "B",
    "pack": "2 kg",
    "aisle": "Vers",
    "aliases": [
      "vastkokend"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "sla_veldsla",
    "name": "Veldsla",
    "brand": null,
    "brandTier": "A",
    "pack": "100 g",
    "aisle": "Vers",
    "aliases": [
      "veldsla"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "venkel",
    "name": "Venkel",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "venkelknol"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "fruitmix",
    "name": "Vers fruitsalade",
    "brand": null,
    "brandTier": "A",
    "pack": "300 g",
    "aisle": "Vers",
    "aliases": [
      "fruitsalade"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "vers_sap",
    "name": "Vers geperst sap",
    "brand": null,
    "brandTier": "A",
    "pack": "500 ml",
    "aisle": "Koeling",
    "aliases": [
      "vers sap"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "gehaktballen_vers",
    "name": "Verse gehaktballen",
    "brand": null,
    "brandTier": "B",
    "pack": "12 stuks",
    "aisle": "Koeling",
    "aliases": [
      "gehaktbal"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "verse_pasta",
    "name": "Verse pasta",
    "brand": null,
    "brandTier": "A",
    "pack": "250 g",
    "aisle": "Koeling",
    "aliases": [
      "verse tagliatelle"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "boterfolie",
    "name": "Vershoudfolie",
    "brand": null,
    "brandTier": null,
    "pack": "1 rol",
    "aisle": "Huis",
    "aliases": [
      "folie",
      "plasticfolie"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "visaus",
    "name": "Visaus",
    "brand": null,
    "brandTier": "A",
    "pack": "200 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "fish sauce"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "diepvries_vissticks",
    "name": "Vissticks",
    "brand": null,
    "brandTier": "B",
    "pack": "1 doos",
    "aisle": "Diepvries",
    "aliases": [
      "visstick"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "bakboter_vloeibaar",
    "name": "Vloeibare bakboter",
    "brand": null,
    "brandTier": "B",
    "pack": "500 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "bakboter"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kwark_vol",
    "name": "Volle kwark",
    "brand": null,
    "brandTier": "A",
    "pack": "500 g",
    "aisle": "Koeling",
    "aliases": [
      "volle kwark"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "melk_vol",
    "name": "Volle melk",
    "brand": null,
    "brandTier": "B",
    "pack": "1 L",
    "aisle": "Koeling",
    "aliases": [
      "volle melk"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "yoghurt_volle",
    "name": "Volle yoghurt",
    "brand": null,
    "brandTier": "B",
    "pack": "1 L",
    "aisle": "Koeling",
    "aliases": [
      "volle yoghurt"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "hagelslag_vruchten",
    "name": "Vruchtenhagel",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "vruchtenhagel"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "vuilniszakken",
    "name": "Vuilniszakken",
    "brand": null,
    "brandTier": null,
    "pack": "20 stuks",
    "aisle": "Huis",
    "aliases": [
      "vuilniszak"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "walnoten",
    "name": "Walnoten",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Houdbaar",
    "aliases": [
      "walnoot"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "wasmiddel",
    "name": "Wasmiddel",
    "brand": null,
    "pack": "1,5 kg",
    "aisle": "Huis",
    "aliases": [
      "wasmiddel",
      "waspoeder"
    ],
    "stores": null,
    "brandTier": null,
    "img": null
  },
  {
    "id": "wasverzachter",
    "name": "Wasverzachter",
    "brand": null,
    "brandTier": null,
    "pack": "1 L",
    "aisle": "Huis",
    "aliases": [
      "wasverzachter"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "watermeloen",
    "name": "Watermeloen",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "meloen"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "wijnazijn",
    "name": "Wijnazijn",
    "brand": null,
    "brandTier": "B",
    "pack": "500 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "witte wijnazijn"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "winterpeen",
    "name": "Winterpeen",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "winter peen"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "brood_wit",
    "name": "Wit brood",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Houdbaar",
    "aliases": [
      "witbrood"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "witlof",
    "name": "Witlof",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "witloof"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "witte_bonen",
    "name": "Witte bonen",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "witte bonen"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "druif_wit",
    "name": "Witte druiven",
    "brand": null,
    "brandTier": "A",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "witte druiven"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "witte_kool",
    "name": "Witte kool",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "witte kool"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "suiker_wit",
    "name": "Witte suiker",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Houdbaar",
    "aliases": [
      "kristalsuiker"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "ui_wit",
    "name": "Witte uien",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "witte ui"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "wijn_wit",
    "name": "Witte wijn",
    "brand": null,
    "brandTier": "A",
    "pack": "750 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "witte wijn"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "wortel",
    "name": "Wortelen",
    "brand": null,
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "wortel",
      "winterpeen",
      "peen",
      "bospeen"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
  },
  {
    "id": "wrap_kruiden",
    "name": "Wrapkruiden",
    "brand": null,
    "brandTier": "B",
    "pack": "1 zakje",
    "aisle": "Houdbaar",
    "aliases": [
      "wrap kruiden"
    ],
    "stores": null,
    "img": null
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
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "yoghurt",
    "name": "Yoghurt",
    "brand": null,
    "pack": "1 kg",
    "aisle": "Koeling",
    "aliases": [
      "magere yoghurt",
      "volle yoghurt"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=60",
    "brandTier": "A"
  },
  {
    "id": "yoghurtdrink",
    "name": "Yoghurtdrink",
    "brand": null,
    "brandTier": "B",
    "pack": "1 L",
    "aisle": "Koeling",
    "aliases": [
      "yoghurtdrink"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "zalm",
    "name": "Zalmfilet",
    "brand": null,
    "pack": "2 stuks",
    "aisle": "Koeling",
    "aliases": [
      "zalm",
      "zalmfilets"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=60",
    "brandTier": "A"
  },
  {
    "id": "zee_zout",
    "name": "Zeezout",
    "brand": null,
    "brandTier": "A",
    "pack": "250 g",
    "aisle": "Houdbaar",
    "aliases": [
      "zeezout"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "zelfrijzend",
    "name": "Zelfrijzend bakmeel",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Houdbaar",
    "aliases": [
      "zelfrijzend"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "rijst_zilver",
    "name": "Zilvervliesrijst",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Houdbaar",
    "aliases": [
      "zilvervlies"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "zoete_aardappel",
    "name": "Zoete aardappel",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "zoete aardappelen",
      "bataat",
      "sweet potato"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "zoete_puntpaprika",
    "name": "Zoete puntpaprika",
    "brand": null,
    "brandTier": "A",
    "pack": "3 stuks",
    "aisle": "Vers",
    "aliases": [
      "zoete paprika"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "zongedroogde_tomaat",
    "name": "Zongedroogde tomaten",
    "brand": null,
    "brandTier": "A",
    "pack": "280 g",
    "aisle": "Houdbaar",
    "aliases": [
      "zongedroogde tomaat"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "zonnebloemolie",
    "name": "Zonnebloemolie",
    "brand": null,
    "brandTier": "B",
    "pack": "1 L",
    "aisle": "Houdbaar",
    "aliases": [
      "zonnebloemolie"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "zonnebloempitten",
    "name": "Zonnebloempitten",
    "brand": null,
    "brandTier": "B",
    "pack": "200 g",
    "aisle": "Houdbaar",
    "aliases": [
      "zonnebloempit"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "zout",
    "name": "Zout",
    "brand": null,
    "pack": "1 kg",
    "aisle": "Houdbaar",
    "aliases": [
      "zout",
      "keukenzout"
    ],
    "stores": null,
    "brandTier": "B",
    "img": null
  },
  {
    "id": "zure_room",
    "name": "Zure room",
    "brand": null,
    "brandTier": "B",
    "pack": "150 ml",
    "aisle": "Koeling",
    "aliases": [
      "sour cream"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "peper_zwart",
    "name": "Zwarte peper",
    "brand": null,
    "brandTier": "B",
    "pack": "50 g",
    "aisle": "Houdbaar",
    "aliases": [
      "zwarte peper",
      "peper"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "thee_zwart",
    "name": "Zwarte thee",
    "brand": null,
    "brandTier": "B",
    "pack": "20 zakjes",
    "aisle": "Houdbaar",
    "aliases": [
      "thee"
    ],
    "stores": null,
    "img": null
  }
];

  var EXTRA_KEY = "weate.products.extra";
  var _byId = {};
  var _list = [];
  var _hay = [];

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
      _byId[p.id] = Object.assign({}, p, {
        aliases: (p.aliases || []).slice(),
        brandTier: p.brandTier || null,
        img: p.img || null,
        _seed: true
      });
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
        if (p.brandTier != null) cur.brandTier = p.brandTier;
        if (p.img != null) cur.img = p.img;
        if (p.aisle) cur.aisle = p.aisle;
        if (p.stores) cur.stores = p.stores;
      } else {
        _byId[p.id] = Object.assign({}, p, {
          aliases: (p.aliases || []).slice(),
          brandTier: p.brandTier || null,
          img: p.img || null,
          _seed: false
        });
      }
    });
    _list = Object.keys(_byId).map(function (k) { return _byId[k]; });
    _list.sort(function (a, b) {
      return String(a.name || "").localeCompare(String(b.name || ""), "nl");
    });
    _hay = _list.map(function (prod) {
      return {
        p: prod,
        name: norm(prod.name),
        id: norm(prod.id),
        aliases: (prod.aliases || []).map(function (a) { return norm(a); })
      };
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
    /* Typeahead-only: no default list when the field is empty. */
    if (!q) return [];
    var scored = [];
    for (var i = 0; i < _hay.length; i++) {
      var h = _hay[i];
      var score = 0;
      if (h.name === q || h.id === q) score = 100;
      else if (h.name.indexOf(q) === 0) score = 80;
      else if (h.name.indexOf(q) >= 0) score = 50;
      for (var a = 0; a < h.aliases.length; a++) {
        var al = h.aliases[a];
        if (al === q) score = score < 90 ? 90 : score;
        else if (al.indexOf(q) === 0) score = score < 70 ? 70 : score;
        else if (al.indexOf(q) >= 0) score = score < 40 ? 40 : score;
      }
      if (score) scored.push({ p: h.p, score: score });
    }
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
    var brandTier = input.brandTier != null ? input.brandTier : (existing && existing.brandTier) || null;
    if (brandTier === "huismerk") brandTier = "B";
    var img = input.img != null ? input.img : (existing && existing.img) || null;
    var product = {
      id: id,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      brand: brand,
      brandTier: brandTier,
      pack: pack,
      aisle: aisle,
      aliases: Object.keys(aliases).filter(function (k) { return k && k !== norm(name); }).map(function (k) { return aliases[k]; }),
      stores: input.stores || (existing && existing.stores) || null,
      img: img
    };
    var extras = loadExtras().filter(function (p) { return p && p.id !== id; });
    extras.push(product);
    saveExtras(extras);
    indexAll();
    try { syncIntoCat(); } catch (e) {}
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
    if (!p) return { brand: "", pack: "", aisle: "", brandTier: "", img: "" };
    var tier = p.brandTier || "";
    if (tier === "huismerk") tier = "B";
    return {
      brand: p.brand || "",
      pack: p.pack || "",
      aisle: p.aisle || "",
      brandTier: tier,
      img: p.img || ""
    };
  }

  /** Parse pack like "1 kg" / "500g" / "3-pack" into base+unit for CAT. */
  function packToBase(pack) {
    var s = String(pack || "").trim().toLowerCase().replace(",", ".");
    var m = s.match(/^(\d+(?:\.\d+)?)\s*(kg|g|ml|cl|l|liter|stuks?|st|teen|tenen|bos)?$/i);
    if (m) {
      var amt = parseFloat(m[1]);
      var u = (m[2] || "x").toLowerCase();
      if (u === "liter") u = "l";
      if (u === "st" || u === "stuk") u = "stuks";
      if (u === "teen") u = "teen";
      return { base: amt, unit: u };
    }
    var m2 = s.match(/^(\d+)\s*-?\s*pack$/i);
    if (m2) return { base: +m2[1], unit: "stuks" };
    return null;
  }

  /**
   * Inject catalog products into global CAT so compose/list keep specific ids
   * (e.g. krieltjes) instead of collapsing to a parent category.
   * Existing recipe CAT entries keep price/diet fields; we only enrich label/pack/img.
   */
  function syncIntoCat() {
    if (typeof CAT === "undefined" || typeof P !== "function") return 0;
    var n = 0;
    _list.forEach(function (p) {
      if (!p || !p.id) return;
      var bu = packToBase(p.pack);
      var tier = p.brandTier || null;
      if (tier === "huismerk") tier = "B";
      if (CAT[p.id]) {
        var cur = CAT[p.id];
        if (p.name) {
          cur.label = p.name;
          /* Keep specific display name; do not rewrite to parent. */
        }
        if (p.pack && bu) {
          if (cur.base == null) cur.base = bu.base;
          if (!cur.unit) cur.unit = bu.unit;
        }
        if (p.img) cur.img = p.img;
        if (tier) cur.brandTier = tier;
        if (p.aisle && !cur.aisle) cur.aisle = p.aisle;
        n++;
        return;
      }
      var extra = { label: p.name };
      if (bu) { extra.base = bu.base; extra.unit = bu.unit; }
      if (p.img) extra.img = p.img;
      if (tier) extra.brandTier = tier;
      var cents = 149;
      if (p.aisle === "Koeling") cents = 299;
      if (p.aisle === "Vers") cents = 199;
      if (p.aisle === "Houdbaar") cents = 129;
      if (p.aisle === "Diepvries") cents = 249;
      CAT[p.id] = P(p.name + (p.pack ? " " + p.pack : ""), p.aisle || "Huis", cents, extra);
      n++;
    });
    return n;
  }

  indexAll();
  try { syncIntoCat(); } catch (e) {}

  window.WeAteProducts = {
    all: all,
    get: get,
    search: search,
    findByName: findByName,
    upsert: upsert,
    aliasesFor: aliasesFor,
    preferLabel: preferLabel,
    preferMeta: preferMeta,
    syncIntoCat: syncIntoCat,
    reload: function () { indexAll(); try { syncIntoCat(); } catch (e) {} },
    seedSize: function () { return SEED.length; },
    size: function () { return _list.length; }
  };
})();
