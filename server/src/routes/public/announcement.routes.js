import { Router } from 'express'
import Announcement from '../../models/Announcement.js'
import { asyncHandler } from '../../utils/asyncHandler.js'

const router = Router()

// The main-site announcement bar/modal calls this on load. Returns null
// (not a 404) when nothing should be shown right now — that's a normal,
// expected state, not an error.
router.get(
  '/active',
  asyncHandler(async (req, res) => {
    const now = new Date()
    const announcement = await Announcement.findOne({
      enabled: true,
      $and: [
        { $or: [{ startAt: null }, { startAt: { $lte: now } }] },
        { $or: [{ endAt: null }, { endAt: { $gte: now } }] },
      ],
    })
      .select('displayType headline message ctaLabel ctaUrl frequency')
      .lean()

    res.json(announcement || null)
  }),
)

export default router
