import type { VercelRequest, VercelResponse } from '@vercel/node'
import { withSecurity, ok, fail } from '../_lib/utils'
import { requireAdmin } from '../_lib/auth'
import { Limiters } from '../_lib/rateLimiter'
import { getCloudinary } from '../_lib/cloudinary'

export default withSecurity(async (req: VercelRequest, res: VercelResponse) => {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown'

  // ── POST /api/upload/signature ────────────────────────────────────────────
  if (req.method === 'POST') {
    requireAdmin(req.headers['authorization'])

    const uploadLimit = Limiters.upload(ip)
    if (!uploadLimit.allowed) {
      fail(res, 'Upload limit reached. Max 20 images per hour.', 429, {
        retryAfter: uploadLimit.retryAfterSec,
      })
      return
    }

    const timestamp    = Math.round(Date.now() / 1000)
    const folder       = 'jina-fashion-products'
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'jina_fashion_products'
    const cloudName    = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey       = process.env.CLOUDINARY_API_KEY

    if (!cloudName || !apiKey) {
      throw new Error('Cloudinary credentials not configured')
    }

    const cld = getCloudinary()

    const paramsToSign: Record<string, unknown> = {
      timestamp,
      folder,
      upload_preset:   uploadPreset,
      allowed_formats: 'jpg,jpeg,png,webp,avif',
      transformation:  'q_auto,f_auto',
      max_file_size:   10_485_760, // 10 MB
    }

    const signature = cld.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET as string
    )

    ok(res, { signature, timestamp, folder, uploadPreset, cloudName, apiKey })
    return
  }

  // ── DELETE /api/upload/:publicId — orphan cleanup ─────────────────────────
  if (req.method === 'DELETE') {
    requireAdmin(req.headers['authorization'])

    const uploadLimit = Limiters.upload(ip)
    if (!uploadLimit.allowed) {
      fail(res, 'Too many requests.', 429, { retryAfter: uploadLimit.retryAfterSec })
      return
    }

    const publicId = req.query['publicId'] as string
    if (!publicId?.startsWith('jina-fashion-products/')) {
      fail(res, 'Invalid public_id. Only jina-fashion-products/ assets can be deleted.', 400)
      return
    }

    const cld    = getCloudinary()
    const result = await cld.uploader.destroy(publicId)

    if (result.result !== 'ok' && result.result !== 'not found') {
      fail(res, 'Failed to delete image from Cloudinary.', 500)
      return
    }

    ok(res, { message: 'Image deleted from Cloudinary.', result })
    return
  }

  fail(res, 'Method not allowed', 405)
})
