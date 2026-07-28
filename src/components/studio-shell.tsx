"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Check, ChevronDown, CircleDollarSign, Clock3, Images, LayoutDashboard, LockKeyhole, Menu, Search, Settings, Sparkles, Upload, Users, X } from "lucide-react";
import { bookings } from "@/lib/demo-data";
import type { CullFlag, StudioImage } from "@/lib/types";
import { Logo } from "./logo";

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

  const visibleBookings = useMemo(() => filter === "All" ? bookings : bookings.filter((booking) => booking.status === filter), [filter]);
  const excludedCount = images.filter((image) => !image.included).length;

  function decideImage(id: string, included: boolean) {
    setImages((current) => current.map((image) => image.id === id ? { ...image, included } : image));
  }

  function publishGallery() {
    setNotice(`Gallery preview prepared with ${images.length - excludedCount} photographs. Connect storage before live publishing.`);
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
        <header className="topbar"><button className="menu-button" onClick={() => setMenuOpen(true)}><Menu size={20} /></button><div className="search"><Search size={16} /><input aria-label="Search" placeholder="Search bookings and clients" /><kbd>⌘ K</kbd></div><div className="top-actions"><button className="icon-button"><Clock3 size={17} /></button><button className="studio-button"><Upload size={15} /> Upload shoot</button></div></header>
        {active === "Cull review" ? (
          <CullReview images={images} excludedCount={excludedCount} onDecision={decideImage} onPublish={publishGallery} notice={notice} />
        ) : active === "Galleries" ? (
          <GalleryManager images={images} onPublish={publishGallery} notice={notice} />
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

function CullReview({ images, excludedCount, onDecision, onPublish, notice }: { images: StudioImage[]; excludedCount: number; onDecision: (id: string, included: boolean) => void; onPublish: () => void; notice: string }) {
  return <main className="studio-content">
    <div className="page-title compact"><div><span>Harper & Chen · City hall wedding</span><h1>Cull review</h1><p>Suggestions are guidance only. Nothing leaves the gallery until you confirm it.</p></div><button className="studio-button" onClick={onPublish}>Prepare gallery <ArrowUpRight size={15} /></button></div>
    {notice && <div className="notice"><Check size={16} />{notice}</div>}
    <div className="review-summary"><div><b>{images.length}</b><span>Frames sampled</span></div><div><b>{images.filter(i => i.flag === "review").length}</b><span>Need judgment</span></div><div><b>{excludedCount}</b><span>Confirmed out</span></div><div className="review-legend"><span><i className="dot keep" />Keep</span><span><i className="dot review" />Review</span><span><i className="dot remove" />Likely out</span></div></div>
    <div className="cull-grid">{images.map((image) => <article className={!image.included ? "cull-card excluded" : "cull-card"} key={image.id}><div className="cull-photo" style={{backgroundImage:`url(${image.url})`}}><span className={`flag ${image.flag}`}>{image.flag}</span>{!image.included && <div className="excluded-label">Excluded</div>}</div><div className="cull-meta"><div><b>{image.name}</b><p>{image.reason}</p></div><div className="decision-buttons"><button aria-label={`Include ${image.name}`} className={image.included ? "selected" : ""} onClick={() => onDecision(image.id, true)}><Check size={15} /></button><button aria-label={`Exclude ${image.name}`} className={!image.included ? "selected reject" : ""} onClick={() => onDecision(image.id, false)}><X size={15} /></button></div></div></article>)}</div>
  </main>;
}

function GalleryManager({ images, onPublish, notice }: { images: StudioImage[]; onPublish: () => void; notice: string }) {
  const included = images.filter((image) => image.included);
  return <main className="studio-content"><div className="page-title compact"><div><span>Harper & Chen · Draft</span><h1>Gallery builder</h1><p>Review the client-facing sequence before publishing.</p></div><button className="studio-button" onClick={onPublish}>Publish privately <ArrowUpRight size={15} /></button></div>{notice && <div className="notice"><Check size={16} />{notice}</div>}<div className="builder"><aside><h3>Gallery details</h3><label>Gallery title<input defaultValue="Harper & Chen" /></label><label>Subtitle<input defaultValue="New York · July 2026" /></label><label>Download access<select defaultValue="14"><option value="7">7 days</option><option value="14">14 days</option><option value="30">30 days</option></select></label><div className="secure-note"><LockKeyhole size={15} />Private token access</div></aside><section><div className="client-preview-head"><div className="monogram">H+C</div><div><span>North & River</span><h2>Harper & Chen</h2><p>New York · July 2026</p></div><Link href="/gallery/harper-chen" target="_blank">Open client view <ArrowUpRight size={14} /></Link></div><div className="builder-grid">{included.map(image => <div key={image.id} style={{backgroundImage:`url(${image.url})`}} />)}</div></section></div></main>;
}
