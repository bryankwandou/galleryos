import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap { const base="https://galleryos-drab.vercel.app"; return ["","/pricing","/privacy","/terms","/verify"].map(path=>({url:`${base}${path}`,lastModified:new Date(),changeFrequency:path?"monthly":"weekly",priority:path?0.7:1})); }
