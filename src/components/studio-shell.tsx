"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Check, ChevronDown, CircleDollarSign, Clock3, Images, LayoutDashboard, LockKeyhole, Menu, Search, Settings, Sparkles, Upload, Users, X } from "lucide-react";
import { bookings } from "@/lib/demo-data";
import type { StudioImage, VisionCullResult } from "@/lib/types";
import { Logo } from "./logo";
import { AiCullAgent } from "./ai-cull-agent";
import { WalletControl, type WalletProof } from "./wallet-control";

const initialImages: StudioImage[] = [
  { id: "01", name: "HC_1482.jpg", url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=85", flag: "keep", reason: "Clear expression and sharp focus", included: true },
  { id: "02", name: "HC_1491.jpg", url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=85", flag: "review", reason: "Very similar framing to HC_1490", included: true },
  { id: "03", name: "HC_1510.jpg", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=85", flag: "remove", reason: "Possible blink on primary subject", included: true },
  { id: "04", name: "HC_1538.jpg", url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=85", flag: "keep", reason: "Distinct moment and balanced exposure", included: true },
  { id: "05", name: "HC_1604.jpg", url: "https://images.unsplash.com/photo-1460364157752-926555421a7e?auto=format&fit=crop&w=900&q=85", flag: "review", reason: "Minor motion softness around hands", included: true },
  { id: "06", name: "HC_1672.jpg", url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=900&q=85", flag: "remove", reason: "Near-duplicate with weaker expression", included: true },
];

const statuses = ["All", "Booked", "Culling", "Proofing", "Delivered"];

export function StudioShell() {
  const [active, setActive] = useState("Overview");
  const [filter, setFilter] = useState("All");
  const [images, setImages] = useState(initialImages);
  const [notice, setNotice] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletProof, setWalletProof] = useState<WalletProof | null>(null);
  const [anchorUrl, setAnchorUrl] = useState("");
  const [systemStatus, setSystemStatus] = useState<{ aiAgent: boolean; walletVerification: boolean; solana: { rpcHealthy: boolean; anchoringEnabled: boolean } } | null>(null);

  useEffect(() => { fetch("/api/status").then((response) => response.json()).then(setSystemStatus).catch(() => setSystemStatus(null)); }, []);

  const visibleBookings = useMemo(() => filter === "All" ? bookings : bookings.filter((booking) => booking.status === filter), [filter]);
  const excludedCount = images.filter((image) => !image.included).length;

  function decideImage(id: string, included: boolean) {
    setImages((current) => current.map((image) => image.id === id ? { ...image, included } : image));
  }

  function applyAnalysis(id: string, result: VisionCullResult) {
    setImages((current) => current.map((image) => image.id === id ? { ...image, flag: result.decision, reason: result.visibleReason } : image));
    setNotice(`Live AI suggestion applied to ${images.find((image) => image.id === id)?.name}. Inclusion still requires your decision.`);
  }

  function addLocalImage(image: StudioImage) {
    setImages((current) => [...current, image]);
    setNotice(`${image.name} loaded locally. Its pixels stay in this browser while technical metrics are measured.`);
  }

  async function publishGallery() {
    setNotice("Anchoring the approved gallery manifest to Solana devnet…");
    try {
      if (!walletProof) throw new Error("Verify the studio wallet in Clients before publishing a devnet proof.");
      const response = await fetch("/api/proofs/workflow", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ bookingId: "harper-chen", includedImageIds: images.filter((image) => image.included).map((image) => image.id), excludedImageIds: images.filter((image) => !image.included).map((image) => image.id) }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setAnchorUrl(result.anchor.explorerUrl ?? "");
      setNotice(result.anchor.mode === "anchored" ? `Gallery manifest anchored on Solana devnet with ${images.length - excludedCount} included photographs.` : "Gallery manifest prepared, but the devnet signer is not configured.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Unable to prepare gallery"); }
  }

  return (
    <div className="studio-app">
      <aside className={menuOpen ? "sidebar sidebar-open" : "sidebar"}>
        <div className="sidebar-head"><Logo dark /><button className="mobile-close" onClick={() => setMenuOpen(false)}><X size={18} /></button></div>
        <div className="workspace"><span className="avatar">NR</span><div><b>North & River</b><small>Studio workspace</small></div><ChevronDown size={14} /></div>
        <nav className="side-nav">
          {[{name:"Overview",icon:LayoutDashboard},{name:"Bookings",icon:CalendarDays},{name:"Cull review",icon:Sparkles},{name:"Galleries",icon:Images},{name:"Clients",icon:Users}].map(({name,icon:Icon}) => (
            <button key={name} className={active === name ? "active" : ""} onClick={() => { setActive(name); setMenuOpen(false); }}><Icon size={17} />{name}{name === "Cull review" && <span>12</span>}</button>
          ))}
        </nav>
        <div className="sidebar-bottom"><button><Settings size={17} />Settings</button><div className="user-row"><span className="avatar pale">MH</span><div><b>Mara Holt</b><small>Studio owner</small></div></div></div>
      </aside>

      <div className="studio-main">
        <header className="topbar"><button className="menu-button" onClick={() => setMenuOpen(true)}><Menu size={20} /></button><div className="search"><Search size={16} /><input aria-label="Search" placeholder="Search bookings and clients" /><kbd>⌘ K</kbd></div><div className="top-actions">{systemStatus && <div className="live-status"><span className={systemStatus.aiAgent ? "online" : ""}>AI</span><span className={systemStatus.solana.rpcHealthy && systemStatus.solana.anchoringEnabled ? "online" : ""}>Devnet</span><span className={systemStatus.walletVerification ? "online" : ""}>Wallet</span></div>}<button className="icon-button"><Clock3 size={17} /></button><button className="studio-button"><Upload size={15} /> Upload shoot</button></div></header>
        {active === "Cull review" ? (
          <CullReview images={images} excludedCount={excludedCount} onDecision={decideImage} onAnalysis={applyAnalysis} onLocalImage={addLocalImage} onPublish={publishGallery} notice={notice} anchorUrl={anchorUrl} />
        ) : active === "Galleries" ? (
          <GalleryManager images={images} onPublish={publishGallery} notice={notice} anchorUrl={anchorUrl} />
        ) : active === "Clients" ? (
          <IdentityWorkspace onVerified={setWalletProof} walletProof={walletProof} />
        ) : (
          <Overview filter={filter} setFilter={setFilter} visibleBookings={visibleBookings} onCull={() => setActive("Cull review")} />
        )}
      </div>
    </div>
  );
}

function Overview({ filter, setFilter, visibleBookings, onCull }: { filter: string; setFilter: (value: string) => void; visibleBookings: typeof bookings; onCull: () => void }) {
  return <main className="studio-content">
    <div className="page-title"><div><span>Thursday, 24 July</span><h1>Good morning, Mara.</h1><p>Three galleries need your attention this week.</p></div><button className="studio-button">New booking <span>+</span></button></div>
    <section className="stat-grid">
      <article><div><span>Active bookings</span><b>12</b></div><CalendarDays /><small><i>+2</i> from last month</small></article>
      <article><div><span>Awaiting review</span><b>3</b></div><Sparkles /><small>684 frames in the queue</small></article>
      <article><div><span>Revenue booked</span><b>$18.4k</b></div><CircleDollarSign /><small><i>+14%</i> month over month</small></article>
      <article><div><span>Average turnaround</span><b>6.2d</b></div><Clock3 /><small>1.8 days faster this season</small></article>
    </section>
    <section className="attention-card"><div className="attention-image" /><div className="attention-copy"><span className="kicker">Needs your eye</span><h2>Harper & Chen</h2><p>684 photographs are processed. Twelve suggestions need a closer look before the gallery can move forward.</p><div className="progress"><i style={{width:"72%"}} /></div><small>172 of 184 selects confirmed</small></div><button onClick={onCull}>Continue review <ArrowUpRight size={15} /></button></section>
    <section className="bookings-section"><div className="section-row"><div><h2>Booking pipeline</h2><p>Every active job, from first call to final files.</p></div><div className="filters">{statuses.map((status) => <button key={status} className={filter === status ? "active" : ""} onClick={() => setFilter(status)}>{status}</button>)}</div></div>
      <div className="booking-table"><div className="table-head"><span>Client</span><span>Event date</span><span>Status</span><span>Images</span><span>Value</span></div>{visibleBookings.map((booking) => <div className="table-row" key={booking.id}><div><span className="client-avatar">{booking.client.slice(0,2).toUpperCase()}</span><div><b>{booking.client}</b><small>{booking.event}</small></div></div><span>{booking.date}</span><span><i className={`status status-${booking.status.toLowerCase()}`} />{booking.status}</span><span>{booking.imageCount || "—"}</span><span>${booking.value.toLocaleString()}</span></div>)}</div>
    </section>
  </main>;
}

function CullReview({ images, excludedCount, onDecision, onAnalysis, onLocalImage, onPublish, notice, anchorUrl }: { images: StudioImage[]; excludedCount: number; onDecision: (id: string, included: boolean) => void; onAnalysis: (id: string, result: VisionCullResult) => void; onLocalImage: (image: StudioImage) => void; onPublish: () => void; notice: string; anchorUrl: string }) {
  return <main className="studio-content">
    <div className="page-title compact"><div><span>Harper & Chen · City hall wedding</span><h1>Cull review</h1><p>Suggestions are guidance only. Nothing leaves the gallery until you confirm it.</p></div><button className="studio-button" onClick={onPublish}>Prepare gallery <ArrowUpRight size={15} /></button></div>
    {notice && <div className="notice"><Check size={16} />{notice}{anchorUrl && <Link href={`/verify?signature=${encodeURIComponent(anchorUrl.split("/tx/")[1]?.split("?")[0] ?? "")}`}>Verify proof</Link>}</div>}
    <AiCullAgent images={images} onApply={onAnalysis} onLocalImage={onLocalImage} />
    <div className="review-summary"><div><b>{images.length}</b><span>Frames sampled</span></div><div><b>{images.filter(i => i.flag === "review").length}</b><span>Need judgment</span></div><div><b>{excludedCount}</b><span>Confirmed out</span></div><div className="review-legend"><span><i className="dot keep" />Keep</span><span><i className="dot review" />Review</span><span><i className="dot remove" />Likely out</span></div></div>
    <div className="cull-grid">{images.map((image) => <article className={!image.included ? "cull-card excluded" : "cull-card"} key={image.id}><div className="cull-photo" style={{backgroundImage:`url(${image.url})`}}><span className={`flag ${image.flag}`}>{image.flag}</span>{!image.included && <div className="excluded-label">Excluded</div>}</div><div className="cull-meta"><div><b>{image.name}</b><p>{image.reason}</p></div><div className="decision-buttons"><button aria-label={`Include ${image.name}`} className={image.included ? "selected" : ""} onClick={() => onDecision(image.id, true)}><Check size={15} /></button><button aria-label={`Exclude ${image.name}`} className={!image.included ? "selected reject" : ""} onClick={() => onDecision(image.id, false)}><X size={15} /></button></div></div></article>)}</div>
  </main>;
}

function GalleryManager({ images, onPublish, notice, anchorUrl }: { images: StudioImage[]; onPublish: () => void; notice: string; anchorUrl: string }) {
  const included = images.filter((image) => image.included);
  return <main className="studio-content"><div className="page-title compact"><div><span>Harper & Chen · Draft</span><h1>Gallery builder</h1><p>Review the client-facing sequence before publishing.</p></div><button className="studio-button" onClick={onPublish}>Publish with proof <ArrowUpRight size={15} /></button></div>{notice && <div className="notice"><Check size={16} />{notice}{anchorUrl && <Link href={`/verify?signature=${encodeURIComponent(anchorUrl.split("/tx/")[1]?.split("?")[0] ?? "")}`}>Verify proof</Link>}</div>}<div className="builder"><aside><h3>Gallery details</h3><label>Gallery title<input defaultValue="Harper & Chen" /></label><label>Subtitle<input defaultValue="New York · July 2026" /></label><label>Download access<select defaultValue="14"><option value="7">7 days</option><option value="14">14 days</option><option value="30">30 days</option></select></label><div className="secure-note"><LockKeyhole size={15} />Private token access</div></aside><section><div className="client-preview-head"><div className="monogram">H+C</div><div><span>North & River</span><h2>Harper & Chen</h2><p>New York · July 2026</p></div><Link href="/gallery/harper-chen" target="_blank">Open client view <ArrowUpRight size={14} /></Link></div><div className="builder-grid">{included.map(image => <div key={image.id} style={{backgroundImage:`url(${image.url})`}} />)}</div></section></div></main>;
}

function IdentityWorkspace({ onVerified, walletProof }: { onVerified: (proof: WalletProof) => void; walletProof: WalletProof | null }) {
  return <main className="studio-content"><div className="page-title compact"><div><span>Trust and provenance</span><h1>Studio identity</h1><p>Prove control of a Solana wallet and anchor gallery approvals on devnet.</p></div></div><div className="identity-grid"><WalletControl onVerified={onVerified} /><section className="proof-explainer"><span>What this proves</span><h2>Signed by the studio.<br />Visible to anyone.</h2><p>The wallet signs a short challenge locally. GalleryOS verifies the Ed25519 signature, checks the wallet against Solana devnet, then writes only an evidence digest through the Memo program.</p><ol><li><b>1</b> Wallet ownership signature</li><li><b>2</b> Devnet balance lookup</li><li><b>3</b> Immutable gallery digest</li></ol>{walletProof?.explorerUrl && <a href={walletProof.explorerUrl} target="_blank" rel="noreferrer">Inspect the latest proof <ArrowUpRight size={14} /></a>}</section></div></main>;
}
