import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

const MAX_CHALLENGE_AGE_MS = 5 * 60_000;
const SESSION_AGE_MS = 30 * 60_000;

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

export function createWalletSession(address: string, now = new Date()) {
  const payload = Buffer.from(JSON.stringify({ address: new PublicKey(address).toBase58(), expiresAt: now.getTime() + SESSION_AGE_MS, nonce: randomBytes(12).toString("hex") })).toString("base64url");
  const signature = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifyWalletSession(session: string | undefined, now = new Date()) {
  if (!session) throw new Error("Verified wallet session required");
  const [payload, suppliedSignature] = session.split(".");
  if (!payload || !suppliedSignature) throw new Error("Wallet session is invalid");
  const expected = Buffer.from(createHmac("sha256", secret()).update(payload).digest("base64url"));
  const supplied = Buffer.from(suppliedSignature);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) throw new Error("Wallet session is invalid");
  const parsed = JSON.parse(Buffer.from(payload, "base64url").toString()) as { address: string; expiresAt: number };
  if (parsed.expiresAt <= now.getTime()) throw new Error("Wallet session expired; verify again");
  return new PublicKey(parsed.address).toBase58();
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
