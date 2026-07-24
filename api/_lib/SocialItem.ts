import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISocialItem extends Document {
  type: 'image' | 'video'
  src: string
  title: string
  link?: string
  isDeleted?: boolean
}

const SocialItemSchema = new Schema<ISocialItem>(
  {
    type:      { type: String, required: true, enum: ['image', 'video'] },
    src:       { type: String, required: true, trim: true },
    title:     { type: String, required: true, trim: true, maxlength: 300 },
    link:      { type: String, default: 'https://www.instagram.com/_jina_fashion', trim: true },
    isDeleted: { type: Boolean, default: false, select: false },
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

SocialItemSchema.pre(/^find/, function (this: mongoose.Query<unknown, ISocialItem>) {
  this.where({ isDeleted: { $ne: true } })
})

const SocialItem: Model<ISocialItem> =
  (mongoose.models.SocialItem as Model<ISocialItem>) ||
  mongoose.model<ISocialItem>('SocialItem', SocialItemSchema)

export default SocialItem
