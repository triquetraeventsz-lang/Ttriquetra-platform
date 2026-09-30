import { Router } from 'express'
import Event from '../../models/Event.js'
import FormSubmission from '../../models/FormSubmission.js'
import { ApiError } from '../../utils/ApiError.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { validate } from '../../middleware/validate.js'
import { leadFormLimiter } from '../../middleware/rateLimit.js'
import { leadSubmissionSchema } from '../../utils/validators.js'
import { getActivePhase } from '../../services/activePhase.js'

const router = Router()

async function findVisibleEvent(slug) {
  const event = await Event.findOne({
    slug,
    $or: [{ landingPageEnabled: true }, { mainWebsiteEnabled: true }],
  })
    .select('-leadForm.notificationEmail -internalName -createdBy -updatedBy -__v')
    .lean()
  if (!event) throw new ApiError(404, 'Event not found.')
  return event
}

router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    res.json(await findVisibleEvent(req.params.slug))
  }),
)

router.get(
  '/:slug/campaign',
  asyncHandler(async (req, res) => {
    const event = await findVisibleEvent(req.params.slug)
    const context = req.query.context === 'main' ? 'main' : 'landing'
    const phase = await getActivePhase(event._id)

    // A phase can be live for one surface and hidden on the other (e.g.
    // "Artist Reveal": landing page ON, main website OFF — Section 28).
    // Each consumer only ever sees what its own flag allows.
    const visibleHere = phase && (context === 'main' ? phase.showOnMainWebsite : phase.showOnLandingPage)

    res.json({
      activePhase: visibleHere
        ? {
            name: phase.name,
            publicHeadline: phase.publicHeadline,
            publicMessage: phase.publicMessage,
            image: phase.image,
            video: phase.video,
            ctaLabel: phase.ctaLabel,
            ctaUrl: phase.ctaUrl,
          }
        : null,
    })
  }),
)

router.post(
  '/:slug/leads',
  leadFormLimiter,
  validate(leadSubmissionSchema),
  asyncHandler(async (req, res) => {
    const event = await Event.findOne({ slug: req.params.slug })
    if (!event || !event.leadForm?.enabled) throw new ApiError(404, 'This event is not accepting submissions.')

    await FormSubmission.create({
      eventId: event._id,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      source: 'event-landing-page',
    })

    res.status(201).json({ message: event.leadForm.successMessage || "You're on the list." })
  }),
)

export default router
