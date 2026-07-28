import { randomUUID } from "node:crypto";
import { z } from "zod";
import { assertRateLimit, assertSameOrigin } from "@/lib/request-security";
import { signSelectionReceipt } from "@/lib/selection-receipt";

const schema = z.object({ gallery: z.literal("harper-chen"), selected: z.array(z.number().int().min(0).max(5)).min(1).max(6) });

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    assertRateLimit(request, "gallery-selection", 10, 60_000);
    const input = schema.parse(await request.json());
    const receipt = { gallery: input.gallery, selected: [...new Set(input.selected)].sort((a, b) => a - b), submittedAt: new Date().toISOString(), receiptId: randomUUID() };
    return Response.json({ receipt, receiptToken: signSelectionReceipt(receipt) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit selections";
    return Response.json({ error: message }, { status: message.includes("origin") ? 403 : message.includes("Rate limit") ? 429 : 400 });
  }
}
