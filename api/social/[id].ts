import type { VercelRequest, VercelResponse } from '@vercel/node'
import { withSecurity, ok, fail, sanitize } from '../_lib/utils'
import { requireAdmin } from '../_lib/auth'
import { connectDB } from '../_lib/db'
import { Limiters } from '../_lib/rateLimiter'
import SocialItem from '../_lib/SocialItem'

export default withSecurity(async (req: VercelRequest, res: VercelResponse) => {
  await connectDB()

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
  const id = req.query['id'] as string

  if (!id) {
    fail(res, 'Missing item ID.', 400)
    return
  }

  // ── PUT /api/social/:id — update social item ─────────────────────────────
  if (req.method === 'PUT') {
    requireAdmin(req.headers['authorization'])

    const mutLimit = Limiters.mutation(ip)
    if (!mutLimit.allowed) {
      fail(res, 'Too many modification requests.', 429, { retryAfter: mutLimit.retryAfterSec })
      return
    }

    const body = sanitize(req.body as Record<string, unknown>)
    const updateData: Record<string, unknown> = {}

    if (body['type'])  updateData['type']  = body['type'] === 'video' ? 'video' : 'image'
    if (body['src'])   updateData['src']   = String(body['src']).trim()
    if (body['title']) updateData['title'] = String(body['title']).trim().slice(0, 300)
    if (body['link'])  updateData['link']  = String(body['link']).trim()

    const item = await SocialItem.findByIdAndUpdate(id, updateData, { new: true }).lean()

    if (!item) {
      fail(res, 'Social campaign item not found.', 404)
      return
    }

    ok(res, { message: 'Social item updated.', item: { ...item, id: String(item._id) } })
    return
  }

  // ── DELETE /api/social/:id — delete social item ──────────────────────────
  if (req.method === 'DELETE') {
    requireAdmin(req.headers['authorization'])

    const mutLimit = Limiters.mutation(ip)
    if (!mutLimit.allowed) {
      fail(res, 'Too many modification requests.', 429, { retryAfter: mutLimit.retryAfterSec })
      return
    }

    const item = await SocialItem.findByIdAndUpdate(id, { isDeleted: true }, { new: true })

    if (!item) {
      fail(res, 'Social campaign item not found.', 404)
      return
    }

    ok(res, { message: 'Social item deleted.' })
    return
  }

  fail(res, 'Method not allowed', 405)
})
