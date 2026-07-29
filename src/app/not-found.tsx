import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return <main className="not-found-page"><nav className="nav shell"><Logo /><Link href="/dashboard" prefetch={false}>Open studio</Link></nav><section><span>404</span><h1>This frame<br /><em>isn&apos;t here.</em></h1><p>The address may be mistyped, expired, or no longer shared.</p><div><Link className="button button-dark" href="/" prefetch={false}><ArrowLeft size={15} /> Back home</Link><Link href="/verify" prefetch={false}><Search size={15} /> Verify a proof</Link></div></section></main>;
}
