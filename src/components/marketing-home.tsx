"use client";

import { motion } from "motion/react";
import { ArrowRight, Check, ChevronRight, Clock3, Eye, Images, LockKeyhole, Sparkles } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";

const photos = [
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=85",
];

export function MarketingHome() {
  return (
    <main className="marketing">
      <nav className="nav shell">
        <Logo />
        <div className="nav-links"><a href="#workflow">Workflow</a><a href="#features">Features</a><Link href="/verify">Verify proof</Link><Link href="/pricing">Pricing</Link></div>
        <div className="nav-actions"><Link href="/dashboard">Sign in</Link><Link className="button button-dark" href="/dashboard">Open the studio <ArrowRight size={15} /></Link></div>
      </nav>

      <section className="hero shell">
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
          <div className="eyebrow"><Sparkles size={14} /> Built for working photographers</div>
          <h1>Your best frames,<br /><em>ready sooner.</em></h1>
          <p>Move from a full memory card to a polished client gallery without losing your judgment—or your weekend.</p>
          <div className="hero-actions"><Link className="button button-accent" href="/dashboard">Start a gallery <ArrowRight size={16} /></Link><a className="text-link" href="#workflow">See the workflow <ChevronRight size={15} /></a></div>
          <div className="hero-note"><Check size={14} /> Nothing is removed without your approval</div>
        </motion.div>

        <motion.div className="gallery-frame" initial={{ opacity: 0, scale: .96, rotate: 1.2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: .85, delay: .15 }} whileHover={{ y: -5 }}>
          <div className="gallery-top"><span>H + C</span><div>Harper & Chen <small>New York · July 2026</small></div><button>♡</button></div>
          <div className="photo-mosaic">
            {photos.map((photo, index) => <div key={photo} className={`photo photo-${index + 1}`} style={{ backgroundImage: `url(${photo})` }} />)}
          </div>
          <div className="floating-card"><span className="pulse-dot" /><div><b>Gallery ready</b><small>184 photographs · 6 min ago</small></div></div>
        </motion.div>
      </section>

      <section className="signal-strip"><div className="shell signals"><span><b>684</b> frames reviewed</span><span><b>2h 14m</b> estimated time saved</span><span><b>184</b> final selects</span><span><b>0</b> automatic deletions</span></div></section>

      <section id="workflow" className="section shell">
        <div className="section-heading"><div><span className="kicker">A shorter path to done</span><h2>Keep the craft.<br />Cut the busywork.</h2></div><p>GalleryOS handles the repetitive passes while every final call stays exactly where it belongs: with you.</p></div>
        <div className="steps">
          <article><span>01</span><Images /><h3>Bring in the shoot</h3><p>Upload JPEG exports securely. Browsing-ready previews are prepared away from your originals.</p></article>
          <article><span>02</span><Eye /><h3>Review the shortlist</h3><p>See likely blinks, blur, and near-duplicates with a plain-language reason beside every suggestion.</p></article>
          <article><span>03</span><Sparkles /><h3>Publish beautifully</h3><p>Shape the sequence, add your studio identity, then share a private gallery clients enjoy opening.</p></article>
        </div>
      </section>

      <section id="features" className="feature-section">
        <div className="shell feature-grid">
          <div className="feature-title"><span className="kicker light">One calm workspace</span><h2>From booking<br />to final delivery.</h2><p>No mystery scores. No irreversible automation. Just a clear studio workflow.</p><Link href="/dashboard">Explore the studio <ArrowRight size={16} /></Link></div>
          <div className="feature-card"><Eye /><h3>Explainable culling</h3><p>Every flag includes a visible reason you can accept or override.</p><div className="reason-chip">Possible blink · subject 2</div></div>
          <div className="feature-card"><LockKeyhole /><h3>Private by default</h3><p>Token-gated galleries and expiring delivery access keep client work controlled.</p><div className="security-line"><span>Client gallery</span><b>Protected</b></div></div>
          <div className="feature-card wide"><Clock3 /><div><h3>A studio-wide view</h3><p>See what is booked, waiting, proofing, and delivered without rebuilding the story in a spreadsheet.</p></div><div className="mini-pipeline"><i style={{width:"82%"}} /><i style={{width:"58%"}} /><i style={{width:"36%"}} /></div></div>
        </div>
      </section>

      <section className="quote-section shell"><blockquote>“The goal is not to let software choose your work. It is to help you reach the choices that matter.”</blockquote><span>Our product principle</span></section>
      <section className="cta shell"><div><span className="kicker">Your next gallery</span><h2>Give the work<br /><em>a better ending.</em></h2></div><div><p>Start with a real shoot. Keep full control from first pass to final download.</p><Link className="button button-accent" href="/dashboard">Open GalleryOS <ArrowRight size={16} /></Link></div></section>
      <footer className="footer shell"><Logo /><p>Thoughtful tools for independent photography studios.</p><div><Link href="/pricing">Pricing</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><small>© 2026 GalleryOS</small></footer>
    </main>
  );
}
