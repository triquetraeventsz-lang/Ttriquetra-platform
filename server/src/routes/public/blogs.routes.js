import { Router } from 'express'
import Blog from '../../models/Blog.js'
import { ApiError } from '../../utils/ApiError.js'
import { asyncHandler } from '../../utils/asyncHandler.js'

const router = Router()

// A blog is publicly visible once it's PUBLISHED, or once a SCHEDULED
// blog's publishAt has passed — computed live against the server clock,
// same principle as campaign phases (Section 32). No cron job needed.
function visibilityFilter() {
  const now = new Date()
  return { $or: [{ status: 'PUBLISHED' }, { status: 'SCHEDULED', publishAt: { $lte: now } }] }
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, category } = req.query
    const filter = visibilityFilter()
    if (category) filter.category = category

    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.min(50, Math.max(1, Number(limit)))

    const [items, total] = await Promise.all([
      Blog.find(filter)
        .sort({ publishAt: -1, createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('author', 'name')
        .select('-content')
        .lean(),
      Blog.countDocuments(filter),
    ])

    res.json({ items, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) })
  }),
)

router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug, ...visibilityFilter() })
      .populate('author', 'name')
      .lean()
    if (!blog) throw new ApiError(404, 'Blog post not found.')
    res.json(blog)
  }),
)

export default router
