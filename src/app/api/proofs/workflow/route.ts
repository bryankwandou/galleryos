import { z } from "zod";
import { anchorEvidence } from "@/lib/solana-proof";
import { assertRateLimit, assertSameOrigin } from "@/lib/request-security";
import { verifyWalletSession } from "@/lib/wallet-verification";

const schema = z.object({ bookingId: z.string().min(1).max(80), includedImageIds: z.array(z.string()).max(1000), excludedImageIds: z.array(z.string()).max(1000) });

function cookie(request: Request, name: string) {
  return request.headers.get("cookie")?.split(";").map((value) => value.trim()).find((value) => value.startsWith(`${name}=`))?.slice(name.length + 1);
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    assertRateLimit(request, "workflow-proof", 5, 60_000);
    const approvedByWallet = verifyWalletSession(cookie(request, "galleryos_wallet"));
    const payload = schema.parse(await request.json());
    const recordedAt = new Date().toISOString();
    const anchor = await anchorEvidence({ type: "gallery-approval", ...payload, approvedByWallet, recordedAt }, "GalleryOSGallery");
    return Response.json({ recordedAt, network: "devnet", approvedByWallet, anchor });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to anchor workflow";
    return Response.json({ error: message }, { status: message.includes("required") || message.includes("session") ? 401 : message.includes("Rate limit") ? 429 : 400 });
  }
}
