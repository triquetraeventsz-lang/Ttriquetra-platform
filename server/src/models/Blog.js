import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    excerpt: { type: String, trim: true },
    content: { type: String, required: true }, // sanitized HTML from the rich text editor
    featuredImage: { type: String, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    status: { type: String, enum: ['DRAFT', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'], default: 'DRAFT' },
    publishAt: { type: Date },
    seoTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    ogImage: { type: String, trim: true },
    canonicalUrl: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

blogSchema.index({ status: 1, publishAt: 1 })

export default mongoose.model('Blog', blogSchema)
