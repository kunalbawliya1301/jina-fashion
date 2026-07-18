/**
 * Lightweight in-memory rate limiter for Vercel Serverless Functions.
 *
 * ⚠ Serverless caveat: each function instance has its own memory — the counter
 * resets on cold starts. For strict production rate-limiting, use Upstash Redis.
 * For this project's scale (single admin, low traffic), in-memory is sufficient.
 */

interface Entry {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  retryAfterSec: number
}

export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  let entry = store.get(key)

  // Expired window — reset
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + windowMs }
  }

  entry.count++
  store.set(key, entry)

  const remaining = Math.max(0, max - entry.count)
  const retryAfterSec = Math.ceil((entry.resetAt - now) / 1000)

  return {
    allowed: entry.count <= max,
    remaining,
    retryAfterSec,
  }
}

/** Pre-configured limiters */
export const Limiters = {
  global:   (ip: string) => checkRateLimit(`global:${ip}`,  200, 15 * 60 * 1000),
  login:    (ip: string) => checkRateLimit(`login:${ip}`,     5, 15 * 60 * 1000),
  upload:   (ip: string) => checkRateLimit(`upload:${ip}`,   20, 60 * 60 * 1000),
  mutation: (ip: string) => checkRateLimit(`mutation:${ip}`, 60, 15 * 60 * 1000),
}
