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

async function clearAllProducts() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error('❌ MONGODB_URI is missing in .env')
    process.exit(1)
  }

  try {
    await mongoose.connect(uri)
    console.log('✅ Connected to MongoDB Atlas')

    const result = await Product.deleteMany({})
    console.log(`🧹 Successfully removed all product data (${result.deletedCount} products deleted from database).`)

    process.exit(0)
  } catch (err) {
    console.error('❌ Failed to clear products:', err)
    process.exit(1)
  }
}

clearAllProducts()
