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

export async function verifyEvidenceTransaction(signature: string) {
  const connection = new Connection(process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com", "confirmed");
  const transaction = await connection.getParsedTransaction(signature, { commitment: "confirmed", maxSupportedTransactionVersion: 0 });
  if (!transaction) throw new Error("Transaction was not found on Solana devnet");
  const memoInstruction = transaction.transaction.message.instructions.find((instruction) => "program" in instruction && instruction.program === "spl-memo");
  if (!memoInstruction || !("parsed" in memoInstruction) || typeof memoInstruction.parsed !== "string") throw new Error("Transaction does not contain a readable Memo proof");
  const [label, digest] = memoInstruction.parsed.split(":");
  if (!label?.startsWith("GalleryOS") || !/^[a-f0-9]{64}$/.test(digest ?? "")) throw new Error("Transaction is not a valid GalleryOS evidence memo");
  const expectedSigner = process.env.SOLANA_PUBLIC_KEY;
  const signer = transaction.transaction.message.accountKeys.find((key) => key.signer)?.pubkey.toBase58() ?? "";
  return { verified: Boolean(!transaction.meta?.err && (!expectedSigner || signer === expectedSigner)), signature, label, digest, signer, expectedSigner: expectedSigner ?? "", slot: transaction.slot, blockTime: transaction.blockTime, explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet` };
}
