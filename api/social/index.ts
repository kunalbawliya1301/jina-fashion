import type { VercelRequest, VercelResponse } from '@vercel/node'
import { withSecurity, ok, fail, sanitize } from '../_lib/utils'
import { requireAdmin } from '../_lib/auth'
import { connectDB } from '../_lib/db'
import { Limiters } from '../_lib/rateLimiter'
import SocialItem from '../_lib/SocialItem'

const DEFAULT_ITEMS = [
  {
    type: 'image',
    src: '/Category/Cord Sets.png',
    title: 'Silk Sarees Campaign Reel',
    link: 'https://www.instagram.com/_jina_fashion',
  },
  {
    type: 'video',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    title: 'Bridal Lehenga Lookbook Reel',
    link: 'https://www.instagram.com/_jina_fashion',
  },
  {
    type: 'image',
    src: '/Category/Dupatta Set.png',
    title: 'Festive Dupatta Drop',
    link: 'https://www.instagram.com/_jina_fashion',
  },
  {
    type: 'video',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    title: 'Summer Cord Sets Showcase',
    link: 'https://www.instagram.com/_jina_fashion',
  },
  {
    type: 'image',
    src: '/Category/Kurties.png',
    title: 'Designer Kurti Edit',
    link: 'https://www.instagram.com/_jina_fashion',
  },
  {
    type: 'image',
    src: '/Category/Short Tops.png',
    title: 'Royal Ethnic Showcase',
    link: 'https://www.instagram.com/_jina_fashion',
  },
]

export default withSecurity(async (req: VercelRequest, res: VercelResponse) => {
  await connectDB()

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'

  // ── GET /api/social — public ────────────────────────────────────────────
  if (req.method === 'GET') {
    let items = await SocialItem.find().sort({ createdAt: -1 }).lean()

    // Purge legacy mixkit URLs if present in database
    const hasMixkit = items.some(i => i.src?.includes('mixkit.co'))
    if (hasMixkit) {
      await SocialItem.deleteMany({ src: /mixkit\.co/ })
      items = await SocialItem.find().sort({ createdAt: -1 }).lean()
    }

    if (items.length === 0) {
      try {
        const seeded = await SocialItem.insertMany(DEFAULT_ITEMS)
        items = seeded.map(doc => doc.toJSON())
      } catch (err) {
        console.error('[social] Failed to seed default items:', err)
      }
    }

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

  fail(res, 'Method not allowed', 405)
})
