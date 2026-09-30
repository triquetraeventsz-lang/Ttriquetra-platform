// Read-only wrapper around the public backend API (Phase 4). No cookies or
// auth — every one of these endpoints is public/read-only, matching the
// server's own /api/public route group.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    ...(body ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}),
  })

  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json().catch(() => null) : null

  if (!res.ok) {
    throw new ApiError(res.status, (isJson && data?.error) || 'Something went wrong. Please try again.')
  }

  return data
}

export const getEvent = (slug) => request(`/api/public/events/${slug}`)
export const getCampaign = (slug, context = 'landing') => request(`/api/public/events/${slug}/campaign?context=${context}`)
export const submitLead = (slug, fields) => request(`/api/public/events/${slug}/leads`, { method: 'POST', body: fields })
export const getActiveAnnouncement = () => request('/api/public/announcement/active')
