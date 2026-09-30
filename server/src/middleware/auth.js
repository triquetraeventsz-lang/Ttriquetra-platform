import { ApiError } from '../utils/ApiError.js'
import { verifyToken, AUTH_COOKIE_NAME } from '../utils/jwt.js'
import User from '../models/User.js'

/**
 * Verifies the admin session independently on every request — the
 * frontend's route guard is a UX convenience only, this is the actual
 * security boundary (Section 8).
 */
export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[AUTH_COOKIE_NAME] || req.headers.authorization?.replace(/^Bearer /, '')
    if (!token) throw new ApiError(401, 'You must be signed in.')

    const payload = verifyToken(token)
    const user = await User.findById(payload.sub)
    if (!user || user.status !== 'ACTIVE') throw new ApiError(401, 'Your session is no longer valid.')

    req.user = { id: String(user._id), role: user.role, name: user.name, email: user.email }
    next()
  } catch (err) {
    if (err instanceof ApiError) return next(err)
    next(new ApiError(401, 'Your session has expired. Please sign in again.'))
  }
}

/**
 * Gate a route to specific roles. Always used *after* requireAuth.
 * EDITOR is blocked from ADMIN-only routes here, server-side (Section 7) —
 * the admin UI simply won't show those controls to an EDITOR, but this is
 * what actually enforces it.
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return next(new ApiError(401, 'You must be signed in.'))
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to do that.'))
    }
    next()
  }
}
