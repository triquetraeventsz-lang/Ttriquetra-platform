import { Router } from 'express'
import Navigation from '../../models/Navigation.js'
import { asyncHandler } from '../../utils/asyncHandler.js'

const router = Router()

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const nav = await Navigation.findOne().lean()
    if (!nav) return res.json({ items: [], ctaLabel: 'Talk to Us', ctaUrl: '/contact' })

    // Only enabled items/children ever reach the public site.
    const items = nav.items
      .filter((item) => item.enabled)
      .sort((a, b) => a.order - b.order)
      .map((item) => ({
        label: item.label,
        to: item.to,
        children: (item.children || [])
          .filter((c) => c.enabled)
          .sort((a, b) => a.order - b.order)
          .map((c) => ({ label: c.label, to: c.to })),
      }))

    res.json({ items, ctaLabel: nav.ctaLabel, ctaUrl: nav.ctaUrl })
  }),
)

export default router
