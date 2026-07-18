import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import { withSecurity, ok, fail, sanitize } from '../_lib/utils'
import { Limiters } from '../_lib/rateLimiter'
import { signToken } from '../_lib/auth'

export default withSecurity(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    fail(res, 'Method not allowed', 405)
    return
  }

  // ── Strict login rate limit (5 attempts / 15 min per IP) ──────────────────
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
  const limit = Limiters.login(ip)
  res.setHeader('RateLimit-Limit', '5')
  res.setHeader('RateLimit-Remaining', String(limit.remaining))

  if (!limit.allowed) {
    fail(res, 'Too many login attempts. Account locked for 15 minutes.', 429, {
      retryAfter: limit.retryAfterSec,
    })
    return
  }

  // ── Parse + sanitize body ─────────────────────────────────────────────────
  const body = sanitize(req.body as Record<string, unknown>)
  const { email, password } = body as { email?: unknown; password?: unknown }

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    fail(res, 'Email and password are required.', 400)
    return
  }

  const emailTrimmed = email.trim().toLowerCase()

  // Length guard (DoS prevention)
  if (emailTrimmed.length > 254 || password.length > 128) {
    fail(res, 'Invalid credentials.', 401)
    return
  }

  const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').toLowerCase()
  const ADMIN_HASH  = process.env.ADMIN_PASSWORD_HASH || ''

  if (!ADMIN_EMAIL || !ADMIN_HASH) {
    throw new Error('Admin credentials are not configured in environment variables')
  }

  // ── Constant-time comparison (prevents timing side-channel on email) ───────
  // We ALWAYS run bcrypt.compare even if email is wrong, so response time is
  // indistinguishable whether the email matched or not.
  const emailMatch    = emailTrimmed === ADMIN_EMAIL
  const passwordMatch = await bcrypt.compare(password, ADMIN_HASH)

  if (!emailMatch || !passwordMatch) {
    // Generic message — never reveal which field was wrong
    fail(res, 'Invalid administrator credentials.', 401)
    return
  }

  const token = signToken()
  ok(res, {
    message: 'Admin authenticated successfully.',
    token,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  })
})
