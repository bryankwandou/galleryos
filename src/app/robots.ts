import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules:{userAgent:"*",allow:["/","/pricing","/privacy","/terms","/verify"],disallow:["/dashboard","/gallery/"]}, sitemap:"https://galleryos-drab.vercel.app/sitemap.xml" }; }
