/* WeAte eigen productcatalogus — géén volledige AH/Jumbo-assortiment-scrape.
   Seed: NL boodschappen-staples (vers, zuivel, vlees/vis, voorraad, diepvries, bakkerij, huis).
   Aliases voeden Actie-matching (strict whole-word, zie folder.js).
   Free-text toevoegen upsert naar localStorage (weate.products.extra).
   Zoeken is typeahead-only: lege query → geen resultaten. */
(function () {
  "use strict";

  var SEED = [
  {
    "id": "bbq_aanmaakblokjes",
    "name": "Aanmaakblokjes",
    "brand": null,
    "brandTier": null,
    "pack": "1 stuk",
    "aisle": "Huis",
    "aliases": [
      "aanmaakblokjes"
    ],
    "stores": null,
    "img": "img/products/bbq_aanmaakblokjes.png"
  },
  {
    "id": "aardappel",
    "name": "Aardappelen",
    "brand": null,
    "brandTier": "B",
    "pack": "3 kg",
    "aisle": "Vers",
    "aliases": [
      "aardappel"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "dv_aardappelpuree",
    "name": "Aardappelpuree diepvries",
    "brand": null,
    "brandTier": "B",
    "pack": "450 g",
    "aisle": "Diepvries",
    "aliases": [
      "diepvries puree",
      "aardappelpuree dv"
    ],
    "stores": null,
    "img": "img/products/dv_aardappelpuree.png"
  },
  {
    "id": "aardappelsalade",
    "name": "Aardappelsalade",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "aardappelsalade"
    ],
    "stores": null,
    "img": "img/products/aardappelsalade.png"
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
    "id": "jam_abrikoos",
    "name": "Abrikozenjam",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "abrikozenjam",
      "jam abrikoos"
    ],
    "stores": null,
    "img": "img/products/jam_abrikoos.png"
  },
  {
    "id": "ham",
    "name": "Achterham",
    "brand": null,
    "brandTier": "A",
    "pack": "150 g",
    "aisle": "Koeling",
    "aliases": [
      "ham",
      "beenham"
    ],
    "stores": null,
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
    "brandTier": null,
    "pack": "1 L",
    "aisle": "Huis",
    "aliases": [
      "afwas",
      "afwasmiddel"
    ],
    "stores": null,
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
    "id": "appelchips",
    "name": "Appelchips",
    "brand": null,
    "brandTier": "A",
    "pack": "50 g",
    "aisle": "Houdbaar",
    "aliases": [
      "appelchips"
    ],
    "stores": null,
    "img": "img/products/appelchips.png"
  },
  {
    "id": "appelmoes_pot",
    "name": "Appelmoes",
    "brand": null,
    "brandTier": "B",
    "pack": "710 g",
    "aisle": "Houdbaar",
    "aliases": [
      "appelmoes"
    ],
    "stores": null,
    "img": "img/products/appelmoes_pot.png"
  },
  {
    "id": "appel",
    "name": "Appels",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "appel",
      "appels"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "fruitsap_appel",
    "name": "Appelsap",
    "brand": null,
    "brandTier": "B",
    "pack": "1 l",
    "aisle": "Houdbaar",
    "aliases": [
      "appelsap"
    ],
    "stores": null,
    "img": "img/products/fruitsap_appel.png"
  },
  {
    "id": "stroop_appel",
    "name": "Appelstroop",
    "brand": null,
    "brandTier": "B",
    "pack": "450 g",
    "aisle": "Houdbaar",
    "aliases": [
      "appelstroop"
    ],
    "stores": null,
    "img": "img/products/stroop_appel.png"
  },
  {
    "id": "artisjok",
    "name": "Artisjokharten pot",
    "brand": null,
    "brandTier": "B",
    "pack": "390 g",
    "aisle": "Houdbaar",
    "aliases": [
      "artisjok",
      "artisjokharten"
    ],
    "stores": null,
    "img": "img/products/artisjok.png"
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
    "brandTier": "B",
    "pack": "1 L",
    "aisle": "Houdbaar",
    "aliases": [
      "azijn",
      "natuurazijn"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "babybel",
    "name": "Babybel kaasjes",
    "brand": null,
    "brandTier": "A",
    "pack": "6 stuks",
    "aisle": "Koeling",
    "aliases": [
      "babybel",
      "mini kaasjes"
    ],
    "stores": null,
    "img": "img/products/babybel.png"
  },
  {
    "id": "paksoi_baby",
    "name": "Babypaksoi",
    "brand": null,
    "brandTier": "B",
    "pack": "200 g",
    "aisle": "Vers",
    "aliases": [
      "babypaksoi",
      "baby paksoi"
    ],
    "stores": null,
    "img": "img/products/paksoi_baby.png"
  },
  {
    "id": "spinazie_baby",
    "name": "Babyspinazie",
    "brand": null,
    "brandTier": "A",
    "pack": "150 g",
    "aisle": "Vers",
    "aliases": [
      "babyspinazie",
      "baby spinazie"
    ],
    "stores": null,
    "img": "img/products/spinazie_baby.png"
  },
  {
    "id": "bacon",
    "name": "Bacon",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "bacon",
      "ontbijtspek strips"
    ],
    "stores": null,
    "img": "img/products/bacon.png"
  },
  {
    "id": "bagel",
    "name": "Bagels",
    "brand": null,
    "brandTier": "A",
    "pack": "4 stuks",
    "aisle": "Vers",
    "aliases": [
      "bagel",
      "bagels"
    ],
    "stores": null,
    "img": "img/products/bagel.png"
  },
  {
    "id": "bakkerszout",
    "name": "Bakkerszout",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "bakkerszout"
    ],
    "stores": null,
    "img": "img/products/bakkerszout.png"
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
    "id": "bakpoeder_extra",
    "name": "Bakpoeder 5-pack",
    "brand": null,
    "brandTier": "B",
    "pack": "5 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "bakpoeder pack"
    ],
    "stores": null,
    "img": "img/products/bakpoeder_extra.png"
  },
  {
    "id": "bakworst",
    "name": "Bakworst",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "bakworst",
      "verse worst"
    ],
    "stores": null,
    "img": "img/products/bakworst.png"
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
    "id": "bami_mix_pak",
    "name": "Bamikruiden pak",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Houdbaar",
    "aliases": [
      "bamikruiden pak",
      "bami mix"
    ],
    "stores": null,
    "img": "img/products/bami_mix_pak.png"
  },
  {
    "id": "dv_bami",
    "name": "Bamischotel diepvries",
    "brand": null,
    "brandTier": "B",
    "pack": "450 g",
    "aisle": "Diepvries",
    "aliases": [
      "diepvries bami",
      "bamischotel"
    ],
    "stores": null,
    "img": "img/products/dv_bami.png"
  },
  {
    "id": "fruit",
    "name": "Bananen",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuks",
    "aisle": "Vers",
    "aliases": [
      "fruit",
      "trossen bananen",
      "banaan",
      "tros bananen"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "barbecuesaus",
    "name": "Barbecuesaus",
    "brand": null,
    "brandTier": "B",
    "pack": "300 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "bbq saus",
      "barbecuesaus",
      "barbecue saus"
    ],
    "stores": null,
    "img": "img/products/barbecuesaus.png"
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
    "id": "basilicum_pot",
    "name": "Basilicum potje",
    "brand": null,
    "brandTier": "A",
    "pack": "1 pot",
    "aisle": "Vers",
    "aliases": [
      "basilicum pot",
      "verse basilicum pot"
    ],
    "stores": null,
    "img": "img/products/basilicum_pot.png"
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
    "id": "suiker_bruine",
    "name": "Basterdsuiker bruin",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "bruine basterdsuiker"
    ],
    "stores": null,
    "img": "img/products/suiker_bruine.png"
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
    "id": "bbq_kruiden",
    "name": "BBQ-kruiden",
    "brand": null,
    "brandTier": "B",
    "pack": "40 g",
    "aisle": "Houdbaar",
    "aliases": [
      "bbq kruiden",
      "grillkruiden"
    ],
    "stores": null,
    "img": "img/products/bbq_kruiden.png"
  },
  {
    "id": "marinade_bbq",
    "name": "BBQ-marinade",
    "brand": null,
    "brandTier": "A",
    "pack": "250 ml",
    "aisle": "Koeling",
    "aliases": [
      "bbq marinade",
      "marinade bbq"
    ],
    "stores": null,
    "img": "img/products/marinade_bbq.png"
  },
  {
    "id": "bbq_worst",
    "name": "BBQ-worst",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "bbq worst",
      "grillworst"
    ],
    "stores": null,
    "img": "img/products/bbq_worst.png"
  },
  {
    "id": "bearnaise",
    "name": "Béarnaisesaus",
    "brand": null,
    "brandTier": "A",
    "pack": "200 ml",
    "aisle": "Koeling",
    "aliases": [
      "bearnaise",
      "béarnaise"
    ],
    "stores": null,
    "img": "img/products/bearnaise.png"
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
    "id": "bieslook_pot",
    "name": "Bieslook potje",
    "brand": null,
    "brandTier": "A",
    "pack": "1 pot",
    "aisle": "Vers",
    "aliases": [
      "bieslook pot"
    ],
    "stores": null,
    "img": "img/products/bieslook_pot.png"
  },
  {
    "id": "cornflakes_bio",
    "name": "Biologische cornflakes",
    "brand": null,
    "brandTier": "A",
    "pack": "375 g",
    "aisle": "Houdbaar",
    "aliases": [
      "bio cornflakes"
    ],
    "stores": null,
    "img": "img/products/cornflakes_bio.png"
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
    "id": "eieren_bio_6",
    "name": "Biologische eieren 6-pack",
    "brand": null,
    "brandTier": "A",
    "pack": "6 stuks",
    "aisle": "Koeling",
    "aliases": [
      "bio eieren 6"
    ],
    "stores": null,
    "img": "img/products/eieren_bio_6.png"
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
    "id": "dv_bitterballen",
    "name": "Bitterballen diepvries",
    "brand": null,
    "brandTier": "B",
    "pack": "20 stuks",
    "aisle": "Diepvries",
    "aliases": [
      "diepvries bitterballen"
    ],
    "stores": null,
    "img": "img/products/dv_bitterballen.png"
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
    "id": "dv_spinazie_blad",
    "name": "Bladspinazie diepvries",
    "brand": null,
    "brandTier": "B",
    "pack": "450 g",
    "aisle": "Diepvries",
    "aliases": [
      "bladspinazie diepvries"
    ],
    "stores": null,
    "img": "img/products/dv_spinazie_blad.png"
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
    "id": "blauwe_bes_bak",
    "name": "Blauwe bessen bak",
    "brand": null,
    "brandTier": "A",
    "pack": "125 g",
    "aisle": "Vers",
    "aliases": [
      "blauwe bessen bak"
    ],
    "stores": null,
    "img": "img/products/blauwe_bes_bak.png"
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
    "id": "bleekselderij_stelen",
    "name": "Bleekselderij stelen",
    "brand": null,
    "brandTier": "B",
    "pack": "1 bos",
    "aisle": "Vers",
    "aliases": [
      "bleekselderij bos"
    ],
    "stores": null,
    "img": "img/products/bleekselderij_stelen.png"
  },
  {
    "id": "bloem",
    "name": "Bloem",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Houdbaar",
    "aliases": [
      "tarwebloem"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "bloemkool",
    "name": "Bloemkool",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1568584711075-3d9217c3f9af?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "boerenkool_vers_bos",
    "name": "Boerenkool bos",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "boerenkool bos"
    ],
    "stores": null,
    "img": "img/products/boerenkool_vers_bos.png"
  },
  {
    "id": "boerenkool",
    "name": "Boerenkool gesneden",
    "brand": null,
    "brandTier": "B",
    "pack": "500g",
    "aisle": "Vers",
    "aliases": [
      "boerenkool"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1459411550239-aeb811961755?auto=format&fit=crop&w=400&q=60"
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
    "id": "zoutjes_borrel",
    "name": "Borrelnootjes",
    "brand": null,
    "brandTier": "B",
    "pack": "200 g",
    "aisle": "Houdbaar",
    "aliases": [
      "borrelnootjes",
      "borrel noten"
    ],
    "stores": null,
    "img": "img/products/zoutjes_borrel.png"
  },
  {
    "id": "bospeen",
    "name": "Bospeen",
    "brand": null,
    "brandTier": "B",
    "pack": "1 bos",
    "aisle": "Vers",
    "aliases": [
      "bospeen",
      "jonge wortelen"
    ],
    "stores": null,
    "img": "img/products/bospeen.png"
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
    "id": "dv_bladerdeeg_boter",
    "name": "Boterbladerdeeg diepvries",
    "brand": null,
    "brandTier": "A",
    "pack": "10 platen",
    "aisle": "Diepvries",
    "aliases": [
      "boterbladerdeeg"
    ],
    "stores": null,
    "img": "img/products/dv_bladerdeeg_boter.png"
  },
  {
    "id": "croissant_boter",
    "name": "Botercroissants",
    "brand": null,
    "brandTier": "A",
    "pack": "4 stuks",
    "aisle": "Vers",
    "aliases": [
      "botercroissant",
      "botercroissants"
    ],
    "stores": null,
    "img": "img/products/croissant_boter.png"
  },
  {
    "id": "boterhamworst",
    "name": "Boterhamworst",
    "brand": null,
    "brandTier": null,
    "pack": "150 g",
    "aisle": "Koeling",
    "aliases": [
      "boterhamworst"
    ],
    "stores": null,
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
    "brandTier": "A",
    "pack": "600g",
    "aisle": "Koeling",
    "aliases": [
      "braadvlees",
      "braadlappen",
      "slavink",
      "slavinkjes"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=400&q=60"
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
    "id": "bratwurst",
    "name": "Bratwurst",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "bratwurst"
    ],
    "stores": null,
    "img": "img/products/bratwurst.png"
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
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "broccoli"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "dv_broccoli_roosjes",
    "name": "Broccoliroosjes diepvries",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Diepvries",
    "aliases": [
      "diepvries broccoli roosjes"
    ],
    "stores": null,
    "img": "img/products/dv_broccoli_roosjes.png"
  },
  {
    "id": "brood",
    "name": "Brood",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "heel brood",
      "sneetjes brood"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=60"
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
    "id": "bolletjes_bruin",
    "name": "Bruine bolletjes",
    "brand": null,
    "brandTier": "B",
    "pack": "6 stuks",
    "aisle": "Vers",
    "aliases": [
      "bruine bolletjes"
    ],
    "stores": null,
    "img": "img/products/bolletjes_bruin.png"
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
    "id": "bonen_bruine_blik",
    "name": "Bruine bonen blik",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "bruine bonen blik"
    ],
    "stores": null,
    "img": "img/products/bonen_bruine_blik.png"
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
    "id": "caesar_dressing",
    "name": "Caesar dressing",
    "brand": null,
    "brandTier": "A",
    "pack": "250 ml",
    "aisle": "Koeling",
    "aliases": [
      "caesar dressing",
      "caesar"
    ],
    "stores": null,
    "img": "img/products/caesar_dressing.png"
  },
  {
    "id": "calamari",
    "name": "Calamariringen",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Diepvries",
    "aliases": [
      "calamari",
      "inktvisringen"
    ],
    "stores": null,
    "img": "img/products/calamari.png"
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
    "id": "meloen_cantaloupe",
    "name": "Cantaloupemeloen",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "cantaloupe",
      "netmeloen"
    ],
    "stores": null,
    "img": "img/products/meloen_cantaloupe.png"
  },
  {
    "id": "carpaccio",
    "name": "Carpaccio",
    "brand": null,
    "brandTier": "A",
    "pack": "100 g",
    "aisle": "Koeling",
    "aliases": [
      "carpaccio"
    ],
    "stores": null,
    "img": "img/products/carpaccio.png"
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
    "id": "cayennepeper",
    "name": "Cayennepeper",
    "brand": null,
    "brandTier": "B",
    "pack": "40 g",
    "aisle": "Houdbaar",
    "aliases": [
      "cayenne",
      "cayennepeper"
    ],
    "stores": null,
    "img": "img/products/cayennepeper.png"
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
    "brandTier": "B",
    "pack": "250g",
    "aisle": "Vers",
    "aliases": [
      "champignon"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1504545102780-26774c1bb073?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "cheddar",
    "name": "Cheddar geraspt",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "cheddar",
      "cheddar geraspt"
    ],
    "stores": null,
    "img": "img/products/cheddar.png"
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
    "id": "chilisaus",
    "name": "Chilisaus",
    "brand": null,
    "brandTier": "B",
    "pack": "300 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "chilisaus",
      "chili saus"
    ],
    "stores": null,
    "img": "img/products/chilisaus.png"
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
    "brandTier": "B",
    "pack": "200 g",
    "aisle": "Houdbaar",
    "aliases": [
      "chips",
      "aardappelchips"
    ],
    "stores": null,
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
    "id": "rijstwafel_choco",
    "name": "Choco rijstwafels",
    "brand": null,
    "brandTier": "B",
    "pack": "100 g",
    "aisle": "Houdbaar",
    "aliases": [
      "choco rijstwafels"
    ],
    "stores": null,
    "img": "img/products/rijstwafel_choco.png"
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
    "id": "chocolademelk_pak",
    "name": "Chocolademelk pakjes",
    "brand": null,
    "brandTier": "B",
    "pack": "6 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "chocolademelk pakjes"
    ],
    "stores": null,
    "img": "img/products/chocolademelk_pak.png"
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
    "id": "ciabatta",
    "name": "Ciabatta",
    "brand": null,
    "brandTier": "A",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "ciabatta"
    ],
    "stores": null,
    "img": "img/products/ciabatta.png"
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
    "id": "citroen_net",
    "name": "Citroenen net",
    "brand": null,
    "brandTier": "B",
    "pack": "4 stuks",
    "aisle": "Vers",
    "aliases": [
      "citroenen net"
    ],
    "stores": null,
    "img": "img/products/citroen_net.png"
  },
  {
    "id": "cocktailsaus",
    "name": "Cocktailsaus",
    "brand": null,
    "brandTier": "B",
    "pack": "250 ml",
    "aisle": "Koeling",
    "aliases": [
      "cocktailsaus"
    ],
    "stores": null,
    "img": "img/products/cocktailsaus.png"
  },
  {
    "id": "worstjes_cocktail",
    "name": "Cocktailworstjes",
    "brand": null,
    "brandTier": "B",
    "pack": "250 g",
    "aisle": "Koeling",
    "aliases": [
      "cocktailworstjes",
      "cocktail worstjes"
    ],
    "stores": null,
    "img": "img/products/worstjes_cocktail.png"
  },
  {
    "id": "cola",
    "name": "Cola",
    "brand": null,
    "brandTier": "B",
    "pack": "1,5L",
    "aisle": "Houdbaar",
    "aliases": [
      "cola"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "peer_conference",
    "name": "Conference peren",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "conference",
      "conference peren"
    ],
    "stores": null,
    "img": "img/products/peer_conference.png"
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
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "courgette"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&w=400&q=60"
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
    "id": "cranberrycompote",
    "name": "Cranberrycompote",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Houdbaar",
    "aliases": [
      "cranberrycompote",
      "cranberry"
    ],
    "stores": null,
    "img": "img/products/cranberrycompote.png"
  },
  {
    "id": "room",
    "name": "Crème fraîche",
    "brand": null,
    "brandTier": "A",
    "pack": "125g",
    "aisle": "Koeling",
    "aliases": [
      "room",
      "creme fraiche"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "creme_fraiche_light",
    "name": "Crème fraîche light",
    "brand": null,
    "brandTier": "A",
    "pack": "125 ml",
    "aisle": "Koeling",
    "aliases": [
      "creme fraiche light"
    ],
    "stores": null,
    "img": "img/products/creme_fraiche_light.png"
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
    "id": "croutons",
    "name": "Croutons",
    "brand": null,
    "brandTier": "B",
    "pack": "100 g",
    "aisle": "Houdbaar",
    "aliases": [
      "croutons"
    ],
    "stores": null,
    "img": "img/products/croutons.png"
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
    "id": "currysaus_fles",
    "name": "Currysaus fles",
    "brand": null,
    "brandTier": "B",
    "pack": "500 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "currysaus fles"
    ],
    "stores": null,
    "img": "img/products/currysaus_fles.png"
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
    "id": "mosterd_dijon",
    "name": "Dijonmosterd",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Houdbaar",
    "aliases": [
      "dijon",
      "dijonmosterd"
    ],
    "stores": null,
    "img": "img/products/mosterd_dijon.png"
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
    "id": "dv_doperwten_wortel",
    "name": "Doperwten-wortel diepvries",
    "brand": null,
    "brandTier": "B",
    "pack": "450 g",
    "aisle": "Diepvries",
    "aliases": [
      "doperwten wortel diepvries"
    ],
    "stores": null,
    "img": "img/products/dv_doperwten_wortel.png"
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
    "id": "dragon",
    "name": "Dragon vers",
    "brand": null,
    "brandTier": "A",
    "pack": "1 bos",
    "aisle": "Vers",
    "aliases": [
      "dragon",
      "verse dragon"
    ],
    "stores": null,
    "img": "img/products/dragon.png"
  },
  {
    "id": "gist_droog",
    "name": "Droge gist",
    "brand": null,
    "brandTier": "B",
    "pack": "3 zakjes",
    "aisle": "Houdbaar",
    "aliases": [
      "droge gist",
      "instant gist"
    ],
    "stores": null,
    "img": "img/products/gist_droog.png"
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
    "id": "chocoladepasta_duo",
    "name": "Duo chocoladepasta",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "duo pasta",
      "duo chocoladepasta"
    ],
    "stores": null,
    "img": "img/products/chocoladepasta_duo.png"
  },
  {
    "id": "edammer",
    "name": "Edammer kaas",
    "brand": null,
    "brandTier": "B",
    "pack": "300 g",
    "aisle": "Koeling",
    "aliases": [
      "edammer",
      "edam"
    ],
    "stores": null,
    "img": "img/products/edammer.png"
  },
  {
    "id": "ei",
    "name": "Eieren",
    "brand": null,
    "brandTier": null,
    "pack": "10 stuks",
    "aisle": "Koeling",
    "aliases": [
      "ei",
      "doos eieren 10",
      "scharreleieren"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "noedels_ei",
    "name": "Eiernoedels",
    "brand": null,
    "brandTier": "B",
    "pack": "250 g",
    "aisle": "Houdbaar",
    "aliases": [
      "eiernoedels"
    ],
    "stores": null,
    "img": "img/products/noedels_ei.png"
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
    "id": "appel_elstar_los",
    "name": "Elstar appels los",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "elstar los"
    ],
    "stores": null,
    "img": "img/products/appel_elstar_los.png"
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
    "id": "fenegriek",
    "name": "Fenegriek",
    "brand": null,
    "brandTier": "B",
    "pack": "30 g",
    "aisle": "Houdbaar",
    "aliases": [
      "fenegriek"
    ],
    "stores": null,
    "img": "img/products/fenegriek.png"
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
    "id": "feta_blok",
    "name": "Feta blok",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "feta blok"
    ],
    "stores": null,
    "img": "img/products/feta_blok.png"
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
    "id": "focaccia",
    "name": "Focaccia",
    "brand": null,
    "brandTier": "A",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "focaccia"
    ],
    "stores": null,
    "img": "img/products/focaccia.png"
  },
  {
    "id": "forel",
    "name": "Forelfilet",
    "brand": null,
    "brandTier": "A",
    "pack": "2 stuks",
    "aisle": "Koeling",
    "aliases": [
      "forel",
      "forelfilet"
    ],
    "stores": null,
    "img": "img/products/forel.png"
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
    "id": "framboos_vers",
    "name": "Frambozen vers",
    "brand": null,
    "brandTier": "A",
    "pack": "125 g",
    "aisle": "Vers",
    "aliases": [
      "frambozen vers"
    ],
    "stores": null,
    "img": "img/products/framboos_vers.png"
  },
  {
    "id": "fricandeau",
    "name": "Fricandeau",
    "brand": null,
    "brandTier": "A",
    "pack": "500 g",
    "aisle": "Koeling",
    "aliases": [
      "fricandeau"
    ],
    "stores": null,
    "img": "img/products/fricandeau.png"
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
    "id": "fritessaus",
    "name": "Fritessaus",
    "brand": null,
    "brandTier": "B",
    "pack": "350 ml",
    "aisle": "Koeling",
    "aliases": [
      "fritessaus",
      "frietsaus"
    ],
    "stores": null,
    "img": "img/products/fritessaus.png"
  },
  {
    "id": "fruitblik_kids",
    "name": "Fruit op siroop cupjes",
    "brand": null,
    "brandTier": "B",
    "pack": "4 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "fruitcupjes",
      "fruit op siroop"
    ],
    "stores": null,
    "img": "img/products/fruitblik_kids.png"
  },
  {
    "id": "dv_fruitmix",
    "name": "Fruitmix diepvries",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Diepvries",
    "aliases": [
      "diepvries fruit",
      "fruitmix diepvries"
    ],
    "stores": null,
    "img": "img/products/dv_fruitmix.png"
  },
  {
    "id": "fruitreep",
    "name": "Fruitrepen",
    "brand": null,
    "brandTier": "A",
    "pack": "6 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "fruitreep",
      "fruitrepen"
    ],
    "stores": null,
    "img": "img/products/fruitreep.png"
  },
  {
    "id": "fruitsap",
    "name": "Fruitsap",
    "brand": null,
    "brandTier": null,
    "pack": "1L",
    "aisle": "Koeling",
    "aliases": [
      "sinaasappelsap",
      "fruitsap"
    ],
    "stores": null,
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
    "brandTier": "A",
    "pack": "200g",
    "aisle": "Koeling",
    "aliases": [
      "garnaal"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "gehaktstaaf",
    "name": "Gehaktstaaf",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Koeling",
    "aliases": [
      "gehaktstaaf"
    ],
    "stores": null,
    "img": "img/products/gehaktstaaf.png"
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
    "id": "rode_biet_gekookt",
    "name": "Gekookte rode bieten",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Koeling",
    "aliases": [
      "gekookte bieten",
      "rode bieten gekookt"
    ],
    "stores": null,
    "img": "img/products/rode_biet_gekookt.png"
  },
  {
    "id": "cherry_geel",
    "name": "Gele cherrytomaten",
    "brand": null,
    "brandTier": "B",
    "pack": "250 g",
    "aisle": "Vers",
    "aliases": [
      "gele cherrytomaten"
    ],
    "stores": null,
    "img": "img/products/cherry_geel.png"
  },
  {
    "id": "courgette_geel",
    "name": "Gele courgette",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "gele courgette"
    ],
    "stores": null,
    "img": "img/products/courgette_geel.png"
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
    "id": "komijn_gemalen",
    "name": "Gemalen komijn",
    "brand": null,
    "brandTier": "B",
    "pack": "40 g",
    "aisle": "Houdbaar",
    "aliases": [
      "gemalen komijn",
      "komijn gemalen"
    ],
    "stores": null,
    "img": "img/products/komijn_gemalen.png"
  },
  {
    "id": "gember",
    "name": "Gember",
    "brand": null,
    "brandTier": "B",
    "pack": "50 g",
    "aisle": "Vers",
    "aliases": [
      "verse gember"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "gehakt_gemengd",
    "name": "Gemengd gehakt",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Koeling",
    "aliases": [
      "gemengd gehakt",
      "gehakt gemengd"
    ],
    "stores": null,
    "img": "img/products/gehakt_gemengd.png"
  },
  {
    "id": "sla_gemengd",
    "name": "Gemengde sla",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Vers",
    "aliases": [
      "gemengde sla",
      "sla mix",
      "salademix"
    ],
    "stores": null,
    "img": "img/products/sla_gemengd.png"
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
    "brandTier": "A",
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
    "img": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=400&q=60"
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
    "id": "gerookt_paprikapoeder",
    "name": "Gerookt paprikapoeder",
    "brand": null,
    "brandTier": "A",
    "pack": "40 g",
    "aisle": "Houdbaar",
    "aliases": [
      "gerookt paprika",
      "smoked paprika"
    ],
    "stores": null,
    "img": "img/products/gerookt_paprikapoeder.png"
  },
  {
    "id": "tofu_gerookt",
    "name": "Gerookte tofu",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "gerookte tofu",
      "tofu gerookt"
    ],
    "stores": null,
    "img": "img/products/tofu_gerookt.png"
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
    "id": "zalm_gerookt_plak",
    "name": "Gerookte zalm plakken",
    "brand": null,
    "brandTier": "A",
    "pack": "100 g",
    "aisle": "Koeling",
    "aliases": [
      "gerookte zalmplakken"
    ],
    "stores": null,
    "img": "img/products/zalm_gerookt_plak.png"
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
    "brandTier": "B",
    "pack": "500g",
    "aisle": "Houdbaar",
    "aliases": [
      "pastagf",
      "pasta glutenvrij"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "pasta_glutenfree_penne",
    "name": "Glutenvrije penne",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "glutenvrije penne"
    ],
    "stores": null,
    "img": "img/products/pasta_glutenfree_penne.png"
  },
  {
    "id": "goudse_belegen",
    "name": "Goudse belegen",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "goudse",
      "goudse belegen"
    ],
    "stores": null,
    "img": "img/products/goudse_belegen.png"
  },
  {
    "id": "aubergine_graffiti",
    "name": "Graffiti-aubergine",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "graffiti aubergine"
    ],
    "stores": null,
    "img": "img/products/aubergine_graffiti.png"
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
    "id": "yoghurt_grieks_0",
    "name": "Griekse yoghurt 0%",
    "brand": null,
    "brandTier": "A",
    "pack": "450 g",
    "aisle": "Koeling",
    "aliases": [
      "griekse yoghurt 0",
      "griekse 0%"
    ],
    "stores": null,
    "img": "img/products/yoghurt_grieks_0.png"
  },
  {
    "id": "courgette_grill",
    "name": "Grillcourgette",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "grillcourgette"
    ],
    "stores": null,
    "img": "img/products/courgette_grill.png"
  },
  {
    "id": "mais_grill",
    "name": "Grillmais",
    "brand": null,
    "brandTier": "B",
    "pack": "2 stuks",
    "aisle": "Vers",
    "aliases": [
      "grillmais",
      "bbq mais"
    ],
    "stores": null,
    "img": "img/products/mais_grill.png"
  },
  {
    "id": "paprika_grill",
    "name": "Grillpaprika",
    "brand": null,
    "brandTier": "B",
    "pack": "3 stuks",
    "aisle": "Vers",
    "aliases": [
      "grillpaprika"
    ],
    "stores": null,
    "img": "img/products/paprika_grill.png"
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
    "id": "curry_groenekerrie",
    "name": "Groene currypasta",
    "brand": null,
    "brandTier": "A",
    "pack": "100 g",
    "aisle": "Houdbaar",
    "aliases": [
      "groene curry",
      "groene currypasta"
    ],
    "stores": null,
    "img": "img/products/curry_groenekerrie.png"
  },
  {
    "id": "olijven_groen",
    "name": "Groene olijven",
    "brand": null,
    "brandTier": "B",
    "pack": "240 g",
    "aisle": "Houdbaar",
    "aliases": [
      "groene olijven"
    ],
    "stores": null,
    "img": "img/products/olijven_groen.png"
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
    "id": "bouillon_groente_pot",
    "name": "Groentebouillon pot",
    "brand": null,
    "brandTier": "B",
    "pack": "28 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "groentebouillon pot"
    ],
    "stores": null,
    "img": "img/products/bouillon_groente_pot.png"
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
    "id": "soep_zak_groente",
    "name": "Groentesoep zak",
    "brand": null,
    "brandTier": "B",
    "pack": "1 l",
    "aisle": "Houdbaar",
    "aliases": [
      "groentesoep zak"
    ],
    "stores": null,
    "img": "img/products/soep_zak_groente.png"
  },
  {
    "id": "mosterd_grof",
    "name": "Grove mosterd",
    "brand": null,
    "brandTier": "B",
    "pack": "200 g",
    "aisle": "Houdbaar",
    "aliases": [
      "grove mosterd"
    ],
    "stores": null,
    "img": "img/products/mosterd_grof.png"
  },
  {
    "id": "paneermeel_grof",
    "name": "Grove paneermeel",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "grove paneermeel"
    ],
    "stores": null,
    "img": "img/products/paneermeel_grof.png"
  },
  {
    "id": "guacamole",
    "name": "Guacamole",
    "brand": null,
    "brandTier": null,
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "guacamole"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "guacamole_bak",
    "name": "Guacamole bak",
    "brand": null,
    "brandTier": "A",
    "pack": "150 g",
    "aisle": "Koeling",
    "aliases": [
      "guacamole bak"
    ],
    "stores": null,
    "img": "img/products/guacamole_bak.png"
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
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "chocoladehagel"
    ],
    "stores": null,
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
    "id": "melk_halfvol_houdbaar",
    "name": "Halfvolle houdbare melk",
    "brand": null,
    "brandTier": "B",
    "pack": "1 l",
    "aisle": "Houdbaar",
    "aliases": [
      "houdbare melk",
      "uht melk"
    ],
    "stores": null,
    "img": "img/products/melk_halfvol_houdbaar.png"
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
    "brandTier": "A",
    "pack": "1,5L",
    "aisle": "Koeling",
    "aliases": [
      "melk",
      "melk halfvol",
      "houdbare melk",
      "melk_halfvol"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "halloumi",
    "name": "Halloumi",
    "brand": null,
    "brandTier": "A",
    "pack": "225 g",
    "aisle": "Koeling",
    "aliases": [
      "halloumi"
    ],
    "stores": null,
    "img": "img/products/halloumi.png"
  },
  {
    "id": "halvarine",
    "name": "Halvarine",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Koeling",
    "aliases": [
      "halvarine"
    ],
    "stores": null,
    "img": "img/products/halvarine.png"
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
    "id": "hamburgers_vers",
    "name": "Hamburgers vers",
    "brand": null,
    "brandTier": "A",
    "pack": "4 stuks",
    "aisle": "Koeling",
    "aliases": [
      "hamburgers",
      "verse hamburgers",
      "burger"
    ],
    "stores": null,
    "img": "img/products/hamburgers_vers.png"
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
    "id": "haverdrink_barista",
    "name": "Haverdrink barista",
    "brand": null,
    "brandTier": "A",
    "pack": "1 l",
    "aisle": "Houdbaar",
    "aliases": [
      "haver barista",
      "barista haver"
    ],
    "stores": null,
    "img": "img/products/haverdrink_barista.png"
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
    "id": "havermout_groot",
    "name": "Havermout groot",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "havermout groot"
    ],
    "stores": null,
    "img": "img/products/havermout_groot.png"
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
    "id": "heilbot",
    "name": "Heilbotfilet",
    "brand": null,
    "brandTier": "A",
    "pack": "300 g",
    "aisle": "Koeling",
    "aliases": [
      "heilbot",
      "heilbotfilet"
    ],
    "stores": null,
    "img": "img/products/heilbot.png"
  },
  {
    "id": "andijvie_heel",
    "name": "Hele andijvie",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "hele andijvie"
    ],
    "stores": null,
    "img": "img/products/andijvie_heel.png"
  },
  {
    "id": "bloemkool_heel",
    "name": "Hele bloemkool",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "hele bloemkool"
    ],
    "stores": null,
    "img": "img/products/bloemkool_heel.png"
  },
  {
    "id": "broccoli_heel",
    "name": "Hele broccoli",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "hele broccoli"
    ],
    "stores": null,
    "img": "img/products/broccoli_heel.png"
  },
  {
    "id": "rode_kool_heel",
    "name": "Hele rode kool",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "hele rode kool"
    ],
    "stores": null,
    "img": "img/products/rode_kool_heel.png"
  },
  {
    "id": "spitskool_heel",
    "name": "Hele spitskool",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "hele spitskool"
    ],
    "stores": null,
    "img": "img/products/spitskool_heel.png"
  },
  {
    "id": "witte_kool_heel",
    "name": "Hele witte kool",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "hele witte kool"
    ],
    "stores": null,
    "img": "img/products/witte_kool_heel.png"
  },
  {
    "id": "hoisinsaus",
    "name": "Hoisinsaus",
    "brand": null,
    "brandTier": "A",
    "pack": "250 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "hoisin",
      "hoisinsaus"
    ],
    "stores": null,
    "img": "img/products/hoisinsaus.png"
  },
  {
    "id": "pompoen_hokkaido",
    "name": "Hokkaido-pompoen",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "hokkaido",
      "hokkaido pompoen"
    ],
    "stores": null,
    "img": "img/products/pompoen_hokkaido.png"
  },
  {
    "id": "hollandaise",
    "name": "Hollandaisesaus",
    "brand": null,
    "brandTier": "A",
    "pack": "200 ml",
    "aisle": "Koeling",
    "aliases": [
      "hollandaise",
      "hollandaisesaus"
    ],
    "stores": null,
    "img": "img/products/hollandaise.png"
  },
  {
    "id": "garnalen_hollandse",
    "name": "Hollandse garnalen",
    "brand": null,
    "brandTier": "A",
    "pack": "100 g",
    "aisle": "Koeling",
    "aliases": [
      "hollandse garnalen",
      "garnaaltjes"
    ],
    "stores": null,
    "img": "img/products/garnalen_hollandse.png"
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
    "id": "room_kook_houdbaar",
    "name": "Houdbare kookroom",
    "brand": null,
    "brandTier": "B",
    "pack": "200 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "houdbare kookroom"
    ],
    "stores": null,
    "img": "img/products/room_kook_houdbaar.png"
  },
  {
    "id": "houtskoolbriketten",
    "name": "Houtskoolbriketten",
    "brand": null,
    "brandTier": null,
    "pack": "3 kg",
    "aisle": "Huis",
    "aliases": [
      "houtskool",
      "briketten"
    ],
    "stores": null,
    "img": "img/products/houtskoolbriketten.png"
  },
  {
    "id": "hummus",
    "name": "Hummus",
    "brand": null,
    "brandTier": null,
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "hoemoes",
      "humus"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "hummus_naturel",
    "name": "Hummus naturel",
    "brand": null,
    "brandTier": "B",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "hummus naturel"
    ],
    "stores": null,
    "img": "img/products/hummus_naturel.png"
  },
  {
    "id": "hummus_spicy",
    "name": "Hummus spicy",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "hummus spicy"
    ],
    "stores": null,
    "img": "img/products/hummus_spicy.png"
  },
  {
    "id": "huttenkase",
    "name": "Hüttenkäse",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "hüttenkäse",
      "huttenkase",
      "cottage cheese"
    ],
    "stores": null,
    "img": "img/products/huttenkase.png"
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
    "brandTier": "B",
    "pack": "200 g",
    "aisle": "Vers",
    "aliases": [
      "sla",
      "kropsla",
      "ijsberg",
      "sla_ijsberg"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=400&q=60"
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
    "id": "dv_ijs_magnum",
    "name": "IJsjes multipack",
    "brand": null,
    "brandTier": "A",
    "pack": "6 stuks",
    "aisle": "Diepvries",
    "aliases": [
      "ijsjes",
      "magnum multipack"
    ],
    "stores": null,
    "img": "img/products/dv_ijs_magnum.png"
  },
  {
    "id": "italiaanse_kruiden",
    "name": "Italiaanse kruiden",
    "brand": null,
    "brandTier": "B",
    "pack": "15 g",
    "aisle": "Houdbaar",
    "aliases": [
      "italiaanse kruiden",
      "italian herbs"
    ],
    "stores": null,
    "img": "img/products/italiaanse_kruiden.png"
  },
  {
    "id": "rijst_jasmine",
    "name": "Jasmine rijst",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Houdbaar",
    "aliases": [
      "jasmine rijst",
      "jasmin rijst"
    ],
    "stores": null,
    "img": "img/products/rijst_jasmine.png"
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
    "id": "kaas_jong_belegen_blok",
    "name": "Jong belegen kaasblok",
    "brand": null,
    "brandTier": "B",
    "pack": "450 g",
    "aisle": "Koeling",
    "aliases": [
      "jong belegen blok"
    ],
    "stores": null,
    "img": "img/products/kaas_jong_belegen_blok.png"
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
    "id": "joppiesaus",
    "name": "Joppiesaus",
    "brand": null,
    "brandTier": "A",
    "pack": "250 ml",
    "aisle": "Koeling",
    "aliases": [
      "joppiesaus",
      "joppie"
    ],
    "stores": null,
    "img": "img/products/joppiesaus.png"
  },
  {
    "id": "jus",
    "name": "Jus",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "jus poeder of bakje jus",
      "juspoeder",
      "bakje jus"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "boterhamkaas",
    "name": "Kaas (beleg)",
    "brand": null,
    "brandTier": null,
    "pack": "300 g",
    "aisle": "Koeling",
    "aliases": [
      "jong belegen",
      "kaasplakken",
      "belegen kaas"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kaasblokjes_snack",
    "name": "Kaasblokjes snack",
    "brand": null,
    "brandTier": "B",
    "pack": "150 g",
    "aisle": "Koeling",
    "aliases": [
      "kaasblokjes",
      "snackkaas"
    ],
    "stores": null,
    "img": "img/products/kaasblokjes_snack.png"
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
    "id": "kalfsschnitzel",
    "name": "Kalfsschnitzel",
    "brand": null,
    "brandTier": "A",
    "pack": "2 stuks",
    "aisle": "Koeling",
    "aliases": [
      "kalfsschnitzel",
      "schnitzel"
    ],
    "stores": null,
    "img": "img/products/kalfsschnitzel.png"
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
    "id": "dv_maaltijd_kant",
    "name": "Kant-en-klaar maaltijd diepvries",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Diepvries",
    "aliases": [
      "diepvries maaltijd kant"
    ],
    "stores": null,
    "img": "img/products/dv_maaltijd_kant.png"
  },
  {
    "id": "pannenkoeken_kant",
    "name": "Kant-en-klare pannenkoeken",
    "brand": null,
    "brandTier": "B",
    "pack": "8 stuks",
    "aisle": "Koeling",
    "aliases": [
      "kant-en-klare pannenkoeken",
      "pannenkoeken pak"
    ],
    "stores": null,
    "img": "img/products/pannenkoeken_kant.png"
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
    "id": "kardemom",
    "name": "Kardemom",
    "brand": null,
    "brandTier": "A",
    "pack": "25 g",
    "aisle": "Houdbaar",
    "aliases": [
      "kardemom"
    ],
    "stores": null,
    "img": "img/products/kardemom.png"
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
    "id": "kefir",
    "name": "Kefir",
    "brand": null,
    "brandTier": "A",
    "pack": "1 l",
    "aisle": "Koeling",
    "aliases": [
      "kefir"
    ],
    "stores": null,
    "img": "img/products/kefir.png"
  },
  {
    "id": "kerrie",
    "name": "Kerriepasta",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "kerrie",
      "milde kerriepasta",
      "milde kerrie"
    ],
    "stores": null,
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
    "id": "jam_kers",
    "name": "Kersenjam",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "kersenjam"
    ],
    "stores": null,
    "img": "img/products/jam_kers.png"
  },
  {
    "id": "tomaatKers",
    "name": "Kerstomaat",
    "brand": null,
    "brandTier": "B",
    "pack": "250g",
    "aisle": "Vers",
    "aliases": [
      "tomaatkers",
      "kerstomaten",
      "cherrytomaat"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1592924357228-91b4eada47f4?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "kervel",
    "name": "Kervel",
    "brand": null,
    "brandTier": "A",
    "pack": "1 bos",
    "aisle": "Vers",
    "aliases": [
      "kervel"
    ],
    "stores": null,
    "img": "img/products/kervel.png"
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
    "id": "ketchup_light",
    "name": "Ketchup light",
    "brand": null,
    "brandTier": "B",
    "pack": "500 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "ketchup light"
    ],
    "stores": null,
    "img": "img/products/ketchup_light.png"
  },
  {
    "id": "ketjap_asin",
    "name": "Ketjap asin",
    "brand": null,
    "brandTier": "B",
    "pack": "250 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "ketjap asin",
      "zoute ketjap"
    ],
    "stores": null,
    "img": "img/products/ketjap_asin.png"
  },
  {
    "id": "ketjap",
    "name": "Ketjap manis",
    "brand": null,
    "brandTier": "B",
    "pack": "250ml",
    "aisle": "Houdbaar",
    "aliases": [
      "ketjap"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "keukenPapier",
    "name": "Keukenpapier",
    "brand": null,
    "brandTier": null,
    "pack": "2-pack",
    "aisle": "Huis",
    "aliases": [
      "keukenrol",
      "keukenpapier"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kibbeling",
    "name": "Kibbeling",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "kibbeling"
    ],
    "stores": null,
    "img": "img/products/kibbeling.png"
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
    "id": "yoghurt_drink_kids",
    "name": "Kids yoghurtdrink",
    "brand": null,
    "brandTier": "A",
    "pack": "6 stuks",
    "aisle": "Koeling",
    "aliases": [
      "kids yoghurtdrink",
      "yoghurtdrink kids"
    ],
    "stores": null,
    "img": "img/products/yoghurt_drink_kids.png"
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
    "id": "kikkererwten_blik",
    "name": "Kikkererwten blik",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "kikkererwten blik"
    ],
    "stores": null,
    "img": "img/products/kikkererwten_blik.png"
  },
  {
    "id": "koekjes_digestive_kids",
    "name": "Kinderkoekjes",
    "brand": null,
    "brandTier": "B",
    "pack": "200 g",
    "aisle": "Houdbaar",
    "aliases": [
      "kinderkoekjes"
    ],
    "stores": null,
    "img": "img/products/koekjes_digestive_kids.png"
  },
  {
    "id": "boterhamworst_kip",
    "name": "Kipboterhamworst",
    "brand": null,
    "brandTier": "B",
    "pack": "150 g",
    "aisle": "Koeling",
    "aliases": [
      "kipboterhamworst"
    ],
    "stores": null,
    "img": "img/products/boterhamworst_kip.png"
  },
  {
    "id": "kipdijen",
    "name": "Kipdijen",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Koeling",
    "aliases": [
      "kipdijen",
      "kippendijen"
    ],
    "stores": null,
    "img": "img/products/kipdijen.png"
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
    "id": "kipdijfilet_gemarineerd",
    "name": "Kipdijfilet gemarineerd",
    "brand": null,
    "brandTier": "A",
    "pack": "500 g",
    "aisle": "Koeling",
    "aliases": [
      "gemarineerde kipdijfilet",
      "kipdijfilet marinade"
    ],
    "stores": null,
    "img": "img/products/kipdijfilet_gemarineerd.png"
  },
  {
    "id": "drumsticks",
    "name": "Kipdrumsticks",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Koeling",
    "aliases": [
      "drumsticks",
      "kip drumsticks"
    ],
    "stores": null,
    "img": "img/products/drumsticks.png"
  },
  {
    "id": "kip",
    "name": "Kipfilet",
    "brand": null,
    "brandTier": "A",
    "pack": "600 g",
    "aisle": "Koeling",
    "aliases": [
      "kip",
      "kipfilets",
      "kipfilet reepjes"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=60"
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
    "id": "kipfilet_plakken",
    "name": "Kipfilet plakken",
    "brand": null,
    "brandTier": "A",
    "pack": "150 g",
    "aisle": "Koeling",
    "aliases": [
      "kipfilet plakken",
      "kipfilet beleg"
    ],
    "stores": null,
    "img": "img/products/kipfilet_plakken.png"
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
    "id": "kipkruiden",
    "name": "Kipkruiden",
    "brand": null,
    "brandTier": "B",
    "pack": "40 g",
    "aisle": "Houdbaar",
    "aliases": [
      "kipkruiden"
    ],
    "stores": null,
    "img": "img/products/kipkruiden.png"
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
    "id": "dv_kipnuggets",
    "name": "Kipnuggets diepvries",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Diepvries",
    "aliases": [
      "diepvries kipnuggets"
    ],
    "stores": null,
    "img": "img/products/dv_kipnuggets.png"
  },
  {
    "id": "bouillon_kip_pot",
    "name": "Kippenbouillon pot",
    "brand": null,
    "brandTier": "B",
    "pack": "28 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "kippenbouillon pot"
    ],
    "stores": null,
    "img": "img/products/bouillon_kip_pot.png"
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
    "id": "soep_blik_kip",
    "name": "Kippensoep blik",
    "brand": null,
    "brandTier": "B",
    "pack": "400 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "kippensoep blik"
    ],
    "stores": null,
    "img": "img/products/soep_blik_kip.png"
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
    "id": "kipreepjes",
    "name": "Kipreepjes",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "kipreepjes",
      "kipreep"
    ],
    "stores": null,
    "img": "img/products/kipreepjes.png"
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
    "id": "marinade_kipsate",
    "name": "Kipsaté-marinade",
    "brand": null,
    "brandTier": "A",
    "pack": "200 ml",
    "aisle": "Koeling",
    "aliases": [
      "kipsaté marinade",
      "sate marinade"
    ],
    "stores": null,
    "img": "img/products/marinade_kipsate.png"
  },
  {
    "id": "kipschnitzel",
    "name": "Kipschnitzel",
    "brand": null,
    "brandTier": "B",
    "pack": "2 stuks",
    "aisle": "Koeling",
    "aliases": [
      "kipschnitzel"
    ],
    "stores": null,
    "img": "img/products/kipschnitzel.png"
  },
  {
    "id": "kipworst",
    "name": "Kipworst",
    "brand": null,
    "brandTier": "B",
    "pack": "250 g",
    "aisle": "Koeling",
    "aliases": [
      "kipworst"
    ],
    "stores": null,
    "img": "img/products/kipworst.png"
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
    "id": "knackebrod",
    "name": "Knäckebröd",
    "brand": null,
    "brandTier": "B",
    "pack": "250 g",
    "aisle": "Houdbaar",
    "aliases": [
      "knäckebröd",
      "knackebrod",
      "knäcke"
    ],
    "stores": null,
    "img": "img/products/knackebrod.png"
  },
  {
    "id": "knijpfruit",
    "name": "Knijpfruit",
    "brand": null,
    "brandTier": "B",
    "pack": "4 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "knijpfruit",
      "fruitkuipje knijp"
    ],
    "stores": null,
    "img": "img/products/knijpfruit.png"
  },
  {
    "id": "knoflook",
    "name": "Knoflook",
    "brand": null,
    "brandTier": "B",
    "pack": "1 teen",
    "aisle": "Vers",
    "aliases": [
      "teentje knoflook",
      "knoflookteen"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "knoflook_net",
    "name": "Knoflook net",
    "brand": null,
    "brandTier": "B",
    "pack": "3 stuks",
    "aisle": "Vers",
    "aliases": [
      "knoflook net"
    ],
    "stores": null,
    "img": "img/products/knoflook_net.png"
  },
  {
    "id": "naan_garlic",
    "name": "Knoflooknaan",
    "brand": null,
    "brandTier": "A",
    "pack": "2 stuks",
    "aisle": "Vers",
    "aliases": [
      "knoflooknaan",
      "garlic naan"
    ],
    "stores": null,
    "img": "img/products/naan_garlic.png"
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
    "id": "knoflooksaus",
    "name": "Knoflooksaus",
    "brand": null,
    "brandTier": "B",
    "pack": "250 ml",
    "aisle": "Koeling",
    "aliases": [
      "knoflooksaus",
      "garlic sauce"
    ],
    "stores": null,
    "img": "img/products/knoflooksaus.png"
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
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "koffie",
      "koffiebonen",
      "filterkoffie"
    ],
    "stores": null,
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
    "brandTier": "B",
    "pack": "400ml",
    "aisle": "Houdbaar",
    "aliases": [
      "kokosmelk"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kokosmelk_light",
    "name": "Kokosmelk light",
    "brand": null,
    "brandTier": "B",
    "pack": "400 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "kokosmelk light"
    ],
    "stores": null,
    "img": "img/products/kokosmelk_light.png"
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
    "id": "ei_kokos",
    "name": "Kokosyoghurt",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "kokosyoghurt",
      "kokos yoghurt"
    ],
    "stores": null,
    "img": "img/products/ei_kokos.png"
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
    "brandTier": "B",
    "pack": "1 stuks",
    "aisle": "Vers",
    "aliases": [
      "komkommers"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=400&q=60"
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
    "id": "kookroom_light",
    "name": "Kookroom light",
    "brand": null,
    "brandTier": "B",
    "pack": "250 ml",
    "aisle": "Koeling",
    "aliases": [
      "kookroom light"
    ],
    "stores": null,
    "img": "img/products/kookroom_light.png"
  },
  {
    "id": "koolrabi",
    "name": "Koolrabi",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "koolrabi"
    ],
    "stores": null,
    "img": "img/products/koolrabi.png"
  },
  {
    "id": "koriander_bos",
    "name": "Koriander bos",
    "brand": null,
    "brandTier": "B",
    "pack": "1 bos",
    "aisle": "Vers",
    "aliases": [
      "koriander bos"
    ],
    "stores": null,
    "img": "img/products/koriander_bos.png"
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
    "id": "korianderzaad",
    "name": "Korianderzaad",
    "brand": null,
    "brandTier": "B",
    "pack": "30 g",
    "aisle": "Houdbaar",
    "aliases": [
      "korianderzaad"
    ],
    "stores": null,
    "img": "img/products/korianderzaad.png"
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
    "id": "krieltjes_kriel",
    "name": "Krieltjes gewassen",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "krieltjes gewassen"
    ],
    "stores": null,
    "img": "img/products/krieltjes_kriel.png"
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
    "id": "dv_kroket",
    "name": "Kroketten diepvries",
    "brand": null,
    "brandTier": "B",
    "pack": "6 stuks",
    "aisle": "Diepvries",
    "aliases": [
      "diepvries kroket"
    ],
    "stores": null,
    "img": "img/products/dv_kroket.png"
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
    "id": "dv_kruidenmix",
    "name": "Kruidenmix diepvries",
    "brand": null,
    "brandTier": "B",
    "pack": "50 g",
    "aisle": "Diepvries",
    "aliases": [
      "diepvries kruiden",
      "tuinkruiden diepvries"
    ],
    "stores": null,
    "img": "img/products/dv_kruidenmix.png"
  },
  {
    "id": "kruidnagel",
    "name": "Kruidnagel",
    "brand": null,
    "brandTier": "B",
    "pack": "25 g",
    "aisle": "Houdbaar",
    "aliases": [
      "kruidnagel"
    ],
    "stores": null,
    "img": "img/products/kruidnagel.png"
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
    "brandTier": "B",
    "pack": "1 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "kurkuma gemalen"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "kwark",
    "name": "Kwark",
    "brand": null,
    "brandTier": "A",
    "pack": "500g",
    "aisle": "Koeling",
    "aliases": [
      "magere kwark"
    ],
    "stores": null,
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
    "id": "lamsgehakt",
    "name": "Lamsgehakt",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "lamsgehakt"
    ],
    "stores": null,
    "img": "img/products/lamsgehakt.png"
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
    "brandTier": "B",
    "pack": "1 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "lasagne",
      "lasagnebladen"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "lasagneGF",
    "name": "Lasagneplaten glutenvrij",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "lasagnegf"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "laurierblad",
    "name": "Laurierblad",
    "brand": null,
    "brandTier": "B",
    "pack": "5 g",
    "aisle": "Houdbaar",
    "aliases": [
      "laurier",
      "laurierblad"
    ],
    "stores": null,
    "img": "img/products/laurierblad.png"
  },
  {
    "id": "lekkerbek",
    "name": "Lekkerbekjes",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "lekkerbek",
      "lekkerbekjes"
    ],
    "stores": null,
    "img": "img/products/lekkerbek.png"
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
    "id": "mayonaise_licht",
    "name": "Light mayonaise",
    "brand": null,
    "brandTier": "B",
    "pack": "350 ml",
    "aisle": "Koeling",
    "aliases": [
      "light mayo",
      "mayonaise light"
    ],
    "stores": null,
    "img": "img/products/mayonaise_licht.png"
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
    "id": "limoen_net",
    "name": "Limoenen net",
    "brand": null,
    "brandTier": "B",
    "pack": "3 stuks",
    "aisle": "Vers",
    "aliases": [
      "limoenen"
    ],
    "stores": null,
    "img": "img/products/limoen_net.png"
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
    "id": "haring_maatjes",
    "name": "Maatjesharing",
    "brand": null,
    "brandTier": "A",
    "pack": "4 stuks",
    "aisle": "Koeling",
    "aliases": [
      "maatjesharing",
      "maatjes"
    ],
    "stores": null,
    "img": "img/products/haring_maatjes.png"
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
    "brandTier": "B",
    "pack": "300 g",
    "aisle": "Houdbaar",
    "aliases": [
      "mais",
      "maiskorrels",
      "blik mais"
    ],
    "stores": null,
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
    "id": "mais_blik_groot",
    "name": "Mais blik groot",
    "brand": null,
    "brandTier": "B",
    "pack": "300 g",
    "aisle": "Houdbaar",
    "aliases": [
      "mais blik groot"
    ],
    "stores": null,
    "img": "img/products/mais_blik_groot.png"
  },
  {
    "id": "mais_kolf",
    "name": "Maiskolven",
    "brand": null,
    "brandTier": "B",
    "pack": "2 stuks",
    "aisle": "Vers",
    "aliases": [
      "maiskolven",
      "mais kolf",
      "corn on the cob"
    ],
    "stores": null,
    "img": "img/products/mais_kolf.png"
  },
  {
    "id": "wraps_mais",
    "name": "Maïswraps",
    "brand": null,
    "brandTier": "B",
    "pack": "6 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "maïswraps",
      "mais wraps"
    ],
    "stores": null,
    "img": "img/products/wraps_mais.png"
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
    "id": "maizena_doos",
    "name": "Maizena doos",
    "brand": null,
    "brandTier": "A",
    "pack": "250 g",
    "aisle": "Houdbaar",
    "aliases": [
      "maizena doos"
    ],
    "stores": null,
    "img": "img/products/maizena_doos.png"
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
    "id": "mascarpone_bak",
    "name": "Mascarpone bak",
    "brand": null,
    "brandTier": "A",
    "pack": "250 g",
    "aisle": "Koeling",
    "aliases": [
      "mascarpone bak"
    ],
    "stores": null,
    "img": "img/products/mascarpone_bak.png"
  },
  {
    "id": "mayo",
    "name": "Mayonaise",
    "brand": null,
    "brandTier": "B",
    "pack": "350ml",
    "aisle": "Houdbaar",
    "aliases": [
      "mayo"
    ],
    "stores": null,
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
    "id": "stokbrood_meergranen",
    "name": "Meergranenstokbrood",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "meergranenstokbrood"
    ],
    "stores": null,
    "img": "img/products/stokbrood_meergranen.png"
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
    "id": "dv_loempia_mini",
    "name": "Mini loempia's diepvries",
    "brand": null,
    "brandTier": "B",
    "pack": "20 stuks",
    "aisle": "Diepvries",
    "aliases": [
      "mini loempia",
      "diepvries loempia mini"
    ],
    "stores": null,
    "img": "img/products/dv_loempia_mini.png"
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
    "brandTier": "A",
    "pack": "125 g",
    "aisle": "Koeling",
    "aliases": [],
    "stores": null,
    "img": null
  },
  {
    "id": "mozzarella_bol",
    "name": "Mozzarella bol",
    "brand": null,
    "brandTier": "A",
    "pack": "125 g",
    "aisle": "Koeling",
    "aliases": [
      "mozzarella bol",
      "verse mozzarella"
    ],
    "stores": null,
    "img": "img/products/mozzarella_bol.png"
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
    "id": "munt_pot",
    "name": "Munt potje",
    "brand": null,
    "brandTier": "A",
    "pack": "1 pot",
    "aisle": "Vers",
    "aliases": [
      "munt pot"
    ],
    "stores": null,
    "img": "img/products/munt_pot.png"
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
    "brandTier": "B",
    "pack": "1 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "nasimix",
      "nasi goreng kruidenmix",
      "nasi mix"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "nasi_mix_pak",
    "name": "Nasikruiden pak",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Houdbaar",
    "aliases": [
      "nasikruiden pak",
      "nasi mix"
    ],
    "stores": null,
    "img": "img/products/nasi_mix_pak.png"
  },
  {
    "id": "dv_nasi",
    "name": "Nasischotel diepvries",
    "brand": null,
    "brandTier": "B",
    "pack": "450 g",
    "aisle": "Diepvries",
    "aliases": [
      "diepvries nasi",
      "nasischotel"
    ],
    "stores": null,
    "img": "img/products/dv_nasi.png"
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
    "brandTier": "B",
    "pack": "1 stuks",
    "aisle": "Houdbaar",
    "aliases": [],
    "stores": null,
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
    "id": "muesli_noten",
    "name": "Notenmuesli",
    "brand": null,
    "brandTier": "A",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "notenmuesli",
      "muesli noten"
    ],
    "stores": null,
    "img": "img/products/muesli_noten.png"
  },
  {
    "id": "oystersaus",
    "name": "Oestersaus",
    "brand": null,
    "brandTier": "A",
    "pack": "250 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "oestersaus",
      "oyster sauce"
    ],
    "stores": null,
    "img": "img/products/oystersaus.png"
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
    "brandTier": "B",
    "pack": "1 L",
    "aisle": "Houdbaar",
    "aliases": [
      "zonnebloemolie",
      "bakolie",
      "olie"
    ],
    "stores": null,
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
    "id": "boter_ongezouten",
    "name": "Ongezouten roomboter",
    "brand": null,
    "brandTier": "A",
    "pack": "250 g",
    "aisle": "Koeling",
    "aliases": [
      "ongezouten boter",
      "ongezouten roomboter"
    ],
    "stores": null,
    "img": "img/products/boter_ongezouten.png"
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
    "id": "ontbijtkoek_gesneden",
    "name": "Ontbijtkoek gesneden",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "ontbijtkoek gesneden"
    ],
    "stores": null,
    "img": "img/products/ontbijtkoek_gesneden.png"
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
    "id": "ossenworst",
    "name": "Ossenworst",
    "brand": null,
    "brandTier": "A",
    "pack": "150 g",
    "aisle": "Koeling",
    "aliases": [
      "ossenworst"
    ],
    "stores": null,
    "img": "img/products/ossenworst.png"
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
    "id": "kaas_oud_blok",
    "name": "Oude kaasblok",
    "brand": null,
    "brandTier": "A",
    "pack": "350 g",
    "aisle": "Koeling",
    "aliases": [
      "oude kaasblok"
    ],
    "stores": null,
    "img": "img/products/kaas_oud_blok.png"
  },
  {
    "id": "dv_friet",
    "name": "Ovenfriet diepvries",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Diepvries",
    "aliases": [
      "ovenfriet",
      "diepvries friet",
      "friet diepvries"
    ],
    "stores": null,
    "img": "img/products/dv_friet.png"
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
    "brandTier": "B",
    "pack": "200g",
    "aisle": "Houdbaar",
    "aliases": [
      "panko",
      "paneermeel"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "meel",
    "name": "Pannenkoekmix",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "meel",
      "pannenkoekenmix"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "paprika",
    "name": "Paprika",
    "brand": null,
    "brandTier": "B",
    "pack": "3-pack",
    "aisle": "Vers",
    "aliases": [
      "paprika's",
      "paprikas",
      "zoete paprika"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "paprika_mix",
    "name": "Paprikamix 3 kleuren",
    "brand": null,
    "brandTier": "B",
    "pack": "3 stuks",
    "aisle": "Vers",
    "aliases": [
      "paprikamix",
      "paprika mix"
    ],
    "stores": null,
    "img": "img/products/paprika_mix.png"
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
    "id": "parmezaan_stuk",
    "name": "Parmezaan stuk",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "parmezaan stuk",
      "parmigiano"
    ],
    "stores": null,
    "img": "img/products/parmezaan_stuk.png"
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
    "id": "passata_groot",
    "name": "Passata 700 g",
    "brand": null,
    "brandTier": "B",
    "pack": "700 g",
    "aisle": "Houdbaar",
    "aliases": [
      "passata groot"
    ],
    "stores": null,
    "img": "img/products/passata_groot.png"
  },
  {
    "id": "pasta",
    "name": "Pasta",
    "brand": null,
    "brandTier": "B",
    "pack": "500g",
    "aisle": "Houdbaar",
    "aliases": [
      "macaroni",
      "penne",
      "spaghetti",
      "fusilli"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "pastasalade",
    "name": "Pastasalade",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "pastasalade"
    ],
    "stores": null,
    "img": "img/products/pastasalade.png"
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
    "id": "pastinaak",
    "name": "Pastinaak",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "pastinaak"
    ],
    "stores": null,
    "img": "img/products/pastinaak.png"
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
    "id": "perzik_vers",
    "name": "Perziken vers",
    "brand": null,
    "brandTier": "B",
    "pack": "4 stuks",
    "aisle": "Vers",
    "aliases": [
      "perziken vers"
    ],
    "stores": null,
    "img": "img/products/perzik_vers.png"
  },
  {
    "id": "pesto",
    "name": "Pesto",
    "brand": null,
    "brandTier": "B",
    "pack": "190g",
    "aisle": "Houdbaar",
    "aliases": [
      "groene pesto"
    ],
    "stores": null,
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
    "id": "peultjes",
    "name": "Peultjes",
    "brand": null,
    "brandTier": "B",
    "pack": "250 g",
    "aisle": "Vers",
    "aliases": [
      "peultjes"
    ],
    "stores": null,
    "img": "img/products/peultjes.png"
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
    "brandTier": "B",
    "pack": "350 g",
    "aisle": "Houdbaar",
    "aliases": [
      "beleg",
      "pindasmeer"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "pindakaas_met_stukjes",
    "name": "Pindakaas met stukjes",
    "brand": null,
    "brandTier": "B",
    "pack": "350 g",
    "aisle": "Houdbaar",
    "aliases": [
      "pindakaas stukjes"
    ],
    "stores": null,
    "img": "img/products/pindakaas_met_stukjes.png"
  },
  {
    "id": "pindasaus",
    "name": "Pindasaus kant-en-klaar",
    "brand": null,
    "brandTier": "B",
    "pack": "350g",
    "aisle": "Houdbaar",
    "aliases": [
      "pindasaus",
      "satésaus",
      "satesaus"
    ],
    "stores": null,
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
    "id": "pita_vers",
    "name": "Pita broodjes",
    "brand": null,
    "brandTier": "B",
    "pack": "6 stuks",
    "aisle": "Vers",
    "aliases": [
      "pita",
      "pitabroodjes"
    ],
    "stores": null,
    "img": "img/products/pita_vers.png"
  },
  {
    "id": "pita",
    "name": "Pitabrood",
    "brand": null,
    "brandTier": "B",
    "pack": "6 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "pita",
      "pitabroodjes"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "druiven_pitloos",
    "name": "Pitloze druiven",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "pitloze druiven"
    ],
    "stores": null,
    "img": "img/products/druiven_pitloos.png"
  },
  {
    "id": "dv_pizza_salami",
    "name": "Pizza salami diepvries",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Diepvries",
    "aliases": [
      "diepvries pizza salami"
    ],
    "stores": null,
    "img": "img/products/dv_pizza_salami.png"
  },
  {
    "id": "bodem",
    "name": "Pizzabodem",
    "brand": null,
    "brandTier": null,
    "pack": "1 stuks",
    "aisle": "Koeling",
    "aliases": [
      "bodem",
      "pizzabodems"
    ],
    "stores": null,
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
    "id": "peterselie_plat",
    "name": "Platte peterselie",
    "brand": null,
    "brandTier": "B",
    "pack": "1 bos",
    "aisle": "Vers",
    "aliases": [
      "platte peterselie",
      "peterselie plat"
    ],
    "stores": null,
    "img": "img/products/peterselie_plat.png"
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
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "prei",
      "preien"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1594282486552-05b4d8040dde?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "pretzel",
    "name": "Pretzels",
    "brand": null,
    "brandTier": "B",
    "pack": "150 g",
    "aisle": "Houdbaar",
    "aliases": [
      "pretzel",
      "pretzels"
    ],
    "stores": null,
    "img": "img/products/pretzel.png"
  },
  {
    "id": "provencaalse_kruiden",
    "name": "Provençaalse kruiden",
    "brand": null,
    "brandTier": "B",
    "pack": "15 g",
    "aisle": "Houdbaar",
    "aliases": [
      "provençaalse kruiden",
      "herbes de provence"
    ],
    "stores": null,
    "img": "img/products/provencaalse_kruiden.png"
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
    "id": "pruim_vers",
    "name": "Pruimen vers",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "pruimen vers"
    ],
    "stores": null,
    "img": "img/products/pruim_vers.png"
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
    "id": "raapstelen_zak",
    "name": "Raapstelen zak",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Vers",
    "aliases": [
      "raapstelen zak"
    ],
    "stores": null,
    "img": "img/products/raapstelen_zak.png"
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
    "id": "dv_garnalen_rauwe",
    "name": "Rauwe garnalen diepvries",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Diepvries",
    "aliases": [
      "rauwe garnalen diepvries"
    ],
    "stores": null,
    "img": "img/products/dv_garnalen_rauwe.png"
  },
  {
    "id": "rauwkost_salade",
    "name": "Rauwkostsalade",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "rauwkost",
      "rauwkostsalade"
    ],
    "stores": null,
    "img": "img/products/rauwkost_salade.png"
  },
  {
    "id": "refried_beans",
    "name": "Refried beans",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "refried beans",
      "frijoles"
    ],
    "stores": null,
    "img": "img/products/refried_beans.png"
  },
  {
    "id": "ricotta",
    "name": "Ricotta",
    "brand": null,
    "brandTier": "A",
    "pack": "250g",
    "aisle": "Koeling",
    "aliases": [],
    "stores": null,
    "img": null
  },
  {
    "id": "ricotta_bak",
    "name": "Ricotta bak",
    "brand": null,
    "brandTier": "A",
    "pack": "250 g",
    "aisle": "Koeling",
    "aliases": [
      "ricotta bak"
    ],
    "stores": null,
    "img": "img/products/ricotta_bak.png"
  },
  {
    "id": "rijst",
    "name": "Rijst",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Houdbaar",
    "aliases": [
      "zilvervliesrijst",
      "rijst"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "crackers_rijst",
    "name": "Rijstcrackers",
    "brand": null,
    "brandTier": "B",
    "pack": "100 g",
    "aisle": "Houdbaar",
    "aliases": [
      "rijstcrackers"
    ],
    "stores": null,
    "img": "img/products/crackers_rijst.png"
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
    "id": "curry_rodekerrie",
    "name": "Rode currypasta",
    "brand": null,
    "brandTier": "A",
    "pack": "100 g",
    "aisle": "Houdbaar",
    "aliases": [
      "rode curry",
      "rode currypasta"
    ],
    "stores": null,
    "img": "img/products/curry_rodekerrie.png"
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
    "id": "pesto_rosso",
    "name": "Rode pesto",
    "brand": null,
    "brandTier": "A",
    "pack": "190 g",
    "aisle": "Koeling",
    "aliases": [
      "rode pesto",
      "pesto rosso"
    ],
    "stores": null,
    "img": "img/products/pesto_rosso.png"
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
    "id": "rollade",
    "name": "Rollade",
    "brand": null,
    "brandTier": "A",
    "pack": "800 g",
    "aisle": "Koeling",
    "aliases": [
      "rollade",
      "runderrollade"
    ],
    "stores": null,
    "img": "img/products/rollade.png"
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
    "brandTier": "A",
    "pack": "1 stuks",
    "aisle": "Koeling",
    "aliases": [
      "gelderse rookworst"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "boter",
    "name": "Roomboter",
    "brand": null,
    "brandTier": "A",
    "pack": "250 g",
    "aisle": "Koeling",
    "aliases": [
      "boter",
      "ongezouten boter"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=60"
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
    "id": "roomkaas_light",
    "name": "Roomkaas light",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "roomkaas light",
      "light roomkaas"
    ],
    "stores": null,
    "img": "img/products/roomkaas_light.png"
  },
  {
    "id": "rosbief",
    "name": "Rosbief",
    "brand": null,
    "brandTier": "A",
    "pack": "100 g",
    "aisle": "Koeling",
    "aliases": [
      "rosbief"
    ],
    "stores": null,
    "img": "img/products/rosbief.png"
  },
  {
    "id": "rozemarijn_pot",
    "name": "Rozemarijn potje",
    "brand": null,
    "brandTier": "A",
    "pack": "1 pot",
    "aisle": "Vers",
    "aliases": [
      "rozemarijn pot"
    ],
    "stores": null,
    "img": "img/products/rozemarijn_pot.png"
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
    "id": "rozijnen_doosje",
    "name": "Rozijnendoosjes",
    "brand": null,
    "brandTier": "B",
    "pack": "6 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "rozijnendoosjes",
      "rozijnen kids"
    ],
    "stores": null,
    "img": "img/products/rozijnen_doosje.png"
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
    "id": "rucola_bak",
    "name": "Rucola bak",
    "brand": null,
    "brandTier": "A",
    "pack": "75 g",
    "aisle": "Vers",
    "aliases": [
      "rucola bak"
    ],
    "stores": null,
    "img": "img/products/rucola_bak.png"
  },
  {
    "id": "bouillon_rund",
    "name": "Runderbouillonblokjes",
    "brand": null,
    "brandTier": "B",
    "pack": "12 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "runderbouillon",
      "runderbouillonblokjes"
    ],
    "stores": null,
    "img": "img/products/bouillon_rund.png"
  },
  {
    "id": "gehakt",
    "name": "Rundergehakt",
    "brand": null,
    "brandTier": "A",
    "pack": "500g",
    "aisle": "Koeling",
    "aliases": [
      "gehakt",
      "gehakt rund",
      "gemengd gehakt",
      "gehakt_runder"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=60"
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
    "id": "runderreepjes",
    "name": "Runderreepjes",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "runderreepjes",
      "biefstukreepjes"
    ],
    "stores": null,
    "img": "img/products/runderreepjes.png"
  },
  {
    "id": "rundervinken",
    "name": "Rundervinken",
    "brand": null,
    "brandTier": "A",
    "pack": "4 stuks",
    "aisle": "Koeling",
    "aliases": [
      "rundervinken",
      "vinken"
    ],
    "stores": null,
    "img": "img/products/rundervinken.png"
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
    "id": "salie",
    "name": "Salie vers",
    "brand": null,
    "brandTier": "A",
    "pack": "1 bos",
    "aisle": "Vers",
    "aliases": [
      "salie",
      "verse salie"
    ],
    "stores": null,
    "img": "img/products/salie.png"
  },
  {
    "id": "salsa_heet",
    "name": "Salsa hot",
    "brand": null,
    "brandTier": "A",
    "pack": "300 g",
    "aisle": "Houdbaar",
    "aliases": [
      "salsa hot",
      "hete salsa"
    ],
    "stores": null,
    "img": "img/products/salsa_heet.png"
  },
  {
    "id": "salsa_mild",
    "name": "Salsa mild",
    "brand": null,
    "brandTier": "A",
    "pack": "300 g",
    "aisle": "Houdbaar",
    "aliases": [
      "salsa",
      "salsa mild"
    ],
    "stores": null,
    "img": "img/products/salsa_mild.png"
  },
  {
    "id": "sambal",
    "name": "Sambal oelek",
    "brand": null,
    "brandTier": "B",
    "pack": "200g",
    "aisle": "Houdbaar",
    "aliases": [
      "sambal"
    ],
    "stores": null,
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
    "id": "sardines_olie",
    "name": "Sardines in olie",
    "brand": null,
    "brandTier": "B",
    "pack": "120 g",
    "aisle": "Houdbaar",
    "aliases": [
      "sardines olie"
    ],
    "stores": null,
    "img": "img/products/sardines_olie.png"
  },
  {
    "id": "satesaus_pot",
    "name": "Satésaus pot",
    "brand": null,
    "brandTier": "B",
    "pack": "350 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "satésaus",
      "satesaus pot"
    ],
    "stores": null,
    "img": "img/products/satesaus_pot.png"
  },
  {
    "id": "sate_spies",
    "name": "Satéspiesjes",
    "brand": null,
    "brandTier": "A",
    "pack": "6 stuks",
    "aisle": "Koeling",
    "aliases": [
      "satéspies",
      "saté spiesjes",
      "kipsaté spies"
    ],
    "stores": null,
    "img": "img/products/sate_spies.png"
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
    "id": "scampi",
    "name": "Scampi's",
    "brand": null,
    "brandTier": "A",
    "pack": "400 g",
    "aisle": "Diepvries",
    "aliases": [
      "scampi",
      "scampi's",
      "grote garnalen"
    ],
    "stores": null,
    "img": "img/products/scampi.png"
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
    "id": "eieren_scharrel_10",
    "name": "Scharreleieren 10-pack",
    "brand": null,
    "brandTier": "B",
    "pack": "10 stuks",
    "aisle": "Koeling",
    "aliases": [
      "scharrel 10"
    ],
    "stores": null,
    "img": "img/products/eieren_scharrel_10.png"
  },
  {
    "id": "scholfilet",
    "name": "Scholfilet",
    "brand": null,
    "brandTier": "A",
    "pack": "300 g",
    "aisle": "Koeling",
    "aliases": [
      "schol",
      "scholfilet"
    ],
    "stores": null,
    "img": "img/products/scholfilet.png"
  },
  {
    "id": "sesamolie",
    "name": "Sesamolie",
    "brand": null,
    "brandTier": "B",
    "pack": "150ml",
    "aisle": "Houdbaar",
    "aliases": [],
    "stores": null,
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
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "sinaasappel",
      "sinaasappels",
      "appelsien"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1547514701-42782126185d?auto=format&fit=crop&w=400&q=60"
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
    "id": "skyr",
    "name": "Skyr naturel",
    "brand": null,
    "brandTier": "A",
    "pack": "450 g",
    "aisle": "Koeling",
    "aliases": [
      "skyr",
      "skyr naturel"
    ],
    "stores": null,
    "img": "img/products/skyr.png"
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
    "id": "slavinken_pak",
    "name": "Slavinken 4-pack",
    "brand": null,
    "brandTier": "B",
    "pack": "4 stuks",
    "aisle": "Koeling",
    "aliases": [
      "slavinken pack"
    ],
    "stores": null,
    "img": "img/products/slavinken_pak.png"
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
    "id": "dv_soepgroente_extra",
    "name": "Soepgroente diepvries extra",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Diepvries",
    "aliases": [
      "soepgroente dv"
    ],
    "stores": null,
    "img": "img/products/dv_soepgroente_extra.png"
  },
  {
    "id": "soepstengels",
    "name": "Soepstengels",
    "brand": null,
    "brandTier": "B",
    "pack": "100 g",
    "aisle": "Houdbaar",
    "aliases": [
      "soepstengels",
      "soepstengel"
    ],
    "stores": null,
    "img": "img/products/soepstengels.png"
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
    "brandTier": "B",
    "pack": "50 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "soja",
      "tamari"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "sojasaus_light",
    "name": "Sojasaus light",
    "brand": null,
    "brandTier": "A",
    "pack": "250 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "sojasaus light",
      "light soja"
    ],
    "stores": null,
    "img": "img/products/sojasaus_light.png"
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
    "id": "spare_ribs",
    "name": "Spare ribs",
    "brand": null,
    "brandTier": "A",
    "pack": "1 kg",
    "aisle": "Koeling",
    "aliases": [
      "spare ribs",
      "spareribs",
      "ribben"
    ],
    "stores": null,
    "img": "img/products/spare_ribs.png"
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
    "id": "spekreepjes",
    "name": "Spekreepjes",
    "brand": null,
    "brandTier": "B",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "spekreepjes",
      "spek reepjes"
    ],
    "stores": null,
    "img": "img/products/spekreepjes.png"
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
    "brandTier": "B",
    "pack": "450 g",
    "aisle": "Koeling",
    "aliases": [
      "spinazie diepvries",
      "diepvriesspinazie"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=60"
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
    "id": "wraps_spinazie",
    "name": "Spinazie wraps",
    "brand": null,
    "brandTier": "A",
    "pack": "6 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "spinazie wraps"
    ],
    "stores": null,
    "img": "img/products/wraps_spinazie.png"
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
    "id": "spruitjes_vers",
    "name": "Spruitjes vers",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "spruitjes vers"
    ],
    "stores": null,
    "img": "img/products/spruitjes_vers.png"
  },
  {
    "id": "slagroom_spuit",
    "name": "Spuitbus slagroom",
    "brand": null,
    "brandTier": "A",
    "pack": "250 g",
    "aisle": "Koeling",
    "aliases": [
      "spuitbus slagroom",
      "spuitslagroom"
    ],
    "stores": null,
    "img": "img/products/slagroom_spuit.png"
  },
  {
    "id": "sriracha",
    "name": "Sriracha",
    "brand": null,
    "brandTier": "A",
    "pack": "250 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "sriracha"
    ],
    "stores": null,
    "img": "img/products/sriracha.png"
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
    "id": "stoofvlees",
    "name": "Stoofvlees",
    "brand": null,
    "brandTier": "A",
    "pack": "500 g",
    "aisle": "Koeling",
    "aliases": [
      "stoofvlees",
      "draadjesvlees"
    ],
    "stores": null,
    "img": "img/products/stoofvlees.png"
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
    "id": "sugar_snaps",
    "name": "Sugar snaps",
    "brand": null,
    "brandTier": "B",
    "pack": "250 g",
    "aisle": "Vers",
    "aliases": [
      "sugar snaps",
      "sugarsnaps",
      "peulen"
    ],
    "stores": null,
    "img": "img/products/sugar_snaps.png"
  },
  {
    "id": "suiker",
    "name": "Suiker",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Houdbaar",
    "aliases": [
      "suiker",
      "kristalsuiker"
    ],
    "stores": null,
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
    "id": "surimi",
    "name": "Surimi sticks",
    "brand": null,
    "brandTier": "B",
    "pack": "250 g",
    "aisle": "Koeling",
    "aliases": [
      "surimi",
      "krabsticks"
    ],
    "stores": null,
    "img": "img/products/surimi.png"
  },
  {
    "id": "rijst_sushi",
    "name": "Sushirijst",
    "brand": null,
    "brandTier": "A",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "sushirijst"
    ],
    "stores": null,
    "img": "img/products/rijst_sushi.png"
  },
  {
    "id": "sweetChili",
    "name": "Sweet chili saus",
    "brand": null,
    "brandTier": "B",
    "pack": "250ml",
    "aisle": "Houdbaar",
    "aliases": [
      "sweetchili",
      "sweet chili",
      "sweet chilisaus",
      "zoete chilisaus"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "taco_shells",
    "name": "Taco shells",
    "brand": null,
    "brandTier": "A",
    "pack": "8 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "taco shells",
      "tacoschelpen"
    ],
    "stores": null,
    "img": "img/products/taco_shells.png"
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
    "brandTier": null,
    "pack": "75 ml",
    "aisle": "Huis",
    "aliases": [
      "tandenpasta",
      "tandpasta"
    ],
    "stores": null,
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
    "id": "tempeh_stuk",
    "name": "Tempeh stuk",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "tempeh stuk"
    ],
    "stores": null,
    "img": "img/products/tempeh_stuk.png"
  },
  {
    "id": "teriyakisaus",
    "name": "Teriyakisaus",
    "brand": null,
    "brandTier": "A",
    "pack": "250 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "teriyaki",
      "teriyakisaus"
    ],
    "stores": null,
    "img": "img/products/teriyakisaus.png"
  },
  {
    "id": "visaus_thai",
    "name": "Thaise visaus",
    "brand": null,
    "brandTier": "A",
    "pack": "200 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "thaise visaus",
      "fish sauce"
    ],
    "stores": null,
    "img": "img/products/visaus_thai.png"
  },
  {
    "id": "thee",
    "name": "Thee",
    "brand": null,
    "brandTier": "B",
    "pack": "20 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "thee",
      "theezakjes"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "tijgerbol",
    "name": "Tijgerbollen",
    "brand": null,
    "brandTier": "B",
    "pack": "4 stuks",
    "aisle": "Vers",
    "aliases": [
      "tijgerbol",
      "tijgerbollen"
    ],
    "stores": null,
    "img": "img/products/tijgerbol.png"
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
    "id": "tijm_pot",
    "name": "Tijm potje",
    "brand": null,
    "brandTier": "A",
    "pack": "1 pot",
    "aisle": "Vers",
    "aliases": [
      "tijm pot"
    ],
    "stores": null,
    "img": "img/products/tijm_pot.png"
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
    "id": "tilapia",
    "name": "Tilapiafilet",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Koeling",
    "aliases": [
      "tilapia",
      "tilapiafilet"
    ],
    "stores": null,
    "img": "img/products/tilapia.png"
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
    "brandTier": null,
    "pack": "6-pack",
    "aisle": "Huis",
    "aliases": [
      "wc papier",
      "toiletpapier",
      "toilet papier"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "toiletreiniger",
    "name": "Toiletreiniger",
    "brand": null,
    "brandTier": null,
    "pack": "750 ml",
    "aisle": "Huis",
    "aliases": [
      "wc reiniger",
      "toiletreiniger"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "tomaatVers",
    "name": "Tomaat (vers)",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "verse tomaat",
      "tomaten vers",
      "vleestomaat"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=400&q=60"
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
    "brandTier": "B",
    "pack": "400g",
    "aisle": "Houdbaar",
    "aliases": [
      "tomaat",
      "blik tomaten",
      "passata"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "tomatenblokjes_groot",
    "name": "Tomatenblokjes 3-pack",
    "brand": null,
    "brandTier": "B",
    "pack": "3 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "tomatenblokjes 3-pack"
    ],
    "stores": null,
    "img": "img/products/tomatenblokjes_groot.png"
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
    "id": "soep_blik_tomaat",
    "name": "Tomatensoep blik",
    "brand": null,
    "brandTier": "B",
    "pack": "400 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "tomatensoep blik",
      "blik tomatensoep"
    ],
    "stores": null,
    "img": "img/products/soep_blik_tomaat.png"
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
    "id": "tonijn_olie",
    "name": "Tonijn in olie",
    "brand": null,
    "brandTier": "B",
    "pack": "160 g",
    "aisle": "Houdbaar",
    "aliases": [
      "tonijn olie",
      "tonijn in olie"
    ],
    "stores": null,
    "img": "img/products/tonijn_olie.png"
  },
  {
    "id": "tonijn_water",
    "name": "Tonijn in water",
    "brand": null,
    "brandTier": "B",
    "pack": "160 g",
    "aisle": "Houdbaar",
    "aliases": [
      "tonijn water",
      "tonijn in water"
    ],
    "stores": null,
    "img": "img/products/tonijn_water.png"
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
    "brandTier": "B",
    "pack": "200 g",
    "aisle": "Houdbaar",
    "aliases": [
      "nacho chips",
      "tortillachips",
      "nachos"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "tortilla_chips_naturel",
    "name": "Tortillachips naturel",
    "brand": null,
    "brandTier": "B",
    "pack": "200 g",
    "aisle": "Houdbaar",
    "aliases": [
      "tortillachips naturel"
    ],
    "stores": null,
    "img": "img/products/tortilla_chips_naturel.png"
  },
  {
    "id": "tosti_brood",
    "name": "Tostibrood",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "tostibrood",
      "tosti brood"
    ],
    "stores": null,
    "img": "img/products/tosti_brood.png"
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
    "id": "truffelmayo",
    "name": "Truffelmayonaise",
    "brand": null,
    "brandTier": "A",
    "pack": "200 ml",
    "aisle": "Koeling",
    "aliases": [
      "truffelmayo",
      "truffel mayonaise"
    ],
    "stores": null,
    "img": "img/products/truffelmayo.png"
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
    "brandTier": null,
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [],
    "stores": null,
    "img": null
  },
  {
    "id": "tzatziki_bak",
    "name": "Tzatziki bak",
    "brand": null,
    "brandTier": "B",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "tzatziki bak"
    ],
    "stores": null,
    "img": "img/products/tzatziki_bak.png"
  },
  {
    "id": "ui",
    "name": "Uien",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "ui",
      "rode ui"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=400&q=60"
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
    "id": "vanille_extract",
    "name": "Vanille-extract",
    "brand": null,
    "brandTier": "A",
    "pack": "50 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "vanille extract",
      "vanilla extract"
    ],
    "stores": null,
    "img": "img/products/vanille_extract.png"
  },
  {
    "id": "dv_ijs_vanille",
    "name": "Vanille-ijs diepvries",
    "brand": null,
    "brandTier": "B",
    "pack": "1 l",
    "aisle": "Diepvries",
    "aliases": [
      "vanille ijs",
      "diepvries vanille-ijs"
    ],
    "stores": null,
    "img": "img/products/dv_ijs_vanille.png"
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
    "id": "varkensschnitzel",
    "name": "Varkensschnitzel",
    "brand": null,
    "brandTier": "B",
    "pack": "2 stuks",
    "aisle": "Koeling",
    "aliases": [
      "varkensschnitzel"
    ],
    "stores": null,
    "img": "img/products/varkensschnitzel.png"
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
    "id": "fruitsap_sinaasappel_vers",
    "name": "Vers geperst sinaasappelsap",
    "brand": null,
    "brandTier": "A",
    "pack": "1 l",
    "aisle": "Koeling",
    "aliases": [
      "vers sinaasappelsap"
    ],
    "stores": null,
    "img": "img/products/fruitsap_sinaasappel_vers.png"
  },
  {
    "id": "ananas_vers",
    "name": "Verse ananas",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Vers",
    "aliases": [
      "verse ananas"
    ],
    "stores": null,
    "img": "img/products/ananas_vers.png"
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
    "id": "gember_vers",
    "name": "Verse gember",
    "brand": null,
    "brandTier": "B",
    "pack": "150 g",
    "aisle": "Vers",
    "aliases": [
      "verse gember"
    ],
    "stores": null,
    "img": "img/products/gember_vers.png"
  },
  {
    "id": "mosselen_vers",
    "name": "Verse mosselen",
    "brand": null,
    "brandTier": "A",
    "pack": "2 kg",
    "aisle": "Koeling",
    "aliases": [
      "verse mosselen"
    ],
    "stores": null,
    "img": "img/products/mosselen_vers.png"
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
    "id": "soep_vers_pompoen",
    "name": "Verse pompoensoep",
    "brand": null,
    "brandTier": "A",
    "pack": "500 ml",
    "aisle": "Koeling",
    "aliases": [
      "verse pompoensoep"
    ],
    "stores": null,
    "img": "img/products/soep_vers_pompoen.png"
  },
  {
    "id": "sperziebonen_vers",
    "name": "Verse sperziebonen",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "verse sperziebonen"
    ],
    "stores": null,
    "img": "img/products/sperziebonen_vers.png"
  },
  {
    "id": "soep_vers_tomaat",
    "name": "Verse tomatensoep",
    "brand": null,
    "brandTier": "A",
    "pack": "500 ml",
    "aisle": "Koeling",
    "aliases": [
      "verse tomatensoep"
    ],
    "stores": null,
    "img": "img/products/soep_vers_tomaat.png"
  },
  {
    "id": "tonijn_vers",
    "name": "Verse tonijnsteak",
    "brand": null,
    "brandTier": "A",
    "pack": "200 g",
    "aisle": "Koeling",
    "aliases": [
      "verse tonijn"
    ],
    "stores": null,
    "img": "img/products/tonijn_vers.png"
  },
  {
    "id": "visstick_vers",
    "name": "Verse vissticks",
    "brand": null,
    "brandTier": "B",
    "pack": "300 g",
    "aisle": "Koeling",
    "aliases": [
      "verse vissticks"
    ],
    "stores": null,
    "img": "img/products/visstick_vers.png"
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
    "id": "vinaigrette",
    "name": "Vinaigrette",
    "brand": null,
    "brandTier": "B",
    "pack": "250 ml",
    "aisle": "Koeling",
    "aliases": [
      "vinaigrette",
      "sladressing"
    ],
    "stores": null,
    "img": "img/products/vinaigrette.png"
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
    "id": "viskruiden",
    "name": "Viskruiden",
    "brand": null,
    "brandTier": "B",
    "pack": "35 g",
    "aisle": "Houdbaar",
    "aliases": [
      "viskruiden"
    ],
    "stores": null,
    "img": "img/products/viskruiden.png"
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
    "id": "dv_vissticks",
    "name": "Vissticks diepvries",
    "brand": null,
    "brandTier": "B",
    "pack": "450 g",
    "aisle": "Diepvries",
    "aliases": [
      "diepvries vissticks"
    ],
    "stores": null,
    "img": "img/products/dv_vissticks.png"
  },
  {
    "id": "tomaat_vleestomaat",
    "name": "Vleestomaten",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Vers",
    "aliases": [
      "vleestomaat",
      "vleestomaten"
    ],
    "stores": null,
    "img": "img/products/tomaat_vleestomaat.png"
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
    "id": "honing_vloeibaar",
    "name": "Vloeibare honing",
    "brand": null,
    "brandTier": "A",
    "pack": "350 g",
    "aisle": "Houdbaar",
    "aliases": [
      "vloeibare honing"
    ],
    "stores": null,
    "img": "img/products/honing_vloeibaar.png"
  },
  {
    "id": "beschuit_volkoren",
    "name": "Volkoren beschuit",
    "brand": null,
    "brandTier": "B",
    "pack": "13 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "volkoren beschuit"
    ],
    "stores": null,
    "img": "img/products/beschuit_volkoren.png"
  },
  {
    "id": "bloem_volkoren",
    "name": "Volkoren bloem",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Houdbaar",
    "aliases": [
      "volkoren bloem"
    ],
    "stores": null,
    "img": "img/products/bloem_volkoren.png"
  },
  {
    "id": "crackers_volkoren",
    "name": "Volkoren crackers",
    "brand": null,
    "brandTier": "B",
    "pack": "250 g",
    "aisle": "Houdbaar",
    "aliases": [
      "volkoren crackers"
    ],
    "stores": null,
    "img": "img/products/crackers_volkoren.png"
  },
  {
    "id": "pasta_volkoren",
    "name": "Volkoren pasta",
    "brand": null,
    "brandTier": "B",
    "pack": "500 g",
    "aisle": "Houdbaar",
    "aliases": [
      "volkoren pasta"
    ],
    "stores": null,
    "img": "img/products/pasta_volkoren.png"
  },
  {
    "id": "toast_volkoren",
    "name": "Volkoren toast",
    "brand": null,
    "brandTier": "B",
    "pack": "1 stuk",
    "aisle": "Houdbaar",
    "aliases": [
      "volkoren toast"
    ],
    "stores": null,
    "img": "img/products/toast_volkoren.png"
  },
  {
    "id": "wraps_volkoren",
    "name": "Volkoren wraps",
    "brand": null,
    "brandTier": "B",
    "pack": "6 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "volkoren wraps",
      "wraps volkoren"
    ],
    "stores": null,
    "img": "img/products/wraps_volkoren.png"
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
    "id": "hagelslag_mix",
    "name": "Vruchtenhagelslag mix",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "hagelslag mix"
    ],
    "stores": null,
    "img": "img/products/hagelslag_mix.png"
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
    "brandTier": null,
    "pack": "1,5 kg",
    "aisle": "Huis",
    "aliases": [
      "wasmiddel",
      "waspoeder"
    ],
    "stores": null,
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
    "brandTier": "B",
    "pack": "1,5L",
    "aisle": "Houdbaar",
    "aliases": [
      "mineraalwater",
      "bronwater"
    ],
    "stores": null,
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
    "id": "zalm_wild",
    "name": "Wilde zalmfilet",
    "brand": null,
    "brandTier": "A",
    "pack": "250 g",
    "aisle": "Koeling",
    "aliases": [
      "wilde zalm",
      "wild salmon"
    ],
    "stores": null,
    "img": "img/products/zalm_wild.png"
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
    "id": "wortel_winter",
    "name": "Winterpeen gewassen",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "winterpeen gewassen"
    ],
    "stores": null,
    "img": "img/products/wortel_winter.png"
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
    "id": "witlof_stronk",
    "name": "Witlof 3-stronk",
    "brand": null,
    "brandTier": "B",
    "pack": "3 stuks",
    "aisle": "Vers",
    "aliases": [
      "witlof stronk"
    ],
    "stores": null,
    "img": "img/products/witlof_stronk.png"
  },
  {
    "id": "bolletjes_wit",
    "name": "Witte bolletjes",
    "brand": null,
    "brandTier": "B",
    "pack": "6 stuks",
    "aisle": "Vers",
    "aliases": [
      "witte bolletjes"
    ],
    "stores": null,
    "img": "img/products/bolletjes_wit.png"
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
    "id": "bonen_witte_blik",
    "name": "Witte bonen blik",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Houdbaar",
    "aliases": [
      "witte bonen blik"
    ],
    "stores": null,
    "img": "img/products/bonen_witte_blik.png"
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
    "id": "dv_wokgroente",
    "name": "Wokgroente diepvries",
    "brand": null,
    "brandTier": "B",
    "pack": "400 g",
    "aisle": "Diepvries",
    "aliases": [
      "wokgroente diepvries",
      "diepvries wok"
    ],
    "stores": null,
    "img": "img/products/dv_wokgroente.png"
  },
  {
    "id": "noedels",
    "name": "Woknoedels",
    "brand": null,
    "brandTier": "B",
    "pack": "300 g",
    "aisle": "Houdbaar",
    "aliases": [
      "noedels",
      "mie"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "worcestersaus",
    "name": "Worcestersaus",
    "brand": null,
    "brandTier": "A",
    "pack": "150 ml",
    "aisle": "Houdbaar",
    "aliases": [
      "worcester",
      "worcestersaus",
      "worcestershire"
    ],
    "stores": null,
    "img": "img/products/worcestersaus.png"
  },
  {
    "id": "wortel",
    "name": "Wortelen",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "wortel",
      "winterpeen",
      "peen",
      "bospeen"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=400&q=60"
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
    "brandTier": "B",
    "pack": "8 stuks",
    "aisle": "Houdbaar",
    "aliases": [
      "wrap",
      "tortilla wraps"
    ],
    "stores": null,
    "img": null
  },
  {
    "id": "yoghurt",
    "name": "Yoghurt",
    "brand": null,
    "brandTier": "A",
    "pack": "1 kg",
    "aisle": "Koeling",
    "aliases": [
      "magere yoghurt",
      "volle yoghurt"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "yoghurtdressing",
    "name": "Yoghurtdressing",
    "brand": null,
    "brandTier": "B",
    "pack": "250 ml",
    "aisle": "Koeling",
    "aliases": [
      "yoghurtdressing"
    ],
    "stores": null,
    "img": "img/products/yoghurtdressing.png"
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
    "brandTier": "A",
    "pack": "2 stuks",
    "aisle": "Koeling",
    "aliases": [
      "zalm",
      "zalmfilets"
    ],
    "stores": null,
    "img": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=60"
  },
  {
    "id": "dv_zalm_filet",
    "name": "Zalmfilet diepvries",
    "brand": null,
    "brandTier": "A",
    "pack": "250 g",
    "aisle": "Diepvries",
    "aliases": [
      "diepvries zalm"
    ],
    "stores": null,
    "img": "img/products/dv_zalm_filet.png"
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
    "id": "zoete_aardappel_oranje",
    "name": "Zoete aardappel oranje",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "zoete aardappel oranje"
    ],
    "stores": null,
    "img": "img/products/zoete_aardappel_oranje.png"
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
    "id": "ui_zoet",
    "name": "Zoete uien",
    "brand": null,
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Vers",
    "aliases": [
      "zoete uien",
      "zoete ui"
    ],
    "stores": null,
    "img": "img/products/ui_zoet.png"
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
    "id": "zongedroogde_olie",
    "name": "Zongedroogde tomaten op olie",
    "brand": null,
    "brandTier": "A",
    "pack": "280 g",
    "aisle": "Houdbaar",
    "aliases": [
      "zongedroogde op olie"
    ],
    "stores": null,
    "img": "img/products/zongedroogde_olie.png"
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
    "brandTier": "B",
    "pack": "1 kg",
    "aisle": "Houdbaar",
    "aliases": [
      "zout",
      "keukenzout"
    ],
    "stores": null,
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
    "id": "olijven_zwart",
    "name": "Zwarte olijven",
    "brand": null,
    "brandTier": "B",
    "pack": "240 g",
    "aisle": "Houdbaar",
    "aliases": [
      "zwarte olijven"
    ],
    "stores": null,
    "img": "img/products/olijven_zwart.png"
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
