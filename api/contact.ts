import type { VercelRequest, VercelResponse } from '@vercel/node'
import { withSecurity, ok, fail, sanitize } from './_lib/utils'
import { sendInquiryEmails } from './_lib/email'

export default withSecurity(async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    fail(res, 'Method not allowed', 405)
    return
  }

  const body = sanitize(req.body as Record<string, unknown>)
  const { name, business, phone, email, city, interest, quantity, message } = body

  if (!name || !phone || !email || !message) {
    fail(res, 'Name, Phone, Email, and Message are required.', 400)
    return
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(String(email).trim())) {
    fail(res, 'Please provide a valid email address.', 400)
    return
  }

  try {
    await sendInquiryEmails({
      name: String(name).trim(),
      business: business ? String(business).trim() : undefined,
      phone: String(phone).trim(),
      email: String(email).trim(),
      city: city ? String(city).trim() : undefined,
      interest: interest ? String(interest).trim() : undefined,
      quantity: quantity ? String(quantity).trim() : undefined,
      message: String(message).trim(),
    })

    ok(res, { message: 'Inquiry submitted successfully. We will contact you within 24 hours!' })
  } catch (err) {
    console.error('[contact] Failed to process contact request:', err)
    fail(res, 'Failed to dispatch email. Please contact us on WhatsApp directly.', 500)
  }
})
