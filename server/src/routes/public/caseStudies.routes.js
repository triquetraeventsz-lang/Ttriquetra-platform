import { Router } from 'express'
import CaseStudy from '../../models/CaseStudy.js'
import { ApiError } from '../../utils/ApiError.js'
import { asyncHandler } from '../../utils/asyncHandler.js'

const router = Router()

function visibilityFilter() {
  const now = new Date()
  return { status: 'PUBLISHED', $or: [{ publishAt: null }, { publishAt: { $lte: now } }] }
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query
    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.min(50, Math.max(1, Number(limit)))
    const filter = visibilityFilter()

    const [items, total] = await Promise.all([
      CaseStudy.find(filter)
        .sort({ featured: -1, publishAt: -1, createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      CaseStudy.countDocuments(filter),
    ])

    res.json({ items, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) })
  }),
)

router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const caseStudy = await CaseStudy.findOne({ slug: req.params.slug, ...visibilityFilter() }).lean()
    if (!caseStudy) throw new ApiError(404, 'Case study not found.')
    res.json(caseStudy)
  }),
)

export default router
