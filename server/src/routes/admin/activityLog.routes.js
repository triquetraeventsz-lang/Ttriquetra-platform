import { Router } from 'express'
import ActivityLog from '../../models/ActivityLog.js'
import { asyncHandler } from '../../utils/asyncHandler.js'

const router = Router()

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 30 } = req.query
    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.min(100, Math.max(1, Number(limit)))

    const [items, total] = await Promise.all([
      ActivityLog.find()
        .sort({ timestamp: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('userId', 'name email')
        .lean(),
      ActivityLog.countDocuments(),
    ])

    res.json({ items, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) })
  }),
)

export default router
