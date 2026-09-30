import { Router } from 'express'
import Page from '../../models/Page.js'
import { ApiError } from '../../utils/ApiError.js'
import { asyncHandler } from '../../utils/asyncHandler.js'

const router = Router()
const PUBLIC_FIELDS =
  'name slug visible showInNavigation indexable title metaDescription ogTitle ogDescription ogImage canonicalUrl'

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const pages = await Page.find({ status: 'ACTIVE' }).select(PUBLIC_FIELDS).lean()
    res.json(pages)
  }),
)

router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const page = await Page.findOne({ slug: req.params.slug, status: 'ACTIVE' }).select(PUBLIC_FIELDS).lean()
    if (!page) throw new ApiError(404, 'Page not found.')
    res.json(page)
  }),
)

export default router
