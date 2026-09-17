# WeAte sync (huissleutel)

Twee telefoons delen hetzelfde huis via een korte **huissleutel** (code) en Firebase Firestore.
Zonder `firebase-config.js` blijft alles lokaal op de telefoon — de Sync-sectie op Huis legt uit wat er nog moet.

## Wat synct

Plan, mensen, always/extras, weglaten (omit), toegevoegde ingrediënten (ingAdd), afgevinkt (checked), merk (brand/itemBrand), winkels, budget, huisnaam, apartPick, gegeten (eaten).

**Niet** synchroon: folder-/bonus-JSON (publiek op de site).

## Firebase klaarzetten (Roy)

1. Ga naar [Firebase Console](https://console.firebase.google.com/) → project aanmaken (of bestaand).
2. **Build → Firestore Database** → database maken (start in productiemodus of test; regels hieronder plakken).
3. **Projectinstellingen → Je apps → Web-app** toevoegen; kopieer de `firebaseConfig`.
4. In de repo-root:
   - Kopieer `firebase-config.example.js` → `firebase-config.js`
   - Plak je echte config in `window.WEATE_FIREBASE = { ... }`
   - **Commit `firebase-config.js` niet** (staat in `.gitignore`). Voor GitHub Pages: zet het bestand in de live map via een follow-up (upload/PR alleen example), of host het apart — Pages serveert wat in de repo staat, dus je moet `firebase-config.js` lokaal deployen of tijdelijk toevoegen en daarna weer uit git houden.
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

## Gebruik

- **Maak huissleutel** op telefoon 1 → korte code (6–8 tekens A–Z/0–9). Deel die met telefoon 2.
- **Koppel met code** op telefoon 2 → zelfde huis-document.
- Bij eerste koppeling: lege cloud → lokale data uploaden; cloud vol + lokale data “leegachtig” → cloud laden; beide rijk → cloud wint + toast “Gegevens van de andere telefoon geladen”.
- Conflict-MVP: last-write-wins via `updatedAt` (serverTimestamp). Nooit stil wissen.

## Let op

De code is het wachtwoord. Wie de code heeft, kan alles in dat huis lezen/schrijven. Geen end-to-end encryptie, geen echte accounts (bewust out of scope).
