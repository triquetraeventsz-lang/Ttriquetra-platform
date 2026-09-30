import { Router } from 'express'
import bcrypt from 'bcryptjs'
import User from '../../models/User.js'
import { ApiError } from '../../utils/ApiError.js'
import { asyncHandler } from '../../utils/asyncHandler.js'
import { validate } from '../../middleware/validate.js'
import { requireAuth } from '../../middleware/auth.js'
import { loginLimiter } from '../../middleware/rateLimit.js'
import { loginSchema } from '../../utils/validators.js'
import { signToken, cookieOptions, AUTH_COOKIE_NAME } from '../../utils/jwt.js'
import { logActivity } from '../../services/activityLog.js'

const router = Router()

router.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+passwordHash')

    // Same generic message whether the email doesn't exist or the password
    // is wrong — never reveal which one it was.
    if (!user || user.status !== 'ACTIVE') throw new ApiError(401, 'Invalid email or password.')

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) throw new ApiError(401, 'Invalid email or password.')

    user.lastLoginAt = new Date()
    await user.save()

    const token = signToken(user)
    res.cookie(AUTH_COOKIE_NAME, token, cookieOptions())

    await logActivity({
      userId: user._id,
      action: 'user.login',
      entityType: 'User',
      entityId: user._id,
      description: `${user.name} signed in`,
    })

    res.json({ id: user._id, name: user.name, email: user.email, role: user.role })
  }),
)

router.post('/logout', (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, { path: '/' })
  res.status(204).end()
})

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(req.user)
  }),
)

export default router
