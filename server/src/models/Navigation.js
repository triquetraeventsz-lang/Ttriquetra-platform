import mongoose from 'mongoose'

const childItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    to: { type: String, required: true },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
  },
  { _id: true },
)

const navItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    to: { type: String, required: true },
    order: { type: Number, default: 0 },
    enabled: { type: Boolean, default: true },
    children: [childItemSchema],
  },
  { _id: true },
)

// Singleton document (small, hierarchical, rarely written) — a fitting use
// of MongoDB's document model rather than a separate collection with
// parent-ref joins, per Section 6.
const navigationSchema = new mongoose.Schema(
  {
    items: [navItemSchema],
    ctaLabel: { type: String, default: 'Talk to Us' },
    ctaUrl: { type: String, default: '/contact' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

export default mongoose.model('Navigation', navigationSchema)
