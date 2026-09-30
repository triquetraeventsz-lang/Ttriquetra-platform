import mongoose from 'mongoose'

const seoSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    ogImage: String,
    canonical: String,
    indexable: { type: Boolean, default: true },
  },
  { _id: false },
)

const capabilitySchema = new mongoose.Schema(
  { title: String, description: String },
  { _id: false },
)

const processStepSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    order: { type: Number, default: 0 },
    hidden: { type: Boolean, default: false },
  },
  { _id: true },
)

// Each service owns its own processSteps array — this is the direct fix
// for the "one generic process for every service" problem (Section 14).
const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    shortDescription: { type: String, trim: true },
    fullDescription: { type: String, trim: true },
    heroImage: { type: String, trim: true },
    gallery: [{ type: String }],
    capabilities: [capabilitySchema],
    processSteps: [processStepSchema],
    seo: seoSchema,
    status: { type: String, enum: ['DRAFT', 'PUBLISHED'], default: 'DRAFT' },
    displayOrder: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

export default mongoose.model('Service', serviceSchema)
