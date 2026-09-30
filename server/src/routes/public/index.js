import { Router } from 'express'
import pagesRoutes from './pages.routes.js'
import servicesRoutes from './services.routes.js'
import blogsRoutes from './blogs.routes.js'
import caseStudiesRoutes from './caseStudies.routes.js'
import faqsRoutes from './faqs.routes.js'
import navigationRoutes from './navigation.routes.js'
import siteSettingsRoutes from './siteSettings.routes.js'
import announcementRoutes from './announcement.routes.js'
import eventsRoutes from './events.routes.js'
import sitemapRoutes from './sitemap.routes.js'

const router = Router()

router.use('/pages', pagesRoutes)
router.use('/services', servicesRoutes)
router.use('/blogs', blogsRoutes)
router.use('/case-studies', caseStudiesRoutes)
router.use('/faqs', faqsRoutes)
router.use('/navigation', navigationRoutes)
router.use('/site-settings', siteSettingsRoutes)
router.use('/announcement', announcementRoutes)
router.use('/events', eventsRoutes)
router.use('/', sitemapRoutes) // exposes /sitemap.xml directly under /api/public

export default router
