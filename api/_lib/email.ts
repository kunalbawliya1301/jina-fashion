import 'dotenv/config'
import nodemailer from 'nodemailer'

export interface ContactEmailData {
  name: string
  business?: string
  phone: string
  email: string
  city?: string
  interest?: string
  quantity?: string
  message: string
}

export async function sendInquiryEmails(data: ContactEmailData): Promise<void> {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS
  const recipient = process.env.EMAIL_TO || user || 'order.jinafashion@gmail.com'

  if (!user || !pass) {
    console.warn(`[email] EMAIL_USER (${user || 'empty'}) or EMAIL_PASS (${pass ? 'set' : 'empty'}) missing. Skipping email dispatch.`)
    throw new Error('Email credentials (EMAIL_USER/EMAIL_PASS) are not configured in environment variables.')
  }

  const cleanPass = pass.replace(/\s+/g, '').replace(/["']/g, '')

  console.log(`[email] Connecting to Gmail SMTP for user: ${user} -> sending to: ${recipient}`)

  // Create Gmail SMTP transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user.trim(),
      pass: cleanPass,
    },
  })

  // 1. Email to Store Owner / Admin
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
      <div style="text-align: center; padding-bottom: 16px; border-bottom: 2px solid #b8860b;">
        <h2 style="color: #b8860b; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">JINA FASHION</h2>
        <p style="color: #666; margin: 4px 0 0; font-size: 13px;">New Wholesale Inquiry Received</p>
      </div>

      <div style="margin-top: 20px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 10px; font-weight: bold; color: #4a5568; width: 35%;">Buyer Name:</td>
            <td style="padding: 10px; color: #1a202c;">${data.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 10px; font-weight: bold; color: #4a5568;">Business / Boutique:</td>
            <td style="padding: 10px; color: #1a202c;">${data.business || 'N/A'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 10px; font-weight: bold; color: #4a5568;">Email Address:</td>
            <td style="padding: 10px; color: #1a202c;"><a href="mailto:${data.email}" style="color: #b8860b; text-decoration: none;">${data.email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 10px; font-weight: bold; color: #4a5568;">Phone / WhatsApp:</td>
            <td style="padding: 10px; color: #1a202c;"><a href="tel:${data.phone}" style="color: #b8860b; text-decoration: none;">${data.phone}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 10px; font-weight: bold; color: #4a5568;">City / Location:</td>
            <td style="padding: 10px; color: #1a202c;">${data.city || 'N/A'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 10px; font-weight: bold; color: #4a5568;">Product Interest:</td>
            <td style="padding: 10px; color: #1a202c;"><strong>${data.interest || 'General'}</strong></td>
          </tr>
          <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 10px; font-weight: bold; color: #4a5568;">Est. Order Volume:</td>
            <td style="padding: 10px; color: #1a202c;">${data.quantity || 'N/A'}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; background-color: #f7fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #b8860b;">
          <p style="margin: 0 font-weight: bold; color: #4a5568; font-size: 13px; text-transform: uppercase;">Message / Requirements:</p>
          <p style="margin: 8px 0 0; color: #2d3748; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
        </div>
      </div>

      <div style="margin-top: 24px; text-align: center; font-size: 12px; color: #a0aec0; border-top: 1px solid #edf2f7; padding-top: 16px;">
        Sent automatically from Jina Fashion Website • Wholesale Portal
      </div>
    </div>
  `

  // 2. Auto-responder Email to Customer
  const customerHtml = `
    <div style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background-color: #ffffff;">
      <div style="text-align: center; padding-bottom: 16px; border-bottom: 2px solid #b8860b;">
        <h2 style="color: #b8860b; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px;">JINA FASHION</h2>
        <p style="color: #666; margin: 4px 0 0; font-size: 13px;">Wholesale & B2B Catalogue Services</p>
      </div>

      <div style="margin-top: 20px; font-size: 14px; line-height: 1.6; color: #2d3748;">
        <p>Dear <strong>${data.name}</strong>,</p>

        <p>Thank you for contacting <strong>Jina Fashion</strong>. We have successfully received your wholesale inquiry regarding <strong>${data.interest || 'our Catalogue'}</strong>.</p>

        <p>Our sales executive team will review your business requirements and contact you within <strong>24 business hours</strong> via phone/WhatsApp at <strong>${data.phone}</strong> with our wholesale catalogue PDF and pricing tier details.</p>

        <div style="background-color: #faf5ff; border: 1px solid #e9d8fd; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: #6b46c1;">Need Urgent Catalog Dispatch?</p>
          <p style="margin: 4px 0 0; font-size: 13px; color: #553c9a;">You can reach our sales team directly on WhatsApp or Call: <strong>+91 98765 43210</strong></p>
        </div>

        <p>Warm regards,<br><strong>Wholesale Sales Team</strong><br>Jina Fashion, Mumbai</p>
      </div>

      <div style="margin-top: 24px; text-align: center; font-size: 11px; color: #a0aec0; border-top: 1px solid #edf2f7; padding-top: 16px;">
        Jina Fashion • 402, Senapati Bapat Marg, Lower Parel, Mumbai, MH 400013
      </div>
    </div>
  `

  // Send both emails concurrently
  await Promise.all([
    transporter.sendMail({
      from: `"Jina Fashion Web" <${user}>`,
      to: recipient,
      subject: `[Wholesale Inquiry] ${data.name} (${data.interest || 'General'})`,
      html: adminHtml,
      replyTo: data.email,
    }),
    transporter.sendMail({
      from: `"Jina Fashion Wholesale" <${user}>`,
      to: data.email,
      subject: `Thank you for your inquiry - Jina Fashion Wholesale`,
      html: customerHtml,
    }),
  ])

  console.log(`[email] Inquiry email sent successfully to ${recipient} and auto-responder to ${data.email}`)
}
