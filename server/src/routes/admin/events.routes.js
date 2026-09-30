import { Router } from 'express'
import Event from '../../models/Event.js'
import CampaignPhase from '../../models/CampaignPhase.js'
import FormSubmission from '../../models/FormSubmission.js'
import { ApiError } from '../../utils/ApiError.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { validate } from '../../middleware/validate.js'
import { eventSchema, campaignPhaseSchema } from '../../utils/validators.js'
import { createCrudController } from '../../utils/crudFactory.js'
import { uniqueSlug } from '../../services/slug.js'
import { logActivity } from '../../services/activityLog.js'

const router = Router()
const crud = createCrudController(Event, { entityType: 'Event', searchFields: ['name', 'publicName'] })

router.get('/', crud.list)
router.get('/:id', crud.getById)

router.post(
  '/',
  validate(eventSchema),
  asyncHandler(async (req, res, next) => {
    req.body.slug = await uniqueSlug(Event, req.body.slug || req.body.name)
    next()
  }),
  crud.create,
)

router.put(
  '/:id',
  validate(eventSchema.partial()),
  asyncHandler(async (req, res, next) => {
    if (req.body.slug) req.body.slug = await uniqueSlug(Event, req.body.slug, req.params.id)
    next()
  }),
  crud.update,
)

router.delete('/:id', crud.remove)

// --- Campaign phases, nested under their event ---

router.get(
  '/:eventId/campaign',
  asyncHandler(async (req, res) => {
    const phases = await CampaignPhase.find({ eventId: req.params.eventId }).sort({ startAt: 1 }).lean()
    res.json(phases)
  }),
)

router.post(
  '/:eventId/campaign',
  validate(campaignPhaseSchema),
  asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.eventId)
    if (!event) throw new ApiError(404, 'Event not found.')

    const phase = await CampaignPhase.create({
      ...req.body,
      eventId: event._id,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    })

    await logActivity({
      userId: req.user.id,
      action: 'campaignphase.created',
      entityType: 'CampaignPhase',
      entityId: phase._id,
      description: `Added phase "${phase.name}" to event "${event.name}"`,
    })

    res.status(201).json(phase)
  }),
)

// --- Leads collected via this event's landing page form ---

router.get(
  '/:eventId/submissions',
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 50 } = req.query
    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.min(200, Math.max(1, Number(limit)))

    const [items, total] = await Promise.all([
      FormSubmission.find({ eventId: req.params.eventId })
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      FormSubmission.countDocuments({ eventId: req.params.eventId }),
    ])

    res.json({ items, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) })
  }),
)

router.get(
  '/:eventId/submissions/export.csv',
  asyncHandler(async (req, res) => {
    const submissions = await FormSubmission.find({ eventId: req.params.eventId }).sort({ createdAt: -1 }).lean()

    const escape = (v = '') => `"${String(v).replace(/"/g, '""')}"`
    const header = 'Name,Email,Phone,Date,Source'
    const rows = submissions.map((s) =>
      [s.name, s.email, s.phone || '', s.createdAt.toISOString(), s.source].map(escape).join(','),
    )

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"')
    res.send([header, ...rows].join('\n'))
  }),
)

export default router
