import 'dotenv/config'
import nodemailer from 'nodemailer'

async function testEmail() {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS
  const recipient = process.env.EMAIL_TO || user

  console.log('🔍 Testing Nodemailer setup...')
  console.log('• EMAIL_USER:', user)
  console.log('• EMAIL_PASS:', pass ? `(Length ${pass.length})` : 'MISSING')
  console.log('• EMAIL_TO:', recipient)

  if (!user || !pass) {
    console.error('❌ EMAIL_USER or EMAIL_PASS is missing in .env!')
    process.exit(1)
  }

  const cleanPass = pass.replace(/\s+/g, '').replace(/["']/g, '')

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user.trim(),
      pass: cleanPass,
    },
  })

  try {
    console.log('⏳ Verifying SMTP connection with Gmail...')
    await transporter.verify()
    console.log('✅ SMTP Connection verified successfully!')

    console.log('⏳ Sending test email to:', recipient)
    const info = await transporter.sendMail({
      from: `"Jina Fashion Test" <${user}>`,
      to: recipient,
      subject: 'Jina Fashion - Nodemailer Test Email',
      html: `
        <div style="font-family: Arial; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #b8860b;">Jina Fashion Email Test</h2>
          <p>Nodemailer & Gmail SMTP integration is working successfully!</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      `,
    })

    console.log('🎉 Email sent successfully! Message ID:', info.messageId)
  } catch (err) {
    console.error('❌ Email dispatch failed:', err)
  }
}

testEmail()
