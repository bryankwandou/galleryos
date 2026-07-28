import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

const MAX_CHALLENGE_AGE_MS = 5 * 60_000;

function secret() {
  const value = process.env.WALLET_CHALLENGE_SECRET ?? process.env.SOLANA_SECRET_KEY ?? process.env.GROQ_API_KEY;
  if (!value) throw new Error("Wallet verification is not configured");
  return value;
}

export function walletVerificationConfigured() {
  return Boolean(process.env.WALLET_CHALLENGE_SECRET ?? process.env.SOLANA_SECRET_KEY ?? process.env.GROQ_API_KEY);
}

function token(address: string, message: string) {
  return createHmac("sha256", secret()).update(`${address}\n${message}`).digest("base64url");
}

export function createWalletChallenge(rawAddress: string, now = new Date()) {
  const address = new PublicKey(rawAddress).toBase58();
  const message = [
    "GalleryOS studio verification",
    "Network: Solana Devnet",
    `Address: ${address}`,
    `Nonce: ${randomBytes(16).toString("hex")}`,
    `Issued at: ${now.toISOString()}`,
    "Purpose: prove studio wallet ownership; no transaction is requested.",
  ].join("\n");
  return { address, message, challengeToken: token(address, message), expiresAt: new Date(now.getTime() + MAX_CHALLENGE_AGE_MS).toISOString() };
}

export function verifyWalletChallenge(rawAddress: string, message: string, signatureBase64: string, challengeToken: string, now = new Date()) {
  const publicKey = new PublicKey(rawAddress);
  if (!message.includes(`Address: ${publicKey.toBase58()}`) || !message.includes("Network: Solana Devnet")) throw new Error("Wallet challenge does not match this address or network");
  const expected = Buffer.from(token(publicKey.toBase58(), message));
  const supplied = Buffer.from(challengeToken);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) throw new Error("Wallet challenge token is invalid");
  const issuedAt = message.split("\n").find((line) => line.startsWith("Issued at: "))?.slice(11);
  const issuedTime = issuedAt ? new Date(issuedAt).getTime() : Number.NaN;
  if (!Number.isFinite(issuedTime) || now.getTime() - issuedTime > MAX_CHALLENGE_AGE_MS || issuedTime > now.getTime() + 30_000) throw new Error("Wallet challenge expired");
  const valid = nacl.sign.detached.verify(new TextEncoder().encode(message), Buffer.from(signatureBase64, "base64"), publicKey.toBytes());
  if (!valid) throw new Error("Wallet signature is invalid");
  return publicKey.toBase58();
}
