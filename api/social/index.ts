import type { VercelRequest, VercelResponse } from '@vercel/node'
import { withSecurity, ok, fail, sanitize } from '../_lib/utils'
import { requireAdmin } from '../_lib/auth'
import { connectDB } from '../_lib/db'
import { Limiters } from '../_lib/rateLimiter'
import SocialItem from '../_lib/SocialItem'

export default withSecurity(async (req: VercelRequest, res: VercelResponse) => {
  await connectDB()

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'

  // ── GET /api/social — public ────────────────────────────────────────────
  if (req.method === 'GET') {
    const items = await SocialItem.find().sort({ createdAt: -1 }).lean()

    const formatted = items.map(item => ({
      ...item,
      id: String((item as any)._id || (item as any).id),
    }))

    ok(res, { success: true, items: formatted })
    return
  }

  // ── POST /api/social — admin only ───────────────────────────────────────
  if (req.method === 'POST') {
    requireAdmin(req.headers['authorization'])

    const mutLimit = Limiters.mutation(ip)
    if (!mutLimit.allowed) {
      fail(res, 'Too many requests.', 429, { retryAfter: mutLimit.retryAfterSec })
      return
    }

    const body = sanitize(req.body as Record<string, unknown>)
    const { type, src, title, link } = body

    if (!type || !src) {
      fail(res, 'type and src are required.', 400)
      return
    }

    const itemDoc = await SocialItem.create({
      type: (type === 'video' ? 'video' : 'image') as 'image' | 'video',
      src: String(src).trim(),
      title: title ? String(title).trim().slice(0, 300) : 'Campaign Spread',
      link: link ? String(link).trim() : 'https://www.instagram.com/_jina_fashion',
    })

    const item = {
      ...itemDoc.toJSON(),
      id: String(itemDoc._id),
    }

    ok(res, { message: 'Social campaign item created.', item }, 201)
    return
  }

  // ── DELETE /api/social — clear all social items (admin only) ─────────────
  if (req.method === 'DELETE') {
    requireAdmin(req.headers['authorization'])

    const mutLimit = Limiters.mutation(ip)
    if (!mutLimit.allowed) {
      fail(res, 'Too many requests.', 429, { retryAfter: mutLimit.retryAfterSec })
      return
    }

    await SocialItem.deleteMany({})
    ok(res, { message: 'All social campaign items cleared.' })
    return
  }

  fail(res, 'Method not allowed', 405)
})
