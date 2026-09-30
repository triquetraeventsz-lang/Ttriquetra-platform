import { Router } from 'express'
import { requireAuth } from '../../middleware/auth.js'

import authRoutes from './auth.routes.js'
import dashboardRoutes from './dashboard.routes.js'
import usersRoutes from './users.routes.js'
import pagesRoutes from './pages.routes.js'
import navigationRoutes from './navigation.routes.js'
import servicesRoutes from './services.routes.js'
import blogsRoutes from './blogs.routes.js'
import caseStudiesRoutes from './caseStudies.routes.js'
import faqsRoutes from './faqs.routes.js'
import mediaRoutes from './media.routes.js'
import seoRoutes from './seo.routes.js'
import eventsRoutes from './events.routes.js'
import campaignRoutes from './campaign.routes.js'
import announcementRoutes from './announcement.routes.js'
import activityLogRoutes from './activityLog.routes.js'

const router = Router()

// /login is the only unauthenticated admin route — everything else below
// requires a valid session, re-verified server-side on every request
// (Section 8).
router.use('/auth', authRoutes)

router.use(requireAuth)

router.use('/dashboard', dashboardRoutes)
router.use('/users', usersRoutes)
router.use('/pages', pagesRoutes)
router.use('/navigation', navigationRoutes)
router.use('/services', servicesRoutes)
router.use('/blogs', blogsRoutes)
router.use('/case-studies', caseStudiesRoutes)
router.use('/faqs', faqsRoutes)
router.use('/media', mediaRoutes)
router.use('/seo', seoRoutes)
router.use('/events', eventsRoutes)
router.use('/campaign', campaignRoutes)
router.use('/announcement', announcementRoutes)
router.use('/activity-log', activityLogRoutes)

export default router
