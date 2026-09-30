import mongoose from 'mongoose'

// For event lead forms (Section 30). The existing main-site Contact form
// keeps using Web3Forms as-is — this is not a replacement for that.
const formSubmissionSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    source: { type: String, default: 'event-landing-page' },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

formSubmissionSchema.index({ eventId: 1 })

export default mongoose.model('FormSubmission', formSubmissionSchema)
