import Link from "next/link";
import { Logo } from "@/components/logo";
import { ProofVerifier } from "@/components/proof-verifier";

export const metadata = { title: "Verify Devnet Proof" };
export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ signature?: string }> }) { const params = await searchParams; return <main className="simple-page verify-page"><nav className="nav shell"><Logo /><Link href="/dashboard">Open studio</Link></nav><header className="simple-hero"><span className="kicker">Public provenance</span><h1>Trust, then<br /><em>verify.</em></h1><p>No wallet or account is required to inspect a GalleryOS evidence transaction.</p></header><div className="verifier-wrap"><ProofVerifier initialSignature={params.signature ?? ""} /></div></main>; }
