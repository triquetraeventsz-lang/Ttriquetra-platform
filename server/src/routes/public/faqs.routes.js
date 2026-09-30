import { Router } from 'express'
import FAQ from '../../models/FAQ.js'
import { asyncHandler } from '../../utils/asyncHandler.js'

const router = Router()

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page, service } = req.query
    const filter = { status: 'PUBLISHED' }
    if (page) filter.page = page
    if (service) filter.service = service

    const faqs = await FAQ.find(filter).sort({ order: 1 }).select('question answer page order').lean()
    res.json(faqs)
  }),
)

export default router
