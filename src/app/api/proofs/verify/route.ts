import { z } from "zod";
import { assertRateLimit } from "@/lib/request-security";
import { verifyEvidenceTransaction } from "@/lib/solana-proof";

const signatureSchema = z.string().min(80).max(100);

export async function GET(request: Request) {
  try {
    assertRateLimit(request, "proof-verify", 30, 60_000);
    const signature = signatureSchema.parse(new URL(request.url).searchParams.get("signature"));
    return Response.json(await verifyEvidenceTransaction(signature));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to verify proof";
    return Response.json({ error: message }, { status: message.includes("Rate limit") ? 429 : 400 });
  }
}
