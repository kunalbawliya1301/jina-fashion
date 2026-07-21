import 'dotenv/config'
import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    fabric: { type: String, default: 'Standard' },
    moq: { type: String, default: '4 Pcs' },
    wholesalePrice: { type: String, default: 'Quote on Request' },
    description: { type: String, default: '' },
    src: { type: String, required: true },
    cloudinaryPublicId: { type: String, default: '' },
    status: { type: String, default: 'In Stock' },
    featured: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)

const DEMO_PRODUCTS = [
  // ── 1. Cord Sets (5 items) ──────────────────────────────────────────────────
  {
    name: 'Royal Satin Printed Co-Ord Set',
    category: 'Cord Sets',
    description: 'Premium satin designer cord set featuring modern botanical prints, tailored collar, and comfortable trousers.',
    src: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    name: 'Embroidered Muslin Cord Set',
    category: 'Cord Sets',
    description: 'Lightweight pure muslin co-ord set with subtle resham hand embroidery on cuffs and neckline.',
    src: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    name: 'Cotton Flex Indo-Western Cord Set',
    category: 'Cord Sets',
    description: 'Breathable cotton flex cord set with asymmetric high-low tunic and matching straight pants.',
    src: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Velvet Festive Embroidered Cord Set',
    category: 'Cord Sets',
    description: 'Rich micro-velvet cord set embellished with antique gold zari motifs for winter festivities.',
    src: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    name: 'Georgette Printed Peplum Cord Set',
    category: 'Cord Sets',
    description: 'Trendy georgette peplum top with matching flared palazzo pants in vibrant summer shades.',
    src: 'https://images.unsplash.com/photo-1605784401368-5af1d9d6c4dc?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },

  // ── 2. Dupatta Set (5 items) ────────────────────────────────────────────────
  {
    name: 'Heavy Banarasi Silk Dupatta Set',
    category: 'Dupatta Set',
    description: 'Luxurious silk straight kurti set paired with a rich woven Banarasi brocade dupatta.',
    src: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    name: 'Chanderi Handloom Floral Dupatta Set',
    category: 'Dupatta Set',
    description: 'Ethereal Chanderi cotton-silk suit set with delicate digital floral print organza dupatta.',
    src: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    name: 'Gota Patti Silk Blend Dupatta Set',
    category: 'Dupatta Set',
    description: 'Festive straight suit decorated with Jaipur Gota Patti embroidery and matching dupatta.',
    src: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Mirror Work Rayon Dupatta Set',
    category: 'Dupatta Set',
    description: 'Comfortable premium heavy rayon kurti set with authentic foil mirror work and printed dupatta.',
    src: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Anarkali flared Chiffon Dupatta Set',
    category: 'Dupatta Set',
    description: 'Regal Anarkali suit set with heavy flared skirt and lightweight chiffon dupatta.',
    src: 'https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },

  // ── 3. Kurties (5 items) ───────────────────────────────────────────────────
  {
    name: 'Artisanal Chikankari Hand-Embroidered Kurti',
    category: 'Kurties',
    description: 'Authentic Lucknowi Chikankari embroidered kurti in pure breathable modal cotton.',
    src: 'https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Heavy Anarkali Gown Suit Set',
    category: 'Suits',
    description: 'Floor-length Anarkali suit with 56-inch flair, detailed zari embroidery, and heavy organza dupatta.',
    src: 'https://images.unsplash.com/photo-1605784401368-5af1d9d6c4dc?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    name: 'Punjabi Patiala Salwar Suit Set',
    category: 'Suits',
    description: 'Vibrant Punjabi Patiala suit featuring Phulkari hand embroidery on dupatta and heavy pleated salwar.',
    src: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Printed Rayon Daily Kurti',
    category: 'Kurties',
    description: 'Comfortable everyday rayon straight kurti with wooden button detail.',
    src: 'https://images.unsplash.com/photo-1590075865003-e48277faa558?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Anarkali Flare Designer Kurti',
    category: 'Kurties',
    description: 'Festive flare Anarkali kurti decorated with gold Gota Patti lace borders.',
    src: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },

  // ── 4. Pant/Plazzo set (5 items) ──────────────────────────────────────────
  {
    name: 'Cotton Flex Kurti with Palazzo Pants Set',
    category: 'Pant/Plazzo set',
    description: 'Straight cotton kurti paired with wide flared palazzo pants and side pocket.',
    src: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Printed Rayon Kurti & Ankle Pant Set',
    category: 'Pant/Plazzo set',
    description: 'Stylish printed tunic kurti set paired with comfortable elasticated trousers.',
    src: 'https://images.unsplash.com/photo-1605784401368-5af1d9d6c4dc?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    name: 'Chanderi Embroidered Kurti & Palazzo Set',
    category: 'Pant/Plazzo set',
    description: 'Chanderi cotton silk kurti with embroidered palazzo pants set for semi-formal gatherings.',
    src: 'https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Angrakha Style Kurti & Flared Palazzo Set',
    category: 'Pant/Plazzo set',
    description: 'Angrakha pattern top with tassel ties and printed flared palazzo set.',
    src: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Muslin Silk Designer Kurti & Pants Set',
    category: 'Pant/Plazzo set',
    description: 'Pure muslin silk kurti set with foil thread embroidery and matching cigarette pants.',
    src: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },

  // ── 5. Short Tops (5 items) ────────────────────────────────────────────────
  {
    name: 'Embroidered Cotton Short Tunic Top',
    category: 'Short Tops',
    description: 'Crafted from pure breathable cotton with detailed hand embroidery on neckline and sleeve hem.',
    src: 'https://images.unsplash.com/photo-1590075865003-e48277faa558?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    name: 'Printed Georgette Peplum Short Top',
    category: 'Short Tops',
    description: 'Vibrant digital print peplum tunic top with flare waistline, ideal for pairing with denim or skirts.',
    src: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Lucknowi Chikankari Short Kurti Top',
    category: 'Short Tops',
    description: 'Elegant Chikankari hand-embroidered short top with mandarin collar and full sleeves.',
    src: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Rayon Floral Print Fusion Short Tunic',
    category: 'Short Tops',
    description: 'Casual fusion wear short tunic top with wooden button accents.',
    src: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Satin Silk Designer Festive Short Top',
    category: 'Short Tops',
    description: 'Lustrous satin silk short top with subtle zari thread highlights for evening celebrations.',
    src: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
]

async function seed() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('❌ MONGODB_URI is missing in .env')
    process.exit(1)
  }

  try {
    await mongoose.connect(uri)
    console.log('✅ Connected to MongoDB Atlas')

    await Product.deleteMany({})
    console.log('🧹 Cleared old products')

    const inserted = await Product.insertMany(DEMO_PRODUCTS)
    console.log(`\n🎉 Successfully seeded ${inserted.length} demo products (5 per category across 5 categories)!`)

    process.exit(0)
  } catch (err) {
    console.error('❌ Seeding failed:', err)
    process.exit(1)
  }
}

seed()
