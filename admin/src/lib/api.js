export const API_URL = import.meta.env.VITE_API_URL || 'https://services.triquetraevents.co.in'

// Render's free-tier backend can take a while to wake from a cold start —
// long enough that, without a bound, a request can sit with no response
// at all and the UI has no way to tell "still working" from "broken."
const DEFAULT_TIMEOUT_MS = 30000

export class ApiError extends Error {
  constructor(status, message, { isTimeout = false } = {}) {
    super(message)
    this.status = status
    // An aborted request tells us nothing about whether the server ever
    // received or finished it — callers must treat the outcome as
    // unknown, never as "it definitely failed."
    this.isTimeout = isTimeout
  }
}

/**
 * Thin fetch wrapper: sends the httpOnly auth cookie (`credentials:
 * 'include'`), and throws an ApiError with the server's own message on
 * failure — the server already returns clean, safe-to-show messages
 * (Phase 1's errorHandler), so the UI never needs to invent its own.
 *
 * Every request is bounded by an AbortController timeout (default 30s,
 * overridable per call via `timeout`, or disabled with `timeout: 0`).
 */
async function request(path, { method = 'GET', body, headers, isForm, timeout = DEFAULT_TIMEOUT_MS } = {}) {
  const controller = new AbortController()
  const timer = timeout ? setTimeout(() => controller.abort(), timeout) : null

  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      credentials: 'include',
      headers: isForm ? headers : { 'Content-Type': 'application/json', ...headers },
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
      signal: controller.signal,
    })
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError(0, 'The request took longer than expected.', { isTimeout: true })
    }
    throw err
  } finally {
    if (timer) clearTimeout(timer)
  }

  if (res.status === 204) return null

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json().catch(() => null) : await res.text()

  if (!res.ok) {
    throw new ApiError(res.status, (isJson && data?.error) || 'Something went wrong. Please try again.')
  }

  return data
}

export const api = {
  get: (path, opts) => request(path, opts),
  post: (path, body, opts) => request(path, { method: 'POST', body, ...opts }),
  put: (path, body, opts) => request(path, { method: 'PUT', body, ...opts }),
  del: (path, opts) => request(path, { method: 'DELETE', ...opts }),
}
