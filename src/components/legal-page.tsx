import Link from "next/link";
import { Logo } from "./logo";
export function LegalPage({title,intro,sections}:{title:string;intro:string;sections:{title:string;body:string}[]}){return <main className="simple-page"><nav className="nav shell"><Logo/><Link href="/">Back home</Link></nav><article className="legal"><span>Last updated 24 July 2026</span><h1>{title}</h1><p className="legal-intro">{intro}</p>{sections.map(section=><section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}</article></main>}
