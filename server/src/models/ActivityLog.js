import mongoose from 'mongoose'

const activityLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g. 'blog.published'
    entityType: { type: String, required: true }, // e.g. 'Blog'
    entityId: { type: mongoose.Schema.Types.ObjectId },
    description: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false },
)

activityLogSchema.index({ timestamp: -1 })

export default mongoose.model('ActivityLog', activityLogSchema)
