type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const ipMap = new Map<string, RateLimitEntry>();

export function rateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = ipMap.get(identifier);

  if (existing && existing.resetAt < now) {
    ipMap.delete(identifier);
  }

  const entry = ipMap.get(identifier);

  if (!entry) {
    const resetAt = now + windowMs;
    ipMap.set(identifier, { count: 1, resetAt });
    return { success: true, remaining: maxRequests - 1, resetAt };
  }

  if (entry.count >= maxRequests) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count++;
  return { success: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? null;
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}
