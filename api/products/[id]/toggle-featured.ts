import type { VercelRequest, VercelResponse } from '@vercel/node'
import { withSecurity, ok, fail } from '../../_lib/utils'
import { requireAdmin } from '../../_lib/auth'
import { connectDB } from '../../_lib/db'
import { Limiters } from '../../_lib/rateLimiter'
import Product from '../../_lib/Product'

export default withSecurity(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'PATCH') {
    fail(res, 'Method not allowed', 405)
    return
  }

  requireAdmin(req.headers['authorization'])

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'
  const mutLimit = Limiters.mutation(ip)
  if (!mutLimit.allowed) {
    fail(res, 'Too many modification requests.', 429, { retryAfter: mutLimit.retryAfterSec })
    return
  }

  await connectDB()

  const id = req.query['id'] as string
  if (!id) { fail(res, 'Product ID is required', 400); return }

  const product = await Product.findById(id)
  if (!product) { fail(res, 'Product not found.', 404); return }

  product.featured = !product.featured
  await product.save()

  ok(res, {
    message: `Product ${product.featured ? 'featured' : 'unfeatured'}.`,
    featured: product.featured,
  })
})
