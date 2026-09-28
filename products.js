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
    "stores": null,
    "img": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=400&q=60",
    "brandTier": "A"
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
    "stores": null,
    "img": "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=60",
    "brandTier": "A"
  },
  {
    "id": "hummus",
    "name": "Hummus",
    "brand": null,
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "hummus",
      "hoemoes"
    ],
    "stores": null,
    "brandTier": null,
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
      "kropsla"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
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
    "id": "komkommer",
    "name": "Komkommer",
    "brand": null,
    "pack": "1 stuks",
    "aisle": "Vers",
    "aliases": [],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
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
      "gemengd gehakt"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=60",
    "brandTier": "A"
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
    "id": "tonijn",
    "name": "Tonijn blik",
    "brand": null,
    "brandTier": "B",
    "pack": "160 g",
    "aisle": "Houdbaar",
    "aliases": [
      "tonijn",
      "blik tonijn",
      "tuna"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=60"
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
      "winterpeen"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=60",
    "brandTier": "B"
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
    "id": "zalm",
    "name": "Zalmfilet",
    "brand": null,
    "pack": "2 stuks",
    "aisle": "Koeling",
    "aliases": [
      "zalm"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=60",
    "brandTier": "A"
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
