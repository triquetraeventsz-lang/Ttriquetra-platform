import { Router } from 'express'
import Page from '../../models/Page.js'
import Event from '../../models/Event.js'
import SiteSettings from '../../models/SiteSettings.js'
import { asyncHandler } from '../../utils/asyncHandler.js'

const router = Router()

// Page.slug is a short identifier (used for admin lookups), not always the
// literal top-level URL — these four live under /services/ on the real
// site (see client/src/App.jsx's routes and data/nav.js's `to` paths,
// which is the actual source of truth for where each page lives).
const PAGE_PATH_OVERRIDES = {
  'brand-activation': '/services/brand-activation',
  events: '/services/events',
  mice: '/services/mice',
  'online-marketing': '/services/online-marketing',
}

function pagePath(slug) {
  if (slug === 'home') return '/'
  return PAGE_PATH_OVERRIDES[slug] || `/${slug}`
}

// Dynamic sitemap (Section 37): every publish/unpublish is reflected here
// automatically, with no manual sitemap.xml editing. This endpoint is the
// data source — wiring the live domain's /sitemap.xml to it is a
// deployment-time decision for a later phase (see plan).
//
// Only Pages and Events are included — they're the only content types with
// a real public route in `client/` today. Services are 4 fixed hand-built
// pages the CMS isn't wired to, and Blog/CaseStudy have no public detail
// page at all yet (both deliberately deferred, see the Phase 3 plan).
// Listing their URLs here would be soft-404s once crawled. Add them back
// once each has a real page to point to.
router.get(
  '/sitemap.xml',
  asyncHandler(async (req, res) => {
    const settings = await SiteSettings.findOne().lean()
    const domain = (settings?.canonicalDomain || 'https://triquetraevents.co.in').replace(/\/$/, '')

    const [pages, events] = await Promise.all([
      Page.find({ status: 'ACTIVE', indexable: true }).select('slug updatedAt').lean(),
      Event.find({ landingPageEnabled: true, 'seo.indexable': { $ne: false } }).select('slug updatedAt').lean(),
    ])

    const urls = [
      ...pages.map((p) => ({ loc: pagePath(p.slug), lastmod: p.updatedAt })),
      ...events.map((e) => ({ loc: `/events/${e.slug}`, lastmod: e.updatedAt })),
    ]

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((u) => `  <url><loc>${domain}${u.loc}</loc><lastmod>${new Date(u.lastmod).toISOString()}</lastmod></url>`)
      .join('\n')}\n</urlset>\n`

    res.setHeader('Content-Type', 'application/xml')
    res.send(xml)
  }),
)

export default router
