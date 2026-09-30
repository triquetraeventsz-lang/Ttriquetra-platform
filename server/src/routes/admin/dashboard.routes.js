import { Router } from 'express'
import Page from '../../models/Page.js'
import Blog from '../../models/Blog.js'
import CaseStudy from '../../models/CaseStudy.js'
import Event from '../../models/Event.js'
import CampaignPhase from '../../models/CampaignPhase.js'
import FormSubmission from '../../models/FormSubmission.js'
import ActivityLog from '../../models/ActivityLog.js'
import { asyncHandler } from '../../utils/asyncHandler.js'

const router = Router()

router.get(
  '/summary',
  asyncHandler(async (req, res) => {
    const now = new Date()

    const [
      publishedPages,
      draftBlogs,
      publishedBlogs,
      caseStudies,
      activeEvents,
      scheduledPhases,
      recentSubmissions,
      upcomingCampaigns,
      recentActivity,
    ] = await Promise.all([
      Page.countDocuments({ status: 'ACTIVE' }),
      Blog.countDocuments({ status: 'DRAFT' }),
      Blog.countDocuments({ status: 'PUBLISHED' }),
      CaseStudy.countDocuments({ status: 'PUBLISHED' }),
      Event.countDocuments({ status: 'ACTIVE' }),
      CampaignPhase.countDocuments({ startAt: { $gt: now } }),
      FormSubmission.find().sort({ createdAt: -1 }).limit(5).lean(),
      CampaignPhase.find({ startAt: { $gt: now } })
        .sort({ startAt: 1 })
        .limit(5)
        .populate('eventId', 'name')
        .lean(),
      ActivityLog.find().sort({ timestamp: -1 }).limit(10).populate('userId', 'name').lean(),
    ])

    res.json({
      cards: {
        publishedPages,
        draftBlogs,
        publishedBlogs,
        caseStudies,
        activeEvents,
        scheduledCampaignPhases: scheduledPhases,
        recentFormSubmissions: recentSubmissions.length,
      },
      upcomingCampaigns: upcomingCampaigns.map((p) => ({
        eventName: p.eventId?.name ?? 'Unknown event',
        phaseName: p.name,
        scheduledAt: p.startAt,
      })),
      recentActivity: recentActivity.map((a) => ({
        user: a.userId?.name ?? 'Unknown',
        description: a.description,
        timestamp: a.timestamp,
      })),
    })
  }),
)

export default router
