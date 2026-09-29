# WeAte sync (huissleutel)

Twee telefoons delen hetzelfde huis via een korte **huissleutel** (code) en Firebase Firestore.
`firebase-config.js` staat in de repo (Firebase web-config is publiek; de huissleutel + Firestore-regels zijn het geheim). Zonder geldige config blijft alles lokaal op de telefoon.

## Conflictregel (last-write-wins)

- Elk huis is **één Firestore-document** `houses/{huissleutel}`.
- Bij elke lokale wijziging schrijft WeAte het hele synchroon-pakket opnieuw met `updatedAt = serverTimestamp()` en `updatedBy = deviceId`.
- **Last-write-wins:** de telefoon met de nieuwste `updatedAt` wint. De andere telefoon neemt die staat over (geen stille merges van losse velden).
- Echo van je eigen write (zelfde `updatedBy`, recent) wordt genegeerd om flikkeren te voorkomen.
- Bij eerste koppeling: lege cloud → lokale data uploaden; cloud vol → cloud laden (toast). Nooit stil wissen.

Field-level merge is bewust **niet** in gebruik: plan/lijst/checked horen als geheel bij één huis. `set(..., { merge: true })` voorkomt alleen dat losse metadata-velden verdwijnen; de app-state zelf is LWW.

## Offline-wachtrij

- Zonder netwerk (of bij push-fout “unavailable”) blijven wijzigingen **lokaal** en markeert sync een pending flush.
- Bij `online` event: pending push wordt automatisch doorgestuurd.
- Status in de UI: **online** / **sync…** / **offline** / **fout**, plus “Laatste sync: …”.

## Wat synct

Plan, mensen, always/extras, weglaten (omit), toegevoegde ingrediënten (ingAdd), afgevinkt (checked), merk (brand/itemBrand), winkels, budget, huisnaam, apartPick, gegeten (eaten), **weekPlans**, **customs**, listCompact, planRemind.

**Niet** synchroon: folder-/bonus-JSON (publiek op de site), productcatalogus-extras in localStorage (tot sync later).

## Firebase klaarzetten (Roy)

1. Ga naar [Firebase Console](https://console.firebase.google.com/) → project aanmaken (of bestaand).
2. **Build → Firestore Database** → database maken (start in productiemodus of test; regels hieronder plakken).
3. **Projectinstellingen → Je apps → Web-app** toevoegen; kopieer de `firebaseConfig`.
4. Config in de repo: `firebase-config.js` is gecommit (web-config is bedoeld om publiek te zijn).
   - Alleen regenereren bij **rotatie** van keys/project (kopieer van `firebase-config.example.js` of Firebase Console → web-app config).
   - Niet opnieuw aanmaken bij elke deploy.
5. Deploy Firestore-regels (Console → Firestore → Regels), bijvoorbeeld:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Familie-MVP: de huissleutel IS het geheim.
    // Iedereen met de code kan houses/{houseId} lezen en schrijven.
    // Geen accounts. Deel de code alleen in huis.
    match /houses/{houseId} {
      allow read, write: if houseId.size() >= 6 && houseId.size() <= 8
        && houseId.matches('^[A-Z0-9]+$');
    }
  }
}
```

6. Herlaad WeAte. Op **Huis → Sync**: “Maak huissleutel” of “Koppel met code”.

## Gebruik (twee telefoons)

1. Telefoon 1 → **Huis → Maak huissleutel** → noteer de code (6–8 tekens).
2. Telefoon 2 → **Huis → Koppel met code** → zelfde code.
3. Zet op telefoon 1 iets op het bord of de lijst → binnen een paar seconden zichtbaar op telefoon 2 (als beide online).
4. Vliegtuigmodus op één telefoon → wijzig lokaal → weer online → sync flusht automatisch.

## Let op

De code is het wachtwoord. Wie de code heeft, kan alles in dat huis lezen/schrijven. Geen end-to-end encryptie, geen echte accounts (bewust out of scope).
