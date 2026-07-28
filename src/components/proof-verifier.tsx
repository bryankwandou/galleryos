"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, ExternalLink, Search, ShieldAlert } from "lucide-react";

type ProofResult = { verified: boolean; signature: string; label: string; digest: string; signer: string; slot: number; blockTime: number | null; explorerUrl: string };

export function ProofVerifier({ initialSignature = "" }: { initialSignature?: string }) {
  const [signature, setSignature] = useState(initialSignature);
  const [result, setResult] = useState<ProofResult | null>(null);
  const [error, setError] = useState("");
  const [working, setWorking] = useState(false);
  async function verify() {
    setWorking(true); setError(""); setResult(null);
    try { const response = await fetch(`/api/proofs/verify?signature=${encodeURIComponent(signature.trim())}`); const payload = await response.json(); if (!response.ok) throw new Error(payload.error); setResult(payload); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Verification failed"); }
    finally { setWorking(false); }
  }
  return <motion.section className="verifier-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}><div className="verifier-head"><span>Independent devnet check</span><h2>Verify a GalleryOS proof.</h2><p>Paste a Solana transaction signature. GalleryOS reads the confirmed transaction, checks its signer, and validates the SHA-256 Memo format.</p></div><div className="verifier-form"><input value={signature} onChange={(event) => setSignature(event.target.value)} placeholder="Solana transaction signature" /><button onClick={verify} disabled={working || signature.length < 80}><Search size={15} />{working ? "Checking devnet" : "Verify transaction"}</button></div>{error && <div className="verifier-error"><ShieldAlert />{error}</div>}{result && <div className={result.verified ? "verifier-result valid" : "verifier-result invalid"}><CheckCircle2 /><div><b>{result.verified ? "Valid GalleryOS proof" : "Proof signer mismatch"}</b><span>{result.label} · slot {result.slot.toLocaleString()}</span><code>{result.digest}</code><small>Signer {result.signer}</small><a href={result.explorerUrl} target="_blank" rel="noreferrer">Open Solana Explorer <ExternalLink size={12} /></a></div></div>}</motion.section>;
}
