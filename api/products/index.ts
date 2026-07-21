import type { VercelRequest, VercelResponse } from '@vercel/node'
import { withSecurity, ok, fail, sanitize } from '../_lib/utils'
import { requireAdmin } from '../_lib/auth'
import { connectDB } from '../_lib/db'
import { Limiters } from '../_lib/rateLimiter'
import Product from '../_lib/Product'

export default withSecurity(async (req: VercelRequest, res: VercelResponse) => {
  await connectDB()

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'

  // ── GET /api/products — public ────────────────────────────────────────────
  if (req.method === 'GET') {
    const q      = req.query
    const page   = Math.max(1, parseInt(q['page'] as string) || 1)
    const limit  = Math.min(100, Math.max(1, parseInt(q['limit'] as string) || 24))
    const skip   = (page - 1) * limit

    const search   = (q['search']   as string)?.trim()
    const category = q['category']  as string
    const status   = q['status']    as string
    const featured = q['featured']  as string
    const sort     = q['sort']      as string

    const filter: Record<string, unknown> = {}
    const validCategories = ['Cord Sets','Dupatta Set','Kurties','Pant/Plazzo set','Short Tops']
    const validStatuses   = ['In Stock','Low Stock','Pre-Order','Out of Stock']

    if (category && validCategories.includes(category)) filter['category'] = category
    if (status   && validStatuses.includes(status))     filter['status']   = status
    if (featured === 'true')                            filter['featured'] = true
    if (search)                                         filter['$text']    = { $search: search }

    // Build sort
    type SortObj = Record<string, 1 | -1 | { $meta: string }>
    let sortObj: SortObj = { featured: -1, createdAt: -1 }
    if (search) {
      sortObj = { score: { $meta: 'textScore' } }
    } else if (sort === 'name_asc')   sortObj = { name: 1 }
    else if (sort === 'name_desc')    sortObj = { name: -1 }
    else if (sort === 'newest')       sortObj = { createdAt: -1 }
    else if (sort === 'oldest')       sortObj = { createdAt: 1 }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [products, total] = await Promise.all([
      Product.find(filter).select('-__v').sort(sortObj as any).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ])

    const formattedProducts = products.map(p => ({
      ...p,
      id: String((p as any)._id),
    }))

    ok(res, { total, page, pages: Math.ceil(total / limit), limit, products: formattedProducts })
    return
  }

  // ── POST /api/products — admin only ───────────────────────────────────────
  if (req.method === 'POST') {
    requireAdmin(req.headers['authorization'])

    const mutLimit = Limiters.mutation(ip)
    if (!mutLimit.allowed) {
      fail(res, 'Too many modification requests.', 429, { retryAfter: mutLimit.retryAfterSec })
      return
    }

    const body = sanitize(req.body as Record<string, unknown>)
    const { name, category, fabric, moq, wholesalePrice, description, src, cloudinaryPublicId, status, featured } = body

    if (!name || !category || !src) {
      fail(res, 'name, category, and src are required.', 400)
      return
    }

    const productDoc = await Product.create({
      name:               String(name).trim().slice(0, 200),
      category:           category as 'Sarees' | 'Lehengas' | 'Suits' | 'Kurtas' | 'Dupattas',
      fabric:             fabric ? String(fabric).trim().slice(0, 200) : 'Standard',
      moq:                moq              ? String(moq).trim().slice(0, 100)              : '4 Pcs',
      wholesalePrice:     wholesalePrice   ? String(wholesalePrice).trim().slice(0, 100)   : 'Quote on Request',
      description:        description      ? String(description).trim().slice(0, 2000)     : '',
      src:                String(src).trim(),
      cloudinaryPublicId: cloudinaryPublicId ? String(cloudinaryPublicId).trim()           : '',
      status:             (status || 'In Stock') as 'In Stock' | 'Low Stock' | 'Pre-Order' | 'Out of Stock',
      featured:           featured === true || featured === 'true',
    })

    const product = {
      ...productDoc.toJSON(),
      id: String(productDoc._id),
    }

    ok(res, { message: 'Product created.', product }, 201)
    return
  }

  fail(res, 'Method not allowed', 405)
})
