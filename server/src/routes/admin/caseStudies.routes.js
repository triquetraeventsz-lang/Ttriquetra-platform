import { Router } from 'express'
import CaseStudy from '../../models/CaseStudy.js'
import { ApiError } from '../../utils/ApiError.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { validate } from '../../middleware/validate.js'
import { caseStudySchema } from '../../utils/validators.js'
import { createCrudController } from '../../utils/crudFactory.js'
import { uniqueSlug } from '../../services/slug.js'
import { logActivity } from '../../services/activityLog.js'

const router = Router()
const crud = createCrudController(CaseStudy, { entityType: 'CaseStudy', searchFields: ['title', 'client'] })

router.get('/', crud.list)
router.get('/:id', crud.getById)

router.post(
  '/',
  validate(caseStudySchema),
  asyncHandler(async (req, res, next) => {
    req.body.slug = await uniqueSlug(CaseStudy, req.body.slug || req.body.title)
    next()
  }),
  crud.create,
)

router.put(
  '/:id',
  validate(caseStudySchema.partial()),
  asyncHandler(async (req, res, next) => {
    if (req.body.slug) req.body.slug = await uniqueSlug(CaseStudy, req.body.slug, req.params.id)
    next()
  }),
  crud.update,
)

router.delete('/:id', crud.remove)

router.post(
  '/:id/publish',
  asyncHandler(async (req, res) => {
    const item = await CaseStudy.findByIdAndUpdate(
      req.params.id,
      { status: 'PUBLISHED', updatedBy: req.user.id },
      { new: true },
    )
    if (!item) throw new ApiError(404, 'Case study not found.')
    await logActivity({
      userId: req.user.id,
      action: 'casestudy.published',
      entityType: 'CaseStudy',
      entityId: item._id,
      description: `Published case study "${item.title}"`,
    })
    res.json(item)
  }),
)

router.post(
  '/:id/unpublish',
  asyncHandler(async (req, res) => {
    const item = await CaseStudy.findByIdAndUpdate(req.params.id, { status: 'DRAFT', updatedBy: req.user.id }, { new: true })
    if (!item) throw new ApiError(404, 'Case study not found.')
    res.json(item)
  }),
)

export default router
