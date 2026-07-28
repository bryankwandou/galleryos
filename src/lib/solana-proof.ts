import { createHash } from "node:crypto";
import bs58 from "bs58";
import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";

const MEMO_PROGRAM = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

function signerFromSecret(secret: string) {
  const bytes = secret.trim().startsWith("[") ? Uint8Array.from(JSON.parse(secret) as number[]) : bs58.decode(secret.trim());
  return Keypair.fromSecretKey(bytes);
}

export function evidenceDigest(payload: unknown) {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

export async function anchorEvidence(payload: unknown, label = "GalleryOS") {
  const digest = evidenceDigest(payload);
  if (!process.env.SOLANA_SECRET_KEY) return { mode: "prepared" as const, digest };
  const signer = signerFromSecret(process.env.SOLANA_SECRET_KEY);
  const connection = new Connection(process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com", "confirmed");
  const transaction = new Transaction().add(new TransactionInstruction({
    keys: [{ pubkey: signer.publicKey, isSigner: true, isWritable: false }],
    programId: MEMO_PROGRAM,
    data: Buffer.from(`${label}:${digest}`),
  }));
  const signature = await connection.sendTransaction(transaction, [signer], { skipPreflight: false });
  const latestBlockhash = await connection.getLatestBlockhash("confirmed");
  await connection.confirmTransaction({ signature, ...latestBlockhash }, "confirmed");
  return { mode: "anchored" as const, digest, signature, signer: signer.publicKey.toBase58(), explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet` };
}
