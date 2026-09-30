import { ApiError } from '../utils/ApiError.js'

export function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Not found.' })
}

/**
 * Central error handler. Known errors (ApiError — validation, auth,
 * not-found, etc.) return their own clean message. Anything else is
 * logged server-side in full and reported to the client as a generic
 * message — never a raw stack trace or MongoDB error string
 * (Section 48).
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message })
  }

  if (err.name === 'ValidationError') {
    // Mongoose validation error
    return res.status(400).json({ error: 'Some of the submitted data was invalid.' })
  }

  if (err.code === 11000) {
    // Mongo duplicate key
    return res.status(409).json({ error: 'That value is already in use.' })
  }

  // eslint-disable-next-line no-console
  console.error('Unexpected server error:', err)
  res.status(500).json({ error: 'Unable to complete this request. Please try again.' })
}
