import mongoose from 'mongoose'

// Not in the brief's original collection list, but Section 26/27's fields
// need their own start/end lifecycle rather than being crammed into the
// SiteSettings singleton — see plan Section D.
const announcementSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    displayType: { type: String, enum: ['bar', 'modal'], default: 'bar' },
    headline: { type: String, trim: true },
    message: { type: String, trim: true },
    ctaLabel: { type: String, trim: true },
    ctaUrl: { type: String, trim: true },
    startAt: { type: Date },
    endAt: { type: Date },
    // How often a returning visitor sees it again after dismissing.
    frequency: { type: String, enum: ['always', 'once-per-session', 'once-per-day'], default: 'once-per-session' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

export default mongoose.model('Announcement', announcementSchema)
