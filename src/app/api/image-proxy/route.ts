const allowedHosts = new Set(["images.unsplash.com", "blob.vercel-storage.com", "public.blob.vercel-storage.com"]);

export async function GET(request: Request) {
  try {
    const source = new URL(new URL(request.url).searchParams.get("url") ?? "");
    if (source.protocol !== "https:" || (!allowedHosts.has(source.hostname) && !source.hostname.endsWith(".public.blob.vercel-storage.com"))) throw new Error("Image host is not approved");
    const response = await fetch(source, { signal: AbortSignal.timeout(15_000) });
    if (!response.ok) throw new Error("Image source did not respond");
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) throw new Error("Source is not an image");
    return new Response(response.body, { headers: { "Content-Type": contentType, "Cache-Control": "public, max-age=3600" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Image unavailable" }, { status: 400 });
  }
}
