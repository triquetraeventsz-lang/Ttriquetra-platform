import { Router } from 'express'
import FAQ from '../../models/FAQ.js'
import { validate } from '../../middleware/validate.js'
import { faqSchema } from '../../utils/validators.js'
import { createCrudController } from '../../utils/crudFactory.js'

const router = Router()
const crud = createCrudController(FAQ, { entityType: 'FAQ', searchFields: ['question'] })

router.get('/', crud.list)
router.get('/:id', crud.getById)
router.post('/', validate(faqSchema), crud.create)
router.put('/:id', validate(faqSchema.partial()), crud.update)
router.delete('/:id', crud.remove)

export default router
