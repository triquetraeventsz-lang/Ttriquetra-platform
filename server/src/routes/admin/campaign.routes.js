import { Router } from 'express'
import CampaignPhase from '../../models/CampaignPhase.js'
import { ApiError } from '../../utils/ApiError.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { validate } from '../../middleware/validate.js'
import { campaignPhaseSchema } from '../../utils/validators.js'
import { logActivity } from '../../services/activityLog.js'

const router = Router()

// Top-level, matching the brief's PUT/DELETE /api/admin/campaign/:id
// (creation and listing happen under /api/admin/events/:eventId/campaign).
router.put(
  '/:id',
  validate(campaignPhaseSchema.partial()),
  asyncHandler(async (req, res) => {
    const phase = await CampaignPhase.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedBy: req.user.id },
      { new: true, runValidators: true },
    )
    if (!phase) throw new ApiError(404, 'Campaign phase not found.')

    await logActivity({
      userId: req.user.id,
      action: 'campaignphase.updated',
      entityType: 'CampaignPhase',
      entityId: phase._id,
      description: `Updated phase "${phase.name}"`,
    })

    res.json(phase)
  }),
)

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const phase = await CampaignPhase.findByIdAndDelete(req.params.id)
    if (!phase) throw new ApiError(404, 'Campaign phase not found.')

    await logActivity({
      userId: req.user.id,
      action: 'campaignphase.deleted',
      entityType: 'CampaignPhase',
      entityId: phase._id,
      description: `Deleted phase "${phase.name}"`,
    })

    res.status(204).end()
  }),
)

export default router
