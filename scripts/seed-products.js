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
  // ── 1. Sarees (5 items) ──────────────────────────────────────────────────
  {
    name: 'Royal Kanchipuram Pure Mulberry Silk Saree',
    category: 'Sarees',
    description: 'Handcrafted Kanchipuram silk saree featuring traditional temple borders, intricate gold zari motifs, and rich pallu for grand wedding wear.',
    src: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    name: 'Banarasi Organza Zardozi Designer Saree',
    category: 'Sarees',
    description: 'Ultra-lightweight sheer organza saree decorated with delicate hand-embroidered Zardozi borders and floral Booti work.',
    src: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    name: 'Pure Chanderi Silk Cotton Bandhani Saree',
    category: 'Sarees',
    description: 'Elegant Jaipur tie-dye Bandhani saree with traditional tissue zari border, lightweight and breathable.',
    src: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Heritage Paithani Peacock Brocade Saree',
    category: 'Sarees',
    description: 'Authentic Maharashtra Paithani saree featuring tapestry weave peacock motif pallu and fine zari work border.',
    src: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    name: 'Contemporary Georgette Sequins Work Saree',
    category: 'Sarees',
    description: 'Trendy cocktail saree embroidered with tone-on-tone micro sequins and matching designer blouse piece.',
    src: 'https://images.unsplash.com/photo-1605784401368-5af1d9d6c4dc?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },

  // ── 2. Lehengas (5 items) ────────────────────────────────────────────────
  {
    name: 'Bridal Raw Silk Velvet Embroidered Lehenga',
    category: 'Lehengas',
    description: 'Luxurious crimson bridal lehenga choli embellished with heavy Resham, Dori, and Cutdana hand embroidery.',
    src: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    name: 'Pastel Pink Net Sequins Flair Lehenga Set',
    category: 'Lehengas',
    description: 'Ethereal pastel pink lehenga with 5-meter flare, glittering thread sequins work, and soft net dupatta.',
    src: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    name: 'Floral Printed Georgette Sangeet Lehenga',
    category: 'Lehengas',
    description: 'Contemporary digital floral print lehenga for sangeet and mehendi functions, decorated with mirror work waist belt.',
    src: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Heavy Mirror Work Silk Chaniya Choli',
    category: 'Lehengas',
    description: 'Traditional Navratri & festive Chaniya Choli crafted with authentic mirror work and colorful Kutchi threadwork.',
    src: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Royal Navy Blue Velvet Designer Lehenga',
    category: 'Lehengas',
    description: 'Regal navy blue velvet lehenga adorned with antique gold zari work and double dupatta set.',
    src: 'https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },

  // ── 3. Suits (5 items) ───────────────────────────────────────────────────
  {
    name: 'Chanderi Silk Straight Cut Designer Suit',
    category: 'Suits',
    description: 'Classic straight fit suit with woven zari neckline, palazzo pants, and digital print jacquard dupatta.',
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
    name: 'Pakistani Lawn Printed Suit with Silk Dupatta',
    category: 'Suits',
    description: 'Summer special lawn suit set with embroidered patch border work and digital printed pure silk dupatta.',
    src: 'https://images.unsplash.com/photo-1590075865003-e48277faa558?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Sharara Suit Set with Gotapatti Work',
    category: 'Suits',
    description: 'Festive short kurti paired with tier sharara pants, decorated with gold Gota Patti lace borders.',
    src: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },

  // ── 4. Kurtas (5 items) ──────────────────────────────────────────────────
  {
    name: 'Handblock Printed Cotton Straight Kurta',
    category: 'Kurtas',
    description: 'Daily ethnic wear Sanganeri handblock print kurta with mandarin collar and wooden button placket.',
    src: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Lucknowi Chikankari Hand Embroidered Kurti',
    category: 'Kurtas',
    description: 'Timeless Lucknowi Chikankari kurti featuring intricate Bakhiya and Phanda stitch work.',
    src: 'https://images.unsplash.com/photo-1605784401368-5af1d9d6c4dc?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    name: 'A-Line Rayon Kurta Set with Pants',
    category: 'Kurtas',
    description: 'Comfortable A-line flared kurta set with matching ankle-length pants and side pocket detail.',
    src: 'https://images.unsplash.com/photo-1631857455684-a54a2f03665f?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Designer Angrakha Style Festive Kurta',
    category: 'Kurtas',
    description: 'Royal Angrakha overlap pattern kurta tied with decorative tassels and gold zari foil print.',
    src: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Asymmetric High-Low Silk Kurti',
    category: 'Kurtas',
    description: 'Modern high-low hemline designer tunic kurti decorated with metallic beadwork on sleeve cuffs.',
    src: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },

  // ── 5. Dupattas (5 items) ────────────────────────────────────────────────
  {
    name: 'Heavy Banarasi Silk Woven Zari Dupatta',
    category: 'Dupattas',
    description: 'Grand Banarasi silk dupatta featuring all-over Kadwa weave gold zari motifs and heavy tassels.',
    src: 'https://images.unsplash.com/photo-1590075865003-e48277faa558?auto=format&fit=crop&q=80&w=800',
    featured: true,
  },
  {
    name: 'Handcrafted Phulkari Chiffon Dupatta',
    category: 'Dupattas',
    description: 'Traditional Punjabi Phulkari dupatta embroidered with vibrant silk threads in geometric floral patterns.',
    src: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Authentic Bandhani Silk Bandhej Dupatta',
    category: 'Dupattas',
    description: 'Rajasthan Special Bandhej dupatta with hand-knotted tie dye dots and Gota Patti border.',
    src: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Lucknowi Chikankari Georgette Dupatta',
    category: 'Dupattas',
    description: 'Graceful Chikankari embroidered dupatta with Mukaish star work detailing.',
    src: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    featured: false,
  },
  {
    name: 'Organza Floral Digital Print Zari Lace Dupatta',
    category: 'Dupattas',
    description: 'Lightweight organza dupatta printed with romantic pastel florals and scalloped zari embroidered borders.',
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
