/**
 * WeAte AI stub — holds the model key server-side.
 * Deploy with Wrangler; set XAI_API_KEY or OPENAI_API_KEY.
 * Contract matches AI.md. Without a key, returns { ok:false } so the
 * client falls back to local heuristics.
 */
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }
    if (request.method !== "POST") {
      return json({ ok: false, error: "POST only" }, 405);
    }
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "") || "/";
    let body = {};
    try {
      body = await request.json();
    } catch (_) {
      body = {};
    }

    const key = env.XAI_API_KEY || env.OPENAI_API_KEY || "";
    if (!key) {
      return json({
        ok: false,
        error: "no_key",
        hint: "Set XAI_API_KEY or OPENAI_API_KEY via wrangler secret. Client will use local heuristics.",
        suggestions: [],
      });
    }

    /* Minimal passthrough: ask the model for JSON ids only.
       Provider: xAI when XAI_API_KEY set, else OpenAI. */
    const useXai = !!env.XAI_API_KEY;
    const apiUrl = useXai
      ? "https://api.x.ai/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
    const model = useXai ? "grok-2-latest" : "gpt-4o-mini";

    let userPrompt = "";
    if (path.endsWith("suggestWeek")) {
      userPrompt =
        "Je bent WeAte voor gezin Barto (NL). Geef JSON {suggestions:[{day,id,why}]} " +
        "met recept-ids uit de catalogus. Geen €-bedragen, geen recepttekst dump. Context: " +
        JSON.stringify(body.ctx || body).slice(0, 6000);
    } else if (path.endsWith("suggestFromLeftovers")) {
      userPrompt =
        "WeAte restjes-coach (NL). JSON {suggestions:[{id,uses,tip}]} — alleen recept-ids, kort tip. Items: " +
        JSON.stringify(body.items || []).slice(0, 4000);
    } else {
      return json({ ok: false, error: "unknown_path", path }, 404);
    }

    try {
      const r = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature: 0.3,
          messages: [
            {
              role: "system",
              content:
                "Antwoord uitsluitend met geldige JSON. Geen markdown. Geen copyrighted recipe dumps.",
            },
            { role: "user", content: userPrompt },
          ],
        }),
      });
      if (!r.ok) {
        return json({ ok: false, error: "upstream_" + r.status, suggestions: [] }, 502);
      }
      const data = await r.json();
      const text =
        (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) ||
        "{}";
      let parsed = {};
      try {
        parsed = JSON.parse(text.replace(/^```json\s*|\s*```$/g, "").trim());
      } catch (_) {
        return json({ ok: false, error: "bad_json", suggestions: [] }, 502);
      }
      return json({
        ok: true,
        source: "remote",
        suggestions: parsed.suggestions || parsed.items || [],
      });
    } catch (err) {
      return json({ ok: false, error: String(err && err.message || err), suggestions: [] }, 500);
    }
  },
};
