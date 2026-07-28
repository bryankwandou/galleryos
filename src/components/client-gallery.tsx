"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { Check, Copy, Download, Heart, LockKeyhole, X } from "lucide-react";
import { Logo } from "./logo";

const gallery = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1300&q=88",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1460364157752-926555421a7e?auto=format&fit=crop&w=900&q=88",
  "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=900&q=88",
];

export function ClientGallery() {
  const [selected, setSelected] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<{ receiptId: string; submittedAt: string; token: string } | null>(null);
  useEffect(() => { try { const saved = JSON.parse(localStorage.getItem("galleryos:harper-chen:favorites") ?? "[]"); if (Array.isArray(saved)) setSelected(saved.filter((value) => Number.isInteger(value) && value >= 0 && value < gallery.length)); } finally { setReady(true); } }, []);
  useEffect(() => { if (ready) localStorage.setItem("galleryos:harper-chen:favorites", JSON.stringify(selected)); }, [ready, selected]);
  const toggle = (index: number) => setSelected((current) => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
  async function submitSelections() { setSubmitting(true); try { const response = await fetch("/api/gallery/selections", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ gallery: "harper-chen", selected }) }); const result = await response.json(); if (!response.ok) throw new Error(result.error); setReceipt({ receiptId: result.receipt.receiptId, submittedAt: result.receipt.submittedAt, token: result.receiptToken }); } finally { setSubmitting(false); } }
  return <main className="client-gallery"><header><Logo /><div><LockKeyhole size={13} /> Private gallery</div></header><section className="gallery-intro"><span>North & River presents</span><h1>Harper <em>&</em> Chen</h1><p>New York · 24 July 2026</p><div className="gallery-rule" /></section><section className="client-photo-grid">{gallery.map((photo,index) => <article key={photo}><button className="open-photo" aria-label={`Open photograph ${index + 1}`} onClick={() => setLightbox(index)} style={{backgroundImage:`url(${photo})`}} /><button className={selected.includes(index) ? "heart selected" : "heart"} onClick={() => toggle(index)}>{selected.includes(index) ? <Check size={16} /> : <Heart size={16} />}</button></article>)}</section><div className="selection-bar"><div><b>{selected.length}</b><span>favorites selected</span></div><button disabled={!selected.length || submitting} onClick={submitSelections}>{submitting ? "Submitting" : "Send selections"} <Download size={15} /></button></div><footer><Logo /><span>Gallery available until 14 August 2026</span><small>Photographs © North & River Studio</small></footer><AnimatePresence>{receipt && <motion.div className="receipt-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.section initial={{ y: 24, scale: .97 }} animate={{ y: 0, scale: 1 }}><button onClick={() => setReceipt(null)}><X /></button><Check /><span>Selections received</span><h2>Your shortlist is recorded.</h2><p>{selected.length} favorites submitted on {new Date(receipt.submittedAt).toLocaleString()}.</p><code>{receipt.receiptId}</code><button className="copy-receipt" onClick={() => navigator.clipboard.writeText(receipt.token)}><Copy size={14} /> Copy signed receipt</button><small>The signed receipt can be independently checked through the verification API.</small></motion.section></motion.div>}</AnimatePresence>{lightbox !== null && <div className="lightbox" role="dialog" aria-modal="true"><button className="lightbox-close" onClick={() => setLightbox(null)}><X /></button><Image src={gallery[lightbox]} alt={`Harper and Chen wedding photograph ${lightbox + 1}`} width={1400} height={1000} unoptimized /><button className={selected.includes(lightbox) ? "lightbox-favorite chosen" : "lightbox-favorite"} onClick={() => toggle(lightbox)}><Heart size={17} />{selected.includes(lightbox) ? "Selected" : "Select favorite"}</button></div>}</main>;
}
