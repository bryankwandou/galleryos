const buckets = new Map<string, { count: number; resetAt: number }>();

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const forwardedHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !forwardedHost || new URL(origin).host !== forwardedHost) throw new Error("Cross-origin request rejected");
}

export function assertRateLimit(request: Request, scope: string, limit: number, windowMs: number) {
  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = `${scope}:${address}`;
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  if (current.count >= limit) throw new Error("Rate limit exceeded; try again later");
  current.count += 1;
}
