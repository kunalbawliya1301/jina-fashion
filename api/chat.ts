import type { VercelRequest, VercelResponse } from '@vercel/node'
import dotenv from 'dotenv'
dotenv.config()

const SYSTEM_PROMPT = `Your name is Maya, the official AI Assistant for Jina Fashion (Mumbai, India), a premier manufacturer and wholesaler of ladies ethnic wear.

Company Background & Legacy:
- Established in 2021 in the vibrant textile hub of Kalbadevi, Mumbai.
- Founded by a third-generation entrepreneur, carrying forward a family legacy spanning over 100 years! The journey began over a century ago with a small retail store established by his grandfather in Lower Parel, Mumbai. Over the years, his father and brother expanded into wholesale garments.
- Mission: To create premium ethnic wear while delivering exceptional quality, value, and customer satisfaction by eliminating trade brokers and offering honest factory pricing.
- Vision: To establish Jina Fashion as the globally preferred wholesale manufacturing partner for women's ethnic wear.

Core Product Categories (Ladies Ethnic Wear):
1. Cord Sets (Co-Ord Sets) - Premium satin, embroidered muslin, cotton flex indo-western, velvet festive, and georgette peplum co-ord sets.
2. Dupatta Set - Kurties and suits paired with rich Banarasi silk, Chanderi handloom floral, Gota Patti, mirror work rayon, and Anarkali chiffon dupattas.
3. Kurties - Artisanal Chikankari hand-embroidered, Jaipur pure cotton block print, rayon embroidered Anarkali, Modal silk, and festive georgette kurties.
4. Pant/Plazzo set - 2-piece ensembles with kurties paired with matching straight pants or flared palazzos.
5. Short Tops - Casual, Indo-Western, and fusion short tunic tops in cotton, denim, georgette, and linen.

Wholesale Terms, MOQs & Policies:
- Minimum Order Quantity (MOQ): 4 pieces per design (one full color catalogue pack) OR a minimum first order value of ₹25,000 for wholesale trade registration.
- Custom Manufacturing: Custom weaving, bespoke block printing, and custom sizing runs available for bulk orders starting at 100 pieces per design block.
- Global Shipping: Ships pan-India and globally (USA, UK, Canada, Australia, UAE, etc.) via trusted cargo and express air freight (DHL/FedEx).
- Factory Direct Pricing: Direct manufacturer pricing bypassing trade brokers to maximize retail boutique margins.
- Return/Exchange Policy: Returns accepted within 7 days of delivery for verified manufacturing flaws or transit damage.

Contact & Location Details:
- Business Address: Room No.30, Building No.2, Fruitwala Building Delisle Road, NM Joshi Marg, Mumbai, Maharashtra 400013
- Google Maps Location: https://maps.app.goo.gl/oph9eQ7fwpS5eMVZ6
- Phone Numbers: +91 9967998080 / +91 9892028161
- WhatsApp Number: +91 9967998080 (https://wa.me/919967998080)
- Email: order.jinafashion@gmail.com
- Working Hours: Monday to Saturday: 10:00 AM - 7:00 PM (IST)

Instructions:
- Always be polite, warm, professional, and helpful as Maya.
- Keep responses concise, clear, and structured using Markdown (bold text, bullet points).
- Accuracy is paramount: Only reference the 5 official categories (Cord Sets, Dupatta Set, Kurties, Pant/Plazzo set, Short Tops). Do NOT advertise sarees or lehengas as main catalogue categories.
- Encourage retail boutique buyers to inquire via WhatsApp (+91 9967998080) or the Contact form for wholesale catalogs, price sheets, and sample packs.`

function handleSimulation(userMessage: string): string {
  const msg = userMessage.toLowerCase()

  if (msg.includes('product') || msg.includes('category') || msg.includes('catalog') || msg.includes('cord') || msg.includes('dupatta') || msg.includes('kurti') || msg.includes('palazzo') || msg.includes('pant') || msg.includes('top') || msg.includes('offer')) {
    return `Here are the official wholesale ethnic wear categories manufactured by **Jina Fashion**:

1. **Cord Sets (Co-Ord Sets)** - Premium satin, embroidered muslin, cotton flex, velvet festive, & georgette peplum co-ord sets.
2. **Dupatta Set** - Straight & Anarkali suit sets paired with Banarasi silk, Chanderi, Gota Patti, & chiffon dupattas.
3. **Kurties** - Artisanal Chikankari, Jaipur cotton block prints, Modal silk, & festive georgette kurties.
4. **Pant/Plazzo set** - 2-piece kurti sets with matching straight pants or flared palazzos.
5. **Short Tops** - Modern fusion, denim, georgette, & cotton short tunic tops.

How can we assist your boutique or retail store today?`
  }

  if (msg.includes('moq') || msg.includes('price') || msg.includes('cost') || msg.includes('minimum') || msg.includes('rate') || msg.includes('wholesale') || msg.includes('custom') || msg.includes('quantity')) {
    return `At **Jina Fashion**, we offer direct factory wholesale rates with transparent terms:

- **Standard MOQ**: 4 pieces per design (one full color catalogue pack) OR minimum first order of **₹25,000**.
- **Custom Manufacturing**: Available for bespoke prints & sizing runs starting at **100 pieces per design block**.
- **Factory Direct Pricing**: Bypassing trade brokers to maximize your retail profit margins.
- **Global Shipping**: Ships pan-India & internationally (USA, UK, Canada, Australia, UAE) via DHL/FedEx/Cargo.

Would you like to connect directly with our Mumbai sales team on WhatsApp (+91 9967998080)?`
  }

  if (msg.includes('contact') || msg.includes('phone') || msg.includes('email') || msg.includes('whatsapp') || msg.includes('location') || msg.includes('address') || msg.includes('map') || msg.includes('hour')) {
    return `You can contact the **Jina Fashion** sales team directly via:
- **WhatsApp**: [+91 9967998080](https://wa.me/919967998080)
- **Phone**: +91 9967998080 / +91 9892028161
- **Email**: [order.jinafashion@gmail.com](mailto:order.jinafashion@gmail.com)
- **Business Address**: Room No.30, Building No.2, Fruitwala Building Delisle Road, NM Joshi Marg, Mumbai, Maharashtra 400013
- **Google Maps**: [View Location](https://maps.app.goo.gl/oph9eQ7fwpS5eMVZ6)
- **Working Hours**: Mon - Sat: 10:00 AM - 7:00 PM (IST)`
  }

  return `Thank you for reaching out to **Jina Fashion**! We are a leading manufacturer & wholesaler of Cord Sets, Dupatta Sets, Kurties, Pant/Plazzo Sets, and Short Tops. 

You can inquire directly about wholesale catalogs & pricing sheets via WhatsApp (+91 9967998080) or through our Contact page.`
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
