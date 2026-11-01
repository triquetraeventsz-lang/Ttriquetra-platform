import { Router } from 'express'
import Blog from '../../models/Blog.js'
import { ApiError } from '../../utils/ApiError.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { validate } from '../../middleware/validate.js'
import { requireRole } from '../../middleware/auth.js'
import { blogSchema } from '../../utils/validators.js'
import { createCrudController } from '../../utils/crudFactory.js'
import { uniqueSlug } from '../../services/slug.js'
import { logActivity } from '../../services/activityLog.js'

const router = Router()
const crud = createCrudController(Blog, { entityType: 'Blog', searchFields: ['title', 'excerpt'] })

router.get('/', crud.list)
router.get('/:id', crud.getById)

router.post(
  '/',
  validate(blogSchema),
  asyncHandler(async (req, res, next) => {
    req.body.slug = await uniqueSlug(Blog, req.body.slug || req.body.title)
    req.body.author = req.user.id
    next()
  }),
  crud.create,
)

router.put(
  '/:id',
  validate(blogSchema.partial()),
  asyncHandler(async (req, res, next) => {
    if (req.body.slug) req.body.slug = await uniqueSlug(Blog, req.body.slug, req.params.id)
    next()
  }),
  crud.update,
)

// Hard, irreversible delete — ADMIN only, same rule as Services.
router.delete('/:id', requireRole('ADMIN'), crud.remove)

function transitionHandler(action, status) {
  return asyncHandler(async (req, res) => {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { status, updatedBy: req.user.id },
      { new: true },
    )
    if (!blog) throw new ApiError(404, 'Blog not found.')

    await logActivity({
      userId: req.user.id,
      action: `blog.${action}`,
      entityType: 'Blog',
      entityId: blog._id,
      description: `${action[0].toUpperCase()}${action.slice(1)} blog "${blog.title}"`,
    })

    res.json(blog)
  })
}

router.post('/:id/publish', transitionHandler('published', 'PUBLISHED'))
router.post('/:id/unpublish', transitionHandler('unpublished', 'DRAFT'))
router.post('/:id/archive', transitionHandler('archived', 'ARCHIVED'))

export default router
