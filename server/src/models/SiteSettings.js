import mongoose from 'mongoose'

// Singleton document holding the global SEO/organization defaults.
const siteSettingsSchema = new mongoose.Schema(
  {
    siteTitle: { type: String, default: 'Triquetra Events' },
    defaultDescription: { type: String, default: '' },
    defaultOgImage: { type: String, default: '' },
    canonicalDomain: { type: String, default: 'https://triquetraevents.co.in' },
    organizationName: { type: String, default: 'Triquetra Events' },
    organizationLogo: { type: String, default: '' },
    organizationAddress: { type: String, default: '' },
    organizationPhone: { type: String, default: '' },
    organizationEmail: { type: String, default: '' },
    socialLinks: {
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
)

export default mongoose.model('SiteSettings', siteSettingsSchema)
