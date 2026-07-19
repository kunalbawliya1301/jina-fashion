import type { VercelRequest, VercelResponse } from '@vercel/node'
import { withSecurity, ok, fail, sanitize } from '../_lib/utils'
import { requireAdmin } from '../_lib/auth'
import { connectDB } from '../_lib/db'
import { Limiters } from '../_lib/rateLimiter'
import { getCloudinary } from '../_lib/cloudinary'
import Product from '../_lib/Product'

export default withSecurity(async (req: VercelRequest, res: VercelResponse) => {
  await connectDB()

  const id = req.query['id'] as string
  if (!id) { fail(res, 'Product ID is required', 400); return }

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'

  // ── GET /api/products/:id — public ────────────────────────────────────────
  if (req.method === 'GET') {
    const productDoc = await Product.findById(id).lean()
    if (!productDoc) { fail(res, 'Product not found.', 404); return }
    const product = { ...productDoc, id: String(productDoc._id) }
    ok(res, { product })
    return
  }

  // ── All mutating methods require admin JWT ────────────────────────────────
  requireAdmin(req.headers['authorization'])

  const mutLimit = Limiters.mutation(ip)
  if (!mutLimit.allowed) {
    fail(res, 'Too many modification requests.', 429, { retryAfter: mutLimit.retryAfterSec })
    return
  }

  // ── PUT /api/products/:id — update ────────────────────────────────────────
  if (req.method === 'PUT') {
    const allowed = ['name','category','fabric','moq','wholesalePrice','description','src','cloudinaryPublicId','status','featured']
    const body    = sanitize(req.body as Record<string, unknown>)
    const updates: Record<string, unknown> = {}

    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key]
    }

    // Sanitize strings
    for (const key of ['name','category','fabric','moq','wholesalePrice','description','src','cloudinaryPublicId','status']) {
      if (updates[key] !== undefined) updates[key] = String(updates[key]).trim()
    }
    if (updates['featured'] !== undefined) {
      updates['featured'] = updates['featured'] === true || updates['featured'] === 'true'
    }

    const productDoc = await Product.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }).lean()
    if (!productDoc) { fail(res, 'Product not found.', 404); return }
    const product = { ...productDoc, id: String(productDoc._id) }

    ok(res, { message: 'Product updated.', product })
    return
  }

  // ── DELETE /api/products/:id — soft delete + Cloudinary cleanup ───────────
  if (req.method === 'DELETE') {
    const product = await Product.findById(id)
    if (!product) { fail(res, 'Product not found.', 404); return }

    // Delete image from Cloudinary
    if (product.cloudinaryPublicId) {
      try {
        const cld = getCloudinary()
        await cld.uploader.destroy(product.cloudinaryPublicId)
      } catch (_err) {
        console.warn('[delete] Cloudinary deletion failed for', product.cloudinaryPublicId)
      }
    }

    product.isDeleted = true
    await product.save()

    ok(res, { message: 'Product deleted successfully.' })
    return
  }

  fail(res, 'Method not allowed', 405)
})
