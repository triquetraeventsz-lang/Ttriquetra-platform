import { Router } from 'express'
import Page from '../../models/Page.js'
import { ApiError } from '../../utils/ApiError.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { validate } from '../../middleware/validate.js'
import { pageUpdateSchema } from '../../utils/validators.js'
import { logActivity } from '../../services/activityLog.js'

const router = Router()

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const pages = await Page.find().sort({ name: 1 }).lean()
    res.json(pages)
  }),
)

router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const page = await Page.findOne({ slug: req.params.slug }).lean()
    if (!page) throw new ApiError(404, 'Page not found.')
    res.json(page)
  }),
)

router.put(
  '/:slug',
  validate(pageUpdateSchema),
  asyncHandler(async (req, res) => {
    const page = await Page.findOneAndUpdate(
      { slug: req.params.slug },
      { ...req.body, updatedBy: req.user.id },
      { new: true, runValidators: true, upsert: false },
    )
    if (!page) throw new ApiError(404, 'Page not found.')

    await logActivity({
      userId: req.user.id,
      action: 'page.updated',
      entityType: 'Page',
      entityId: page._id,
      description: `Updated visibility/SEO for page "${page.name}"`,
    })

    res.json(page)
  }),
)

export default router
