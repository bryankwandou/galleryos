import { z } from "zod";
import { assertRateLimit } from "@/lib/request-security";
import { verifySelectionReceipt } from "@/lib/selection-receipt";

export async function GET(request: Request) {
  try {
    assertRateLimit(request, "selection-verify", 30, 60_000);
    const token = z.string().min(40).max(2000).parse(new URL(request.url).searchParams.get("token"));
    return Response.json({ verified: true, receipt: verifySelectionReceipt(token) });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Receipt verification failed" }, { status: 400 });
  }
}
