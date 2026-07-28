"use client";

import { useState } from "react";
import { Check, Download, Heart, LockKeyhole, X } from "lucide-react";
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
  const [lightbox, setLightbox] = useState<number | null>(null);
  const toggle = (index: number) => setSelected((current) => current.includes(index) ? current.filter(value => value !== index) : [...current, index]);
  return <main className="client-gallery"><header><Logo /><div><LockKeyhole size={13} /> Private gallery</div></header><section className="gallery-intro"><span>North & River presents</span><h1>Harper <em>&</em> Chen</h1><p>New York · 24 July 2026</p><div className="gallery-rule" /></section><section className="client-photo-grid">{gallery.map((photo,index) => <article key={photo}><button className="open-photo" aria-label={`Open photograph ${index + 1}`} onClick={() => setLightbox(index)} style={{backgroundImage:`url(${photo})`}} /><button className={selected.includes(index) ? "heart selected" : "heart"} onClick={() => toggle(index)}>{selected.includes(index) ? <Check size={16} /> : <Heart size={16} />}</button></article>)}</section><div className="selection-bar"><div><b>{selected.length}</b><span>favorites selected</span></div><button disabled={!selected.length}>Send selections <Download size={15} /></button></div><footer><Logo /><span>Gallery available until 14 August 2026</span><small>Photographs © North & River Studio</small></footer>{lightbox !== null && <div className="lightbox" role="dialog" aria-modal="true"><button className="lightbox-close" onClick={() => setLightbox(null)}><X /></button><img src={gallery[lightbox]} alt={`Harper and Chen wedding photograph ${lightbox + 1}`} /><button className={selected.includes(lightbox) ? "lightbox-favorite chosen" : "lightbox-favorite"} onClick={() => toggle(lightbox)}><Heart size={17} />{selected.includes(lightbox) ? "Selected" : "Select favorite"}</button></div>}</main>;
}
