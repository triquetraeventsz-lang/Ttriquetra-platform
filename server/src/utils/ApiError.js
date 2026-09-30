// A known, expected error with a status code and a message safe to show
// the admin. Anything that isn't an ApiError is treated as unexpected by
// the error handler and never has its details shown to the client.
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
    this.name = 'ApiError'
  }
}
