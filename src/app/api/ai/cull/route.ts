import { z } from "zod";

const schema = z.object({
  filename: z.string().min(1).max(160),
  photographerNote: z.string().max(500).optional(),
  metrics: z.object({ width: z.number().int().positive(), height: z.number().int().positive(), meanLuminance: z.number().min(0).max(255), darkClippingRatio: z.number().min(0).max(1), brightClippingRatio: z.number().min(0).max(1), sharpnessVariance: z.number().nonnegative() }),
});

export async function POST(request: Request) {
  if (!process.env.GROQ_API_KEY) return Response.json({ error: "AI vision is not configured" }, { status: 503 });
  try {
    const input = schema.parse(await request.json());
    const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, temperature: 0.1, response_format: { type: "json_object" }, messages: [
        { role: "system", content: "You are a conservative photography culling agent. Analyze deterministic pixel metrics computed from the real image in the user's browser. Never claim to see faces, expressions, identity, composition, or content. Return strict JSON with decision keep|review|remove, confidence 0..1, visibleReason under 140 characters, technicalNotes as 1-3 short strings. Only suggest remove for extreme technical failure; otherwise use review or keep. Human approval is mandatory." },
        { role: "user", content: JSON.stringify(input) },
      ] }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error(`Vision provider returned ${response.status}`);
    const payload = await response.json();
    const parsed = z.object({ decision: z.enum(["keep", "review", "remove"]), confidence: z.number().min(0).max(1), visibleReason: z.string().min(1).max(200), technicalNotes: z.array(z.string()).min(1).max(3) }).parse(JSON.parse(payload.choices[0].message.content));
    return Response.json({ ...parsed, model, requestId: response.headers.get("x-request-id") ?? crypto.randomUUID(), analyzedAt: new Date().toISOString() });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Image analysis failed" }, { status: 502 });
  }
}
