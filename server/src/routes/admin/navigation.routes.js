import { Router } from 'express'
import Navigation from '../../models/Navigation.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { validate } from '../../middleware/validate.js'
import { navigationSchema } from '../../utils/validators.js'
import { logActivity } from '../../services/activityLog.js'

const router = Router()

// Singleton document — created on first access if it doesn't exist yet.
async function getOrCreateNavigation() {
  let nav = await Navigation.findOne()
  if (!nav) nav = await Navigation.create({ items: [] })
  return nav
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await getOrCreateNavigation())
  }),
)

router.put(
  '/',
  validate(navigationSchema),
  asyncHandler(async (req, res) => {
    const nav = await getOrCreateNavigation()
    nav.items = req.body.items
    if (req.body.ctaLabel !== undefined) nav.ctaLabel = req.body.ctaLabel
    if (req.body.ctaUrl !== undefined) nav.ctaUrl = req.body.ctaUrl
    nav.updatedBy = req.user.id
    await nav.save()

    await logActivity({
      userId: req.user.id,
      action: 'navigation.updated',
      entityType: 'Navigation',
      entityId: nav._id,
      description: 'Updated site navigation',
    })

    res.json(nav)
  }),
)

export default router
