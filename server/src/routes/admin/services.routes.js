import { Router } from 'express'
import Service from '../../models/Service.js'
import CaseStudy from '../../models/CaseStudy.js'
import { ApiError } from '../../utils/ApiError.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { validate } from '../../middleware/validate.js'
import { requireRole } from '../../middleware/auth.js'
import { serviceSchema } from '../../utils/validators.js'
import { createCrudController } from '../../utils/crudFactory.js'
import { uniqueSlug } from '../../services/slug.js'

const router = Router()
const crud = createCrudController(Service, { entityType: 'Service', searchFields: ['name'] })

router.get('/', crud.list)
router.get('/:id', crud.getById)

router.post(
  '/',
  validate(serviceSchema),
  asyncHandler(async (req, res, next) => {
    req.body.slug = await uniqueSlug(Service, req.body.slug || req.body.name)
    next()
  }),
  crud.create,
)

router.put(
  '/:id',
  validate(serviceSchema.partial()),
  asyncHandler(async (req, res, next) => {
    if (req.body.slug) {
      req.body.slug = await uniqueSlug(Service, req.body.slug, req.params.id)
    }
    next()
  }),
  crud.update,
)

// Deleting a Service is a hard, irreversible delete (no trash/restore in
// this schema) — reserved for ADMIN only, matching how this project
// already gates its other irreversible/administrative actions (Users,
// Site Settings). EDITOR can still create/edit/publish Services, just
// not delete them.
router.delete(
  '/:id',
  requireRole('ADMIN'),
  asyncHandler(async (req, res, next) => {
    // A CaseStudy holds raw ObjectId refs in `services`, never populated
    // anywhere — deleting a referenced Service would silently leave a
    // dangling reference with no error on either side. Block it instead,
    // naming the actual case study so the admin knows what to fix first.
    const referencedBy = await CaseStudy.findOne({ services: req.params.id }).select('title').lean()
    if (referencedBy) {
      throw new ApiError(
        409,
        `This service is referenced by the case study "${referencedBy.title}" and cannot be deleted. Remove it from that case study first.`,
      )
    }
    next()
  }),
  crud.remove,
)

export default router
