import { Router } from 'express'
import Announcement from '../../models/Announcement.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { validate } from '../../middleware/validate.js'
import { announcementSchema } from '../../utils/validators.js'
import { logActivity } from '../../services/activityLog.js'

const router = Router()

// V1 keeps this to a single "current announcement" the admin edits in
// place (Section 26/27) — the model itself doesn't prevent multiple
// historical announcements later if that's ever needed.
async function getOrCreateAnnouncement() {
  let announcement = await Announcement.findOne().sort({ updatedAt: -1 })
  if (!announcement) announcement = await Announcement.create({})
  return announcement
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await getOrCreateAnnouncement())
  }),
)

router.put(
  '/',
  validate(announcementSchema),
  asyncHandler(async (req, res) => {
    const announcement = await getOrCreateAnnouncement()
    Object.assign(announcement, req.body, { updatedBy: req.user.id })
    await announcement.save()

    await logActivity({
      userId: req.user.id,
      action: 'announcement.updated',
      entityType: 'Announcement',
      entityId: announcement._id,
      description: announcement.enabled ? `Enabled announcement "${announcement.headline}"` : 'Disabled announcement',
    })

    res.json(announcement)
  }),
)

export default router
