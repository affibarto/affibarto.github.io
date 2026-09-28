# WeAte AI (A+B+C)

Slimme weekvoorstellen, restjes-coach en strengere lijst↔Actie-matching.

**Geen API-keys in de frontend.** De site is GitHub Pages (statisch). Standaard werkt alles **offline** met lokale heuristieken (`ai.js`). Optioneel kun je een endpoint zetten dat de key server-side houdt.

## Wat werkt zonder key (nu live)

| Functie | Offline gedrag |
|--------|----------------|
| **A · Slim voorstellen** | Houdt rekening met wie thuis/later/apart is, veto’s & dieet (`hardBlock` / `tasteHits`), sportdrukte (snellere recepten), fijn, opwarm-vriendelijk, keukenvariatie, overlap met je lijst. Geen verzonnen €-besparing. |
| **B · Restjes-coach** | Kiest recepten die je aangevinkte restjes/lijst-items gebruiken (catalogus-aliassen mee). Tips in Barto-toon. |
| **C · Lijst↔Actie** | Zelfde strenge whole-word match als `folder.js` (géén paprika→chips), plus veilige meervoudsvarianten (`tomaat`/`tomaten`). |

UI: **Slim voorstellen** op het bord / in Voorstellen · **Restjes** op Lijst (en Restjes-coach op het bord als er al maaltijden staan) · Actie-badges via de verbeterde matcher.

## Optioneel: remote endpoint

Zet ergens vóór `ai.js` (of in de console / een klein config-bestand):

```html
<script>window.WEATE_AI_ENDPOINT = "https://weate-ai.JOUW_SUBDOMAIN.workers.dev";</script>
```

Of in `firebase-config.js`:

```js
window.WEATE_FIREBASE = {
  /* …bestaande firebase keys… */
  aiEndpoint: "https://weate-ai.JOUW_SUBDOMAIN.workers.dev"
};
```

`ai.js` POSTet JSON naar:

- `POST {endpoint}/suggestWeek` body `{ ctx }` → `{ suggestions: [{ day, id, why? }] }`
- `POST {endpoint}/suggestFromLeftovers` body `{ items: [{ n, k }] }` → `{ suggestions: [{ id, uses?, tip? }] }`

Alleen recept-**id’s** uit `recipes.js` worden geaccepteerd; dieet-blokkades blijven client-side. Bij fout of leeg antwoord: stille fallback naar lokale heuristiek.

## Cloudflare Worker (stub in repo)

Map: `workers/weate-ai/`.

1. Cloudflare-account (gratis tier volstaat) → Workers.
2. Secret zetten: `xai API Key` of OpenAI — **`wrangler secret put XAI_API_KEY`** (of `OPENAI_API_KEY`).
3. Deploy: `cd workers/weate-ai && npx wrangler deploy`.
4. Plak de worker-URL in `WEATE_AI_ENDPOINT`.

De stub in de repo is minimaal: CORS, JSON in/uit, key alleen in Worker env. Zonder Cloudflare-account deploy je niets; de app blijft offline-first.

**Firebase Function** kan hetzelfde contract implementeren; er is geen free-tier Function deploy vanuit deze GitHub Pages-repo zonder jouw GCP-project — gebruik liever de Worker of alleen lokale modus.

## Testen (Roy)

1. Hard refresh (`?v=` bump) of PWA opnieuw openen.
2. **Huis** → weekschema/sportdagen + eventueel veto’s.
3. **Bord** → weekplanning zetten → **Slim voorstellen** → vink avonden → op het bord.
4. **Lijst** → **Restjes** → tik restjes → Zoek → open recept.
5. **Actie** → badges “Op je lijst” / “Past bij je bord”; paprika mag **niet** aan chips plakken.
6. Optioneel: endpoint zetten, Network-tab: POST naar je worker; zonder endpoint geen AI-calls.

## API-vorm (suggestWeek)

```json
{
  "suggestions": [
    { "day": "Ma", "id": "bolo", "why": "drukke avond → snel" }
  ]
}
```

Gestructureerd JSON → bestaande partial-accept UI in `suggest.js`.
