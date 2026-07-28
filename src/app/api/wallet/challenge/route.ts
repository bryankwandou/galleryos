import { z } from "zod";
import { createWalletChallenge } from "@/lib/wallet-verification";

const schema = z.object({ address: z.string().min(32).max(64) });

export async function POST(request: Request) {
  try {
    const { address } = schema.parse(await request.json());
    return Response.json(createWalletChallenge(address));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Invalid wallet address" }, { status: 400 });
  }
}
