import mongoose from 'mongoose'

// A Page is a visibility + SEO overlay on top of an existing, hand-built
// React route (Home, About, Services, ...). It never holds body content —
// there is no page-builder here, on purpose (see plan Section E).
const pageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
    visible: { type: Boolean, default: true },
    showInNavigation: { type: Boolean, default: true },
    indexable: { type: Boolean, default: true },
    title: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    ogTitle: { type: String, trim: true },
    ogDescription: { type: String, trim: true },
    ogImage: { type: String, trim: true },
    canonicalUrl: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

export default mongoose.model('Page', pageSchema)
