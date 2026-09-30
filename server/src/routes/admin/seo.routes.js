import { Router } from 'express'
import SiteSettings from '../../models/SiteSettings.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { validate } from '../../middleware/validate.js'
import { requireRole } from '../../middleware/auth.js'
import { siteSettingsSchema } from '../../utils/validators.js'
import { logActivity } from '../../services/activityLog.js'

const router = Router()

// Global SEO/organization defaults are a "critical system setting" —
// ADMIN only (Section 7). Per-page SEO overrides live on /admin/pages
// instead, and EDITORs don't touch this route at all.
router.use(requireRole('ADMIN'))

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne()
  if (!settings) settings = await SiteSettings.create({})
  return settings
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await getOrCreateSettings())
  }),
)

router.put(
  '/',
  validate(siteSettingsSchema),
  asyncHandler(async (req, res) => {
    const settings = await getOrCreateSettings()
    Object.assign(settings, req.body, { updatedBy: req.user.id })
    await settings.save()

    await logActivity({
      userId: req.user.id,
      action: 'sitesettings.updated',
      entityType: 'SiteSettings',
      entityId: settings._id,
      description: 'Updated global SEO/site settings',
    })

    res.json(settings)
  }),
)

export default router
