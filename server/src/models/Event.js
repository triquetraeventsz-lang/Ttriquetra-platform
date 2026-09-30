import mongoose from 'mongoose'

const sectionConfigSchema = new mongoose.Schema(
  { enabled: { type: Boolean, default: true }, order: { type: Number, default: 0 } },
  { _id: false },
)

const leadFormSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: false },
    fields: [{ type: String, enum: ['name', 'email', 'phone'] }],
    notificationEmail: { type: String, trim: true },
    successMessage: { type: String, trim: true, default: "You're on the list." },
  },
  { _id: false },
)

const seoSchema = new mongoose.Schema(
  { title: String, description: String, ogImage: String, canonical: String, indexable: { type: Boolean, default: true } },
  { _id: false },
)

// One Event = one campaign (e.g. "Upcoming Concert 2026"). The platform is
// designed to hold many of these independently at once (Section 52).
const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    internalName: { type: String, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    publicName: { type: String, trim: true },
    description: { type: String, trim: true },
    heroImage: { type: String, trim: true },
    gallery: [{ type: String }],
    venue: { type: String, trim: true },
    city: { type: String, trim: true },
    eventDate: { type: Date },
    eventTime: { type: String, trim: true },
    status: { type: String, enum: ['DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED'], default: 'DRAFT' },
    landingPageEnabled: { type: Boolean, default: false },
    mainWebsiteEnabled: { type: Boolean, default: false },
    sections: {
      hero: sectionConfigSchema,
      eventDetails: sectionConfigSchema,
      announcements: sectionConfigSchema,
      gallery: sectionConfigSchema,
      timeline: sectionConfigSchema,
      cta: sectionConfigSchema,
      leadForm: sectionConfigSchema,
      faq: sectionConfigSchema,
      footer: sectionConfigSchema,
    },
    leadForm: leadFormSchema,
    seo: seoSchema,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

export default mongoose.model('Event', eventSchema)
