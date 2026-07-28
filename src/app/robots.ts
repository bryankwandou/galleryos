import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules:{userAgent:"*",allow:["/","/pricing","/privacy","/terms"],disallow:["/dashboard","/gallery/"]}, sitemap:"https://galleryos.vercel.app/sitemap.xml" }; }
