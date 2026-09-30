import mongoose from 'mongoose'

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    page: {
      type: String,
      enum: ['home', 'events', 'brand-activation', 'mice', 'online-marketing', 'other'],
      required: true,
    },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ['DRAFT', 'PUBLISHED'], default: 'DRAFT' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

faqSchema.index({ page: 1, status: 1, order: 1 })

export default mongoose.model('FAQ', faqSchema)
