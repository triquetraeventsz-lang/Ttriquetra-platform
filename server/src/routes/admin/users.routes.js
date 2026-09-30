import { Router } from 'express'
import bcrypt from 'bcryptjs'
import User from '../../models/User.js'
import { ApiError } from '../../utils/ApiError.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { validate } from '../../middleware/validate.js'
import { requireRole } from '../../middleware/auth.js'
import { createUserSchema, updateUserSchema } from '../../utils/validators.js'
import { logActivity } from '../../services/activityLog.js'

const router = Router()

// Every route here is ADMIN-only (Section 7: EDITOR must not manage
// administrator accounts).
router.use(requireRole('ADMIN'))

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 }).lean()
    res.json(users)
  }),
)

router.post(
  '/',
  validate(createUserSchema),
  asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body
    const existing = await User.findOne({ email })
    if (existing) throw new ApiError(409, 'A user with that email already exists.')

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ name, email, passwordHash, role })

    await logActivity({
      userId: req.user.id,
      action: 'user.created',
      entityType: 'User',
      entityId: user._id,
      description: `Created ${role} user ${email}`,
    })

    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role })
  }),
)

router.put(
  '/:id',
  validate(updateUserSchema),
  asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!user) throw new ApiError(404, 'User not found.')

    await logActivity({
      userId: req.user.id,
      action: 'user.updated',
      entityType: 'User',
      entityId: user._id,
      description: `Updated user ${user.email}`,
    })

    res.json({ id: user._id, name: user.name, email: user.email, role: user.role, status: user.status })
  }),
)

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    if (req.params.id === req.user.id) throw new ApiError(400, 'You cannot delete your own account.')
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) throw new ApiError(404, 'User not found.')

    await logActivity({
      userId: req.user.id,
      action: 'user.deleted',
      entityType: 'User',
      entityId: user._id,
      description: `Deleted user ${user.email}`,
    })

    res.status(204).end()
  }),
)

export default router
