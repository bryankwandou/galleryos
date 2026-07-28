import assert from "node:assert/strict";
import test from "node:test";
import { Keypair } from "@solana/web3.js";
import { createWalletSession, verifyWalletSession } from "./wallet-verification.ts";

test("verified wallet session preserves address", () => {
  process.env.WALLET_CHALLENGE_SECRET = "galleryos-session-test";
  const address = Keypair.generate().publicKey.toBase58();
  assert.equal(verifyWalletSession(createWalletSession(address)), address);
});

test("expired wallet session is rejected", () => {
  process.env.WALLET_CHALLENGE_SECRET = "galleryos-session-test";
  const address = Keypair.generate().publicKey.toBase58();
  const issuedAt = new Date("2026-01-01T00:00:00Z");
  assert.throws(() => verifyWalletSession(createWalletSession(address, issuedAt), new Date("2026-01-01T01:00:00Z")), /expired/);
});
