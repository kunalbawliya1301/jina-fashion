import type { VercelRequest, VercelResponse } from '@vercel/node'
import dotenv from 'dotenv'
dotenv.config()

const SYSTEM_PROMPT = `Your name is Maya, the official AI Assistant for Jina Fashion (Mumbai, India), a premier manufacturer and wholesaler of daily and casual wear, festive wear, and fusion wear for ladies ethnic wear.
Company Background & Legacy:
- Established in 2021 in the vibrant textile hub of Kalbadevi, Mumbai.
- Founded by a third-generation entrepreneur, carrying forward a family legacy spanning over 100 years! The journey began over a century ago with a small retail store established by his grandfather in Lower Parel, Mumbai. Over the years, his father and brother expanded into wholesale garments.
- Mission & Vision: To create premium ethnic wear while delivering exceptional quality, value, and customer satisfaction.
- Offerings: Daily wear, casual wear, festive wear, and fusion wear across Sarees, Lehengas, Salwar Suits, Kurtas, & Dupattas.

Contact Details:
- Business Address: Room No.30, Building No.2, Fruitwala Building Delisle Road, NM Joshi Marg, Mumbai, Maharashtra 400013
- Google Maps Location: https://maps.app.goo.gl/oph9eQ7fwpS5eMVZ6
- Phone Numbers: +91 9967998080 / +91 9892028161
- WhatsApp Number: +91 9967998080 (https://wa.me/919967998080)
- Email: order.jinafashion@gmail.com

Instructions:
- Always be polite, warm, and helpful as Maya.
- Keep responses concise and structured using Markdown (bold text, bullet points).
- Encourage retail boutique buyers to inquire via WhatsApp (+91 9967998080) or the Contact form for wholesale catalogs and pricing.`

function handleSimulation(userMessage: string): string {
  const msg = userMessage.toLowerCase()

  if (msg.includes('saree') || msg.includes('lehenga') || msg.includes('suit') || msg.includes('kurta') || msg.includes('product') || msg.includes('category') || msg.includes('catalog') || msg.includes('service') || msg.includes('offer')) {
    return `Here are the wholesale ethnic wear categories offered by **Jina Fashion**:

1. **Daily & Casual Wear** - Light sarees, comfortable cotton kurtas, & casual suits.
2. **Festive Wear** - Heavy Banarasi silk sarees, designer lehengas, & festive suits.
3. **Fusion Wear** - Modern fusion ensembles & contemporary ethnic wear.
4. **Heritage Sarees & Dupattas** - Pure handloom sarees & heavy zari dupattas.

How can we assist your boutique or retail store today?`
  }

  if (msg.includes('moq') || msg.includes('price') || msg.includes('cost') || msg.includes('minimum') || msg.includes('rate') || msg.includes('wholesale')) {
    return `At **Jina Fashion**, we offer direct factory wholesale rates:

- **Tailored MOQs**: Flexible minimum order quantities designed specifically for independent boutiques.
- **Factory Direct Pricing**: Bypassing trade brokers to maximize your retail margins.
- **Exceptional Quality**: Every garment embodies elegance, comfort, and value.

Would you like to connect directly with our Mumbai sales team on WhatsApp (+91 9967998080)?`
  }

  if (msg.includes('contact') || msg.includes('phone') || msg.includes('email') || msg.includes('whatsapp') || msg.includes('location') || msg.includes('address') || msg.includes('map')) {
    return `You can contact **Jina Fashion** sales team directly via:
- **WhatsApp**: [+91 9967998080](https://wa.me/919967998080)
- **Phone**: +91 9967998080 / +91 9892028161
- **Email**: [order.jinafashion@gmail.com](mailto:order.jinafashion@gmail.com)
- **Business Address**: Room No.30, Building No.2, Fruitwala Building Delisle Road, NM Joshi Marg, Mumbai, Maharashtra 400013
- **Google Maps**: [View Location](https://maps.app.goo.gl/oph9eQ7fwpS5eMVZ6)`
  }

  return `Thank you for reaching out to **Jina Fashion**! You can inquire directly about wholesale catalogs via WhatsApp (+91 9967998080) or through our Contact page.`
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  try {
    const { messages } = (req.body as { messages?: Array<{ role: string; content: string }> }) || {}
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: 'Invalid message payload' })
      return
    }

    const apiKey = process.env.GROQ_API_KEY

    // Simulation fallback if API key is absent
    if (!apiKey) {
      const lastUserMsg = messages[messages.length - 1]?.content || ''
      const simulatedReply = handleSimulation(lastUserMsg)
      await new Promise(resolve => setTimeout(resolve, 600))
      res.status(200).json({
        choices: [
          {
            message: {
              role: 'assistant',
              content: simulatedReply + '\n\n*(Simulation Mode: Groq API Key optional)*',
            },
          },
        ],
      })
      return
    }

    // Call Groq API with llama-3.3-70b-versatile model
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      res.status(response.status).json({
        error: errorData.error?.message || 'Error communicating with AI service',
      })
      return
    }

    const data = await response.json()
    res.status(200).json(data)
    return
  } catch (error: any) {
    console.error('[api/chat] error:', error)
    res.status(500).json({ error: error?.message || 'Internal server error' })
    return
  }
}
