import { Router } from 'express'
import Service from '../../models/Service.js'
import { ApiError } from '../../utils/ApiError.js'
import { asyncHandler } from '../../utils/asyncHandler.js'

const router = Router()

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const services = await Service.find({ status: 'PUBLISHED' })
      .sort({ displayOrder: 1 })
      .select('-createdBy -updatedBy -__v')
      .lean()
    // Same rule as the detail route: hidden process steps never reach the
    // public API, even from the list endpoint.
    for (const service of services) {
      service.processSteps = (service.processSteps || []).filter((s) => !s.hidden).sort((a, b) => a.order - b.order)
    }
    res.json(services)
  }),
)

router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const service = await Service.findOne({ slug: req.params.slug, status: 'PUBLISHED' })
      .select('-createdBy -updatedBy -__v')
      .lean()
    if (!service) throw new ApiError(404, 'Service not found.')
    // Hidden process steps and inactive capabilities never reach the
    // public API, even though the admin can see/reorder them.
    service.processSteps = (service.processSteps || []).filter((s) => !s.hidden).sort((a, b) => a.order - b.order)
    res.json(service)
  }),
)

export default router
