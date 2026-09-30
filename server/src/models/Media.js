import mongoose from 'mongoose'

// MongoDB stores metadata + URL only — the actual file lives in object
// storage (R2 by default; see services/storage.js). storageProvider keeps
// this abstract per Section 18.
const mediaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    storageKey: { type: String, required: true },
    storageProvider: { type: String, default: 'r2' },
    altText: { type: String, trim: true, default: '' },
    title: { type: String, trim: true },
    caption: { type: String, trim: true },
    description: { type: String, trim: true },
    fileType: { type: String },
    fileSize: { type: Number },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

export default mongoose.model('Media', mediaSchema)
