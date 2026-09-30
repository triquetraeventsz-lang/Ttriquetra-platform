import mongoose from 'mongoose'

const caseStudySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    client: { type: String, trim: true },
    industry: { type: String, trim: true },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    challenge: { type: String, trim: true },
    approach: { type: String, trim: true },
    execution: { type: String, trim: true },
    outcome: { type: String, trim: true },
    gallery: [{ type: String }],
    featuredImage: { type: String, trim: true },
    video: { type: String, trim: true },
    status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'DRAFT' },
    featured: { type: Boolean, default: false },
    publishAt: { type: Date },
    seoTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true },
    ogImage: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

export default mongoose.model('CaseStudy', caseStudySchema)
