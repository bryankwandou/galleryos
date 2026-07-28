"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, ExternalLink, ShieldCheck, Wallet } from "lucide-react";

type WalletProvider = {
  connect(): Promise<{ publicKey: { toString(): string } }>;
  signMessage(message: Uint8Array, encoding?: string): Promise<Uint8Array | { signature: Uint8Array }>;
};

declare global { interface Window { solana?: WalletProvider; solflare?: WalletProvider } }

function base64(bytes: Uint8Array) {
  let value = "";
  for (const byte of bytes) value += String.fromCharCode(byte);
  return btoa(value);
}

export type WalletProof = { address: string; signature?: string; explorerUrl?: string; balance: number };

export function WalletControl({ onVerified }: { onVerified?: (proof: WalletProof) => void }) {
  const [state, setState] = useState<"idle" | "working" | "verified" | "error">("idle");
  const [message, setMessage] = useState("Connect Phantom or Solflare and sign a no-cost ownership challenge.");
  const [proof, setProof] = useState<WalletProof | null>(null);

  async function verify() {
    setState("working");
    setMessage("Waiting for wallet approval…");
    try {
      const provider = window.solana ?? window.solflare;
      if (!provider) throw new Error("No Solana wallet detected. Install Phantom or Solflare, then refresh.");
      const connection = await provider.connect();
      const address = connection.publicKey.toString();
      const challengeResponse = await fetch("/api/wallet/challenge", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address }) });
      const challenge = await challengeResponse.json();
      if (!challengeResponse.ok) throw new Error(challenge.error);
      const signed = await provider.signMessage(new TextEncoder().encode(challenge.message), "utf8");
      const signature = signed instanceof Uint8Array ? signed : signed.signature;
      const response = await fetch("/api/wallet/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ address, message: challenge.message, challengeToken: challenge.challengeToken, signature: base64(signature) }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      const nextProof = { address, signature: result.anchor.signature, explorerUrl: result.anchor.explorerUrl, balance: result.devnetBalanceSol };
      setProof(nextProof);
      setState("verified");
      setMessage(result.anchor.mode === "anchored" ? "Ownership verified and evidence anchored on Solana devnet." : "Ownership verified. Devnet anchor signer is not configured.");
      onVerified?.(nextProof);
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Wallet verification failed");
    }
  }

  return <motion.section className={`wallet-panel ${state}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
    <div className="wallet-panel-head"><div className="wallet-icon">{state === "verified" ? <ShieldCheck /> : <Wallet />}</div><div><span>Solana studio identity</span><h3>{state === "verified" ? "Verified on devnet" : "Verify wallet ownership"}</h3></div>{state === "verified" && <i><Check size={13} /> Real signature</i>}</div>
    <p>{message}</p>
    {proof && <div className="wallet-details"><code>{proof.address.slice(0, 8)}…{proof.address.slice(-8)}</code><span>{proof.balance.toFixed(4)} devnet SOL</span>{proof.explorerUrl && <a href={proof.explorerUrl} target="_blank" rel="noreferrer">Open transaction <ExternalLink size={12} /></a>}</div>}
    <button onClick={verify} disabled={state === "working"}>{state === "working" ? "Waiting for signature" : state === "verified" ? "Verify again" : "Connect and verify"}</button>
    <small>No transfer, token approval, or wallet secret is requested.</small>
  </motion.section>;
}
