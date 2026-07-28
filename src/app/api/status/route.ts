import { Connection, PublicKey } from "@solana/web3.js";
import { walletVerificationConfigured } from "@/lib/wallet-verification";

export async function GET() {
  const rpc = process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com";
  let rpcHealthy = false;
  let signer = "";
  try {
    const connection = new Connection(rpc, "confirmed");
    const version = await connection.getVersion();
    rpcHealthy = Boolean(version["solana-core"]);
    if (process.env.SOLANA_PUBLIC_KEY) signer = new PublicKey(process.env.SOLANA_PUBLIC_KEY).toBase58();
  } catch { rpcHealthy = false; }
  return Response.json({ aiAgent: Boolean(process.env.GROQ_API_KEY), aiModel: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile", walletVerification: walletVerificationConfigured(), solana: { network: "devnet", rpcHealthy, anchoringEnabled: Boolean(process.env.SOLANA_SECRET_KEY), signer }, checkedAt: new Date().toISOString() });
}
