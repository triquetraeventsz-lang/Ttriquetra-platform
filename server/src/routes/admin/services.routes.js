import { Router } from 'express'
import Service from '../../models/Service.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { validate } from '../../middleware/validate.js'
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

router.delete('/:id', crud.remove)

export default router
