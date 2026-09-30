import { Router } from 'express'
import SiteSettings from '../../models/SiteSettings.js'
import { asyncHandler } from '../../utils/asyncHandler.js'

const router = Router()

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const settings = await SiteSettings.findOne().select('-updatedBy -__v').lean()
    res.json(settings || {})
  }),
)

export default router
