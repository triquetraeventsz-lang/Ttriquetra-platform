import mongoose from 'mongoose'

// Whether a phase is "the active one" is never decided by a human toggle —
// it's computed at query time from startAt/endAt vs the server clock
// (see services/activePhase.js). `status` here tracks admin-facing
// lifecycle (has it been scheduled at all, was it retired, etc.), not
// live/not-live.
const campaignPhaseSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    name: { type: String, required: true, trim: true },
    internalDescription: { type: String, trim: true },
    publicHeadline: { type: String, trim: true },
    publicMessage: { type: String, trim: true },
    image: { type: String, trim: true },
    video: { type: String, trim: true },
    ctaLabel: { type: String, trim: true },
    ctaUrl: { type: String, trim: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    status: { type: String, enum: ['DRAFT', 'SCHEDULED', 'ACTIVE', 'EXPIRED', 'ARCHIVED'], default: 'DRAFT' },
    priority: { type: Number, default: 0 },
    showOnMainWebsite: { type: Boolean, default: false },
    showOnLandingPage: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

campaignPhaseSchema.index({ eventId: 1, startAt: 1, endAt: 1 })

export default mongoose.model('CampaignPhase', campaignPhaseSchema)
