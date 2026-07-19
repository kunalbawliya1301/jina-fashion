import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Limiters } from './rateLimiter'

/** Vercel serverless handler type */
export type Handler = (req: VercelRequest, res: VercelResponse) => Promise<void> | void

interface AppError extends Error {
  statusCode?: number
  code?: string
}

/**
 * Sends a success JSON response.
 */
export function ok(res: VercelResponse, data: Record<string, unknown>, status = 200): void {
  res.status(status).json({ success: true, ...data })
}

/**
 * Sends an error JSON response.
 */
export function fail(res: VercelResponse, message: string, status = 500, extra?: Record<string, unknown>): void {
  // In production, never leak internal messages for 5xx errors
  // Always show message so clients can display meaningful errors
  res.status(status).json({ success: false, message, ...extra })
}

/**
 * Wraps a serverless handler with:
 * - Security headers (basic helmet-equivalent)
 * - Global rate limiting
 * - Centralized error handling
 */
export function withSecurity(
  handler: Handler,
  options?: { skipRateLimit?: boolean }
): Handler {
  return async (req, res) => {
    // ── Security headers ──────────────────────────────────────────────────
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

    // ── CORS ──────────────────────────────────────────────────────────────
    // Allow: configured origins + any Vercel preview/production URL
    const configuredOrigins = (process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .map(o => o.trim())
      .filter(Boolean)

    const origin = req.headers['origin'] as string | undefined
    const isAllowed =
      !origin ||
      origin.includes('localhost') ||
      origin.endsWith('.vercel.app') ||
      configuredOrigins.includes(origin)

    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*')
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    res.setHeader('Access-Control-Max-Age', '86400')
    res.setHeader('Vary', 'Origin')

    if (req.method === 'OPTIONS') {
      res.status(204).end()
      return
    }

    // ── Global rate limit ─────────────────────────────────────────────────
    if (!options?.skipRateLimit) {
      const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
      const result = Limiters.global(ip)
      res.setHeader('RateLimit-Limit', '200')
      res.setHeader('RateLimit-Remaining', String(result.remaining))
      if (!result.allowed) {
        fail(res, 'Too many requests. Please try again in 15 minutes.', 429, { retryAfter: result.retryAfterSec })
        return
      }
    }

    // ── Run handler with error catch ───────────────────────────────────────
    try {
      await handler(req, res)
    } catch (err) {
      const e = err as AppError
      const status = e.statusCode || 500
      const isDev = process.env.NODE_ENV !== 'production'
      console.error(`[${req.method}] ${req.url} → ${status}:`, e.message)
      fail(res, e.message || 'Unexpected error', status, {
        ...(e.code ? { code: e.code } : {}),
        ...(isDev && status >= 500 ? { stack: e.stack } : {}),
      })
    }
  }
}

/**
 * Strips MongoDB injection operators from an object recursively.
 * Lightweight replacement for express-mongo-sanitize in serverless context.
 */
export function sanitize<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) return obj
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (key.startsWith('$') || key.includes('.')) continue // drop dangerous keys
    result[key] = typeof value === 'object' ? sanitize(value) : value
  }
  return result as T
}
