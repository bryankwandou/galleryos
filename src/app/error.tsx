"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("GalleryOS route error", error); }, [error]);
  return <main className="not-found-page"><section><span>Something interrupted this frame</span><h1>Let&apos;s try<br /><em>that again.</em></h1><p>No gallery decision or wallet transaction was completed.</p><div><button className="button button-dark" onClick={reset}><RefreshCw size={15} /> Retry safely</button><Link href="/dashboard">Return to studio</Link></div></section></main>;
}
