import assert from "node:assert/strict";
import test from "node:test";
import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import { createWalletChallenge, verifyWalletChallenge } from "./wallet-verification.ts";

test("valid signed challenge proves wallet ownership", () => {
  process.env.WALLET_CHALLENGE_SECRET = "galleryos-test-secret";
  const wallet = Keypair.generate();
  const challenge = createWalletChallenge(wallet.publicKey.toBase58());
  const signature = nacl.sign.detached(new TextEncoder().encode(challenge.message), wallet.secretKey);
  assert.equal(verifyWalletChallenge(wallet.publicKey.toBase58(), challenge.message, Buffer.from(signature).toString("base64"), challenge.challengeToken), wallet.publicKey.toBase58());
});

test("signature from another wallet is rejected", () => {
  process.env.WALLET_CHALLENGE_SECRET = "galleryos-test-secret";
  const wallet = Keypair.generate();
  const attacker = Keypair.generate();
  const challenge = createWalletChallenge(wallet.publicKey.toBase58());
  const signature = nacl.sign.detached(new TextEncoder().encode(challenge.message), attacker.secretKey);
  assert.throws(() => verifyWalletChallenge(wallet.publicKey.toBase58(), challenge.message, Buffer.from(signature).toString("base64"), challenge.challengeToken), /invalid/);
});
