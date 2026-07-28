import { z } from "zod";
import { anchorEvidence } from "@/lib/solana-proof";

const schema = z.object({ bookingId: z.string().min(1).max(80), includedImageIds: z.array(z.string()).max(1000), excludedImageIds: z.array(z.string()).max(1000), approvedByWallet: z.string().min(32).max(64).optional() });

export async function POST(request: Request) {
  try {
    const payload = schema.parse(await request.json());
    const recordedAt = new Date().toISOString();
    const anchor = await anchorEvidence({ type: "gallery-approval", ...payload, recordedAt }, "GalleryOSGallery");
    return Response.json({ recordedAt, network: "devnet", anchor });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unable to anchor workflow" }, { status: 400 });
  }
}
