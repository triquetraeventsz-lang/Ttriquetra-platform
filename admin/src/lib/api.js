export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

/**
 * Thin fetch wrapper: sends the httpOnly auth cookie (`credentials:
 * 'include'`), and throws an ApiError with the server's own message on
 * failure — the server already returns clean, safe-to-show messages
 * (Phase 1's errorHandler), so the UI never needs to invent its own.
 */
async function request(path, { method = 'GET', body, headers, isForm } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    credentials: 'include',
    headers: isForm ? headers : { 'Content-Type': 'application/json', ...headers },
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  })

  if (res.status === 204) return null

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json().catch(() => null) : await res.text()

  if (!res.ok) {
    throw new ApiError(res.status, (isJson && data?.error) || 'Something went wrong. Please try again.')
  }

  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body, opts) => request(path, { method: 'POST', body, ...opts }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path) => request(path, { method: 'DELETE' }),
}
