import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { z } from "zod";
import { anchorEvidence } from "@/lib/solana-proof";
import { verifyWalletChallenge } from "@/lib/wallet-verification";

const schema = z.object({ address: z.string(), message: z.string(), signature: z.string(), challengeToken: z.string() });

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const address = verifyWalletChallenge(body.address, body.message, body.signature, body.challengeToken);
    const connection = new Connection(process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com", "confirmed");
    const balance = await connection.getBalance(new PublicKey(address));
    const verifiedAt = new Date().toISOString();
    const anchor = await anchorEvidence({ type: "studio-wallet-verification", address, verifiedAt }, "GalleryOSWallet");
    return Response.json({ verified: true, network: "devnet", address, verifiedAt, devnetBalanceSol: balance / LAMPORTS_PER_SOL, anchor });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Wallet verification failed" }, { status: 401 });
  }
}
