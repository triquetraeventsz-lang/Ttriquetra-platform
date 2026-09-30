import { ApiError } from '../utils/ApiError.js'

/**
 * Wraps a Zod schema into Express middleware. Validates `req.body` by
 * default; pass `{ source: 'query' }` to validate `req.query` instead.
 * Never trusts the frontend's own validation (Section 35).
 */
export function validate(schema, { source = 'body' } = {}) {
  return (req, res, next) => {
    const result = schema.safeParse(req[source])
    if (!result.success) {
      const message = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')
      return next(new ApiError(400, message || 'Invalid request.'))
    }
    req[source] = result.data
    next()
  }
}
