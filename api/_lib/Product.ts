import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IProduct extends Document {
  name: string
  category: 'Cord Sets' | 'Dupatta Set' | 'Kurties' | 'Pant/Plazzo set' | 'Short Tops'
  fabric: string
  moq: string
  wholesalePrice: string
  description: string
  src: string
  cloudinaryPublicId: string
  status: 'In Stock' | 'Low Stock' | 'Pre-Order' | 'Out of Stock'
  featured: boolean
  isDeleted: boolean
}

const ProductSchema = new Schema<IProduct>(
  {
    name:             { type: String, required: true, trim: true, maxlength: 200 },
    category:         { type: String, required: true, enum: ['Cord Sets','Dupatta Set','Kurties','Pant/Plazzo set','Short Tops'] },
    fabric:           { type: String, required: true, trim: true, maxlength: 200 },
    moq:              { type: String, default: 'Contact for MOQ', trim: true, maxlength: 100 },
    wholesalePrice:   { type: String, default: 'Quote on Request', trim: true, maxlength: 100 },
    description:      { type: String, default: '', trim: true, maxlength: 2000 },
    src:              { type: String, required: true, trim: true },
    cloudinaryPublicId: { type: String, default: '', trim: true },
    status:           { type: String, enum: ['In Stock','Low Stock','Pre-Order','Out of Stock'], default: 'In Stock' },
    featured:         { type: Boolean, default: false },
    isDeleted:        { type: Boolean, default: false, select: false },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret['id'] = String(ret['_id'])
        ret['_id'] = undefined
        ret['isDeleted'] = undefined
        return ret
      },
    },
  }
)

// Indexes for fast querying
ProductSchema.index({ category: 1, status: 1 })
ProductSchema.index({ featured: 1, status: 1 })
ProductSchema.index({ name: 'text', description: 'text', fabric: 'text' })
ProductSchema.index({ isDeleted: 1 })

// Always exclude soft-deleted docs from queries
ProductSchema.pre(/^find/, function (this: mongoose.Query<unknown, IProduct>) {
  this.where({ isDeleted: { $ne: true } })
})

// Prevent OverwriteModelError in hot-reload / warm serverless environments
const Product: Model<IProduct> =
  (mongoose.models.Product as Model<IProduct>) ||
  mongoose.model<IProduct>('Product', ProductSchema)

export default Product
