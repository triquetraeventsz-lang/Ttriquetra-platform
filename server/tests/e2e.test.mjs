// Full end-to-end test of the Phase 1 backend against a real, temporary
// MongoDB (mongodb-memory-server) — not mocked. Deleted after use; this is
// not part of the shipped app.
import { MongoMemoryServer } from 'mongodb-memory-server'
import { spawn } from 'node:child_process'
import http from 'node:http'

const mongod = await MongoMemoryServer.create()
const uri = mongod.getUri('triquetra_test')
console.log('In-memory MongoDB started at', uri)

const PORT = 5099
const env = {
  ...process.env,
  PORT: String(PORT),
  MONGODB_URI: uri,
  JWT_SECRET: 'e2e-test-secret',
  CLIENT_URL: 'http://localhost:5173',
  ADMIN_URL: 'http://localhost:5174',
  NODE_ENV: 'development',
  // Simulates running behind one reverse-proxy hop (Render/Railway/Fly-style),
  // so the X-Forwarded-For checks below actually exercise that code path.
  TRUST_PROXY_HOPS: '1',
}

const server = spawn('node', ['src/server.js'], { env, stdio: ['ignore', 'pipe', 'pipe'] })
server.stdout.on('data', (d) => process.stdout.write('[server] ' + d))
server.stderr.on('data', (d) => process.stderr.write('[server:err] ' + d))

async function waitForServer() {
  for (let i = 0; i < 30; i++) {
    try {
      await fetch(`http://localhost:${PORT}/health`)
      return
    } catch {
      await new Promise((r) => setTimeout(r, 300))
    }
  }
  throw new Error('Server did not come up in time')
}

function extractCookie(res) {
  const raw = res.headers.get('set-cookie')
  if (!raw) return null
  return raw.split(';')[0]
}

const results = []
function check(name, cond, detail = '') {
  results.push({ name, pass: !!cond, detail })
  console.log(`${cond ? 'PASS' : 'FAIL'} — ${name}${detail ? ' :: ' + detail : ''}`)
}

try {
  await waitForServer()
  check('server started against in-memory MongoDB', true)

  // 1. Create the first admin user via the seed script's own logic
  const { default: bcrypt } = await import('bcryptjs')
  const mongoose = (await import('mongoose')).default
  await mongoose.connect(uri)
  const User = (await import('../src/models/User.js')).default
  const passwordHash = await bcrypt.hash('AdminPass123', 12)
  const admin = await User.create({ name: 'Test Admin', email: 'admin@test.com', passwordHash, role: 'ADMIN' })
  const editorHash = await bcrypt.hash('EditorPass123', 12)
  const editor = await User.create({ name: 'Test Editor', email: 'editor@test.com', passwordHash: editorHash, role: 'EDITOR' })
  check('seeded ADMIN and EDITOR users directly in DB', true)

  const base = `http://localhost:${PORT}`

  // 2. Every /api/admin route requires auth
  const meNoAuth = await fetch(`${base}/api/admin/auth/me`)
  check('GET /auth/me without cookie -> 401', meNoAuth.status === 401, `got ${meNoAuth.status}`)

  const servicesNoAuth = await fetch(`${base}/api/admin/services`)
  check('GET /admin/services without cookie -> 401', servicesNoAuth.status === 401, `got ${servicesNoAuth.status}`)

  // 3. Login as ADMIN
  const loginRes = await fetch(`${base}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@test.com', password: 'AdminPass123' }),
  })
  const adminCookie = extractCookie(loginRes)
  check('ADMIN login succeeds and sets a cookie', loginRes.status === 200 && !!adminCookie, `status ${loginRes.status}`)

  // With TRUST_PROXY_HOPS=1 set above, express-rate-limit should read the
  // real client IP from X-Forwarded-For via Express's trust-proxy setting
  // instead of throwing its "trust proxy" validation error — which is
  // exactly what happens if this is deployed behind a real reverse proxy
  // without that setting (see server.js).
  const proxiedLoginRes = await fetch(`${base}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '203.0.113.5' },
    body: JSON.stringify({ email: 'admin@test.com', password: 'wrong-on-purpose' }),
  })
  check(
    'Login behind a trusted proxy (X-Forwarded-For set) does not 500',
    proxiedLoginRes.status === 401,
    `got ${proxiedLoginRes.status}`,
  )

  const wrongPassRes = await fetch(`${base}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@test.com', password: 'wrong' }),
  })
  check('login with wrong password -> 401', wrongPassRes.status === 401, `got ${wrongPassRes.status}`)

  // 4. /me with the cookie
  const meRes = await fetch(`${base}/api/admin/auth/me`, { headers: { Cookie: adminCookie } })
  const me = await meRes.json()
  check('GET /auth/me with cookie returns correct user', me.email === 'admin@test.com' && me.role === 'ADMIN', JSON.stringify(me))

  // 5. Login as EDITOR, confirm role restriction on /admin/users (ADMIN only)
  const editorLoginRes = await fetch(`${base}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'editor@test.com', password: 'EditorPass123' }),
  })
  const editorCookie = extractCookie(editorLoginRes)
  check('EDITOR login succeeds', editorLoginRes.status === 200 && !!editorCookie)

  const editorTriesUsers = await fetch(`${base}/api/admin/users`, { headers: { Cookie: editorCookie } })
  check('EDITOR hitting ADMIN-only /admin/users -> 403', editorTriesUsers.status === 403, `got ${editorTriesUsers.status}`)

  const adminUsers = await fetch(`${base}/api/admin/users`, { headers: { Cookie: adminCookie } })
  check('ADMIN hitting /admin/users -> 200', adminUsers.status === 200, `got ${adminUsers.status}`)

  // 6. EDITOR CAN manage content (Services)
  const createServiceAsEditor = await fetch(`${base}/api/admin/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: editorCookie },
    body: JSON.stringify({ name: 'Test Service Editor Made', shortDescription: 'x' }),
  })
  check('EDITOR can create a Service', createServiceAsEditor.status === 201, `got ${createServiceAsEditor.status}`)

  // 7. Create a published Service as ADMIN, confirm it appears in public API
  const createServiceRes = await fetch(`${base}/api/admin/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({
      name: 'Events',
      shortDescription: 'Corporate events and exhibitions.',
      status: 'PUBLISHED',
      processSteps: [
        { title: 'Brief', order: 0 },
        { title: 'Hidden Step', order: 1, hidden: true },
      ],
    }),
  })
  const createdService = await createServiceRes.json()
  check('ADMIN creates a PUBLISHED service with a slug', createServiceRes.status === 201 && !!createdService.slug, JSON.stringify(createdService.slug))

  const publicServices = await fetch(`${base}/api/public/services`).then((r) => r.json())
  check('Published service appears in public API', publicServices.some((s) => s.slug === createdService.slug))

  const publicServiceDetail = await fetch(`${base}/api/public/services/${createdService.slug}`).then((r) => r.json())
  check(
    'Public service detail hides the "hidden" process step',
    publicServiceDetail.processSteps.length === 1 && publicServiceDetail.processSteps[0].title === 'Brief',
    JSON.stringify(publicServiceDetail.processSteps),
  )

  // A DRAFT service must never reach the public API
  const draftServiceRes = await fetch(`${base}/api/admin/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({ name: 'Draft Only Service' }),
  })
  const draftService = await draftServiceRes.json()
  const publicServices2 = await fetch(`${base}/api/public/services`).then((r) => r.json())
  check('DRAFT service does NOT appear in public API', !publicServices2.some((s) => s.slug === draftService.slug))

  // 8. Slug collision handling
  const dupServiceRes = await fetch(`${base}/api/admin/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({ name: 'Events' }), // same name as before -> slug collision
  })
  const dupService = await dupServiceRes.json()
  check('Duplicate name gets a unique slug (not the same as the first)', dupService.slug !== createdService.slug, dupService.slug)

  // 8b. Service creation rejects an empty/missing name
  const noNameRes = await fetch(`${base}/api/admin/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({ name: '' }),
  })
  check('Creating a Service with an empty name is rejected by validation', noNameRes.status === 400, `got ${noNameRes.status}`)

  // 8c. DELETE /api/admin/services/:id — authorization + referential integrity
  const serviceToDelete = await fetch(`${base}/api/admin/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({ name: 'Deletable Service' }),
  }).then((r) => r.json())

  const deleteAsEditorRes = await fetch(`${base}/api/admin/services/${serviceToDelete._id}`, {
    method: 'DELETE',
    headers: { Cookie: editorCookie },
  })
  check('EDITOR deleting a Service -> 403', deleteAsEditorRes.status === 403, `got ${deleteAsEditorRes.status}`)

  const referencingCaseStudy = await fetch(`${base}/api/admin/case-studies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({ title: 'Referencing Case Study', services: [serviceToDelete._id] }),
  }).then((r) => r.json())

  const deleteReferencedRes = await fetch(`${base}/api/admin/services/${serviceToDelete._id}`, {
    method: 'DELETE',
    headers: { Cookie: adminCookie },
  })
  const deleteReferencedBody = await deleteReferencedRes.json().catch(() => ({}))
  check(
    'ADMIN deleting a service referenced by a CaseStudy is blocked (409)',
    deleteReferencedRes.status === 409 && deleteReferencedBody.error?.includes('Referencing Case Study'),
    JSON.stringify(deleteReferencedBody),
  )

  // Remove the reference, confirm deletion now succeeds
  await fetch(`${base}/api/admin/case-studies/${referencingCaseStudy._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({ services: [] }),
  })
  const deleteUnreferencedRes = await fetch(`${base}/api/admin/services/${serviceToDelete._id}`, {
    method: 'DELETE',
    headers: { Cookie: adminCookie },
  })
  check('ADMIN deleting an unreferenced Service -> 204', deleteUnreferencedRes.status === 204, `got ${deleteUnreferencedRes.status}`)

  const getDeletedRes = await fetch(`${base}/api/admin/services/${serviceToDelete._id}`, { headers: { Cookie: adminCookie } })
  check('Deleted service no longer retrievable via admin API (404)', getDeletedRes.status === 404, `got ${getDeletedRes.status}`)

  const deleteAgainRes = await fetch(`${base}/api/admin/services/${serviceToDelete._id}`, {
    method: 'DELETE',
    headers: { Cookie: adminCookie },
  })
  check('Repeating the same delete request -> 404, not a crash', deleteAgainRes.status === 404, `got ${deleteAgainRes.status}`)

  // A published-then-deleted service must disappear from the public API too
  const pubServiceForDelete = await fetch(`${base}/api/admin/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({ name: 'Published Then Deleted', status: 'PUBLISHED' }),
  }).then((r) => r.json())

  const beforeDeletePublic = await fetch(`${base}/api/public/services/${pubServiceForDelete.slug}`)
  check('Published service visible publicly before delete', beforeDeletePublic.status === 200, `got ${beforeDeletePublic.status}`)

  await fetch(`${base}/api/admin/services/${pubServiceForDelete._id}`, { method: 'DELETE', headers: { Cookie: adminCookie } })
  const afterDeletePublic = await fetch(`${base}/api/public/services/${pubServiceForDelete.slug}`)
  check('Deleted service is no longer available via the public API', afterDeletePublic.status === 404, `got ${afterDeletePublic.status}`)

  // 8d. Same ADMIN-only delete restriction, applied to Blogs, Case Studies, FAQs
  const blogToDelete = await fetch(`${base}/api/admin/blogs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({ title: 'Deletable Blog', content: 'Some content.' }),
  }).then((r) => r.json())

  const deleteBlogAsEditorRes = await fetch(`${base}/api/admin/blogs/${blogToDelete._id}`, {
    method: 'DELETE',
    headers: { Cookie: editorCookie },
  })
  check('EDITOR deleting a Blog -> 403', deleteBlogAsEditorRes.status === 403, `got ${deleteBlogAsEditorRes.status}`)

  const deleteBlogAsAdminRes = await fetch(`${base}/api/admin/blogs/${blogToDelete._id}`, {
    method: 'DELETE',
    headers: { Cookie: adminCookie },
  })
  check('ADMIN deleting a Blog -> 204', deleteBlogAsAdminRes.status === 204, `got ${deleteBlogAsAdminRes.status}`)

  const caseStudyToDelete = await fetch(`${base}/api/admin/case-studies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({ title: 'Deletable Case Study' }),
  }).then((r) => r.json())

  const deleteCaseStudyAsEditorRes = await fetch(`${base}/api/admin/case-studies/${caseStudyToDelete._id}`, {
    method: 'DELETE',
    headers: { Cookie: editorCookie },
  })
  check('EDITOR deleting a CaseStudy -> 403', deleteCaseStudyAsEditorRes.status === 403, `got ${deleteCaseStudyAsEditorRes.status}`)

  const deleteCaseStudyAsAdminRes = await fetch(`${base}/api/admin/case-studies/${caseStudyToDelete._id}`, {
    method: 'DELETE',
    headers: { Cookie: adminCookie },
  })
  check('ADMIN deleting a CaseStudy -> 204', deleteCaseStudyAsAdminRes.status === 204, `got ${deleteCaseStudyAsAdminRes.status}`)

  const faqToDelete = await fetch(`${base}/api/admin/faqs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({ question: 'Deletable FAQ?', answer: 'Yes.', page: 'other' }),
  }).then((r) => r.json())

  const deleteFaqAsEditorRes = await fetch(`${base}/api/admin/faqs/${faqToDelete._id}`, {
    method: 'DELETE',
    headers: { Cookie: editorCookie },
  })
  check('EDITOR deleting a FAQ -> 403', deleteFaqAsEditorRes.status === 403, `got ${deleteFaqAsEditorRes.status}`)

  const deleteFaqAsAdminRes = await fetch(`${base}/api/admin/faqs/${faqToDelete._id}`, {
    method: 'DELETE',
    headers: { Cookie: adminCookie },
  })
  check('ADMIN deleting a FAQ -> 204', deleteFaqAsAdminRes.status === 204, `got ${deleteFaqAsAdminRes.status}`)

  // 9. Event + CampaignPhase + active-phase time logic (the core scheduling feature)
  const eventRes = await fetch(`${base}/api/admin/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({ name: 'Test Concert 2026', landingPageEnabled: true, mainWebsiteEnabled: true }),
  })
  const event = await eventRes.json()
  check('ADMIN creates an Event', eventRes.status === 201 && !!event.slug)

  const now = Date.now()
  const phasesInput = [
    { name: 'Past Phase', startAt: new Date(now - 5 * 86400000), endAt: new Date(now - 3 * 86400000), publicHeadline: 'Old', showOnLandingPage: true, showOnMainWebsite: true },
    { name: 'Current Phase', startAt: new Date(now - 86400000), endAt: new Date(now + 86400000), publicHeadline: 'Something Big Is Coming', showOnLandingPage: true, showOnMainWebsite: false },
    { name: 'Future Phase', startAt: new Date(now + 3 * 86400000), endAt: new Date(now + 5 * 86400000), publicHeadline: 'Future', showOnLandingPage: true, showOnMainWebsite: true },
  ]
  for (const phase of phasesInput) {
    const r = await fetch(`${base}/api/admin/events/${event._id}/campaign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
      body: JSON.stringify(phase),
    })
    if (r.status !== 201) throw new Error(`Failed to create phase ${phase.name}: ${r.status}`)
  }
  check('Created 3 campaign phases (past, current, future)', true)

  const landingCampaign = await fetch(`${base}/api/public/events/${event.slug}/campaign?context=landing`).then((r) => r.json())
  check(
    'Public landing-page campaign endpoint returns the CURRENT phase (not past/future)',
    landingCampaign.activePhase?.publicHeadline === 'Something Big Is Coming',
    JSON.stringify(landingCampaign),
  )

  const mainSiteCampaign = await fetch(`${base}/api/public/events/${event.slug}/campaign?context=main`).then((r) => r.json())
  check(
    'Same active phase is HIDDEN from main-website context (showOnMainWebsite: false)',
    mainSiteCampaign.activePhase === null,
    JSON.stringify(mainSiteCampaign),
  )

  // 10. Lead submission is correctly rejected while leadForm.enabled is false on this event
  const leadRes = await fetch(`${base}/api/public/events/${event.slug}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Jane Lead', email: 'jane@example.com' }),
  })
  const leadJson = await leadRes.json().catch(() => ({}))
  check('Lead rejected because leadForm.enabled is false on this event', leadRes.status === 404, JSON.stringify(leadJson))

  // Now enable the lead form and confirm a submission actually succeeds and is stored.
  await fetch(`${base}/api/admin/events/${event._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({ leadForm: { enabled: true, fields: ['name', 'email'], successMessage: "You're on the list." } }),
  })
  const leadRes2 = await fetch(`${base}/api/public/events/${event.slug}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Jane Lead', email: 'jane@example.com' }),
  })
  const leadJson2 = await leadRes2.json().catch(() => ({}))
  check('Lead submission succeeds once leadForm.enabled is true', leadRes2.status === 201, JSON.stringify(leadJson2))

  const submissionsRes = await fetch(`${base}/api/admin/events/${event._id}/submissions`, { headers: { Cookie: adminCookie } })
  const submissions = await submissionsRes.json()
  check('Admin submissions list shows the one real lead just submitted', submissions.total === 1 && submissions.items[0].email === 'jane@example.com', JSON.stringify(submissions))

  const csvRes = await fetch(`${base}/api/admin/events/${event._id}/submissions/export.csv`, { headers: { Cookie: adminCookie } })
  const csvText = await csvRes.text()
  check('CSV export contains the lead', csvRes.status === 200 && csvText.includes('jane@example.com'), csvText.slice(0, 120))

  // With TRUST_PROXY_HOPS=1 set above, this should behave normally instead
  // of throwing express-rate-limit's "trust proxy" validation error — the
  // exact crash that would happen on every request once deployed behind a
  // real reverse proxy without that setting (see server.js).
  const proxiedLeadRes = await fetch(`${base}/api/public/events/${event.slug}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '203.0.113.7' },
    body: JSON.stringify({ name: 'Proxied Jane', email: 'proxied-jane@example.com' }),
  })
  check(
    'Lead submission behind a trusted proxy (X-Forwarded-For set) does not 500',
    proxiedLeadRes.status === 201,
    `got ${proxiedLeadRes.status}`,
  )

  // 11. Validation rejects bad input
  const badEmailRes = await fetch(`${base}/api/admin/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: adminCookie },
    body: JSON.stringify({ name: 'Bad', email: 'not-an-email', password: 'password123', role: 'EDITOR' }),
  })
  check('Zod validation rejects an invalid email', badEmailRes.status === 400, `got ${badEmailRes.status}`)

  // 12. Error responses never leak stack traces
  const notFoundRes = await fetch(`${base}/api/admin/services/000000000000000000000000`, { headers: { Cookie: adminCookie } })
  const notFoundBody = await notFoundRes.json()
  check(
    '404 response is a clean JSON message, no stack trace',
    notFoundRes.status === 404 && typeof notFoundBody.error === 'string' && !notFoundBody.error.includes('at '),
    JSON.stringify(notFoundBody),
  )

  // 13. Activity log recorded real actions
  const activityRes = await fetch(`${base}/api/admin/activity-log`, { headers: { Cookie: adminCookie } })
  const activity = await activityRes.json()
  check('Activity log has entries for what just happened', activity.total > 0, `total=${activity.total}`)

  // 14. Dashboard summary aggregates correctly
  const dashboardRes = await fetch(`${base}/api/admin/dashboard/summary`, { headers: { Cookie: adminCookie } })
  const dashboard = await dashboardRes.json()
  check(
    'Dashboard summary reflects real counts',
    dashboard.cards.activeEvents === 0 && dashboard.upcomingCampaigns.length >= 1,
    JSON.stringify(dashboard.cards),
  )

  // 15. Logout clears the session
  await fetch(`${base}/api/admin/auth/logout`, { method: 'POST', headers: { Cookie: adminCookie } })
  const meAfterLogout = await fetch(`${base}/api/admin/auth/me`, { headers: { Cookie: adminCookie } })
  // Note: JWT itself is stateless and still valid until expiry even after
  // "logout" clears the cookie client-side — this call reuses the same
  // token manually, so 200 here is expected, not a bug. Documented as a
  // known V1 trade-off in the plan (no refresh/blocklist in V1).
  check('Logout endpoint responds (stateless JWT still valid until expiry, as documented)', meAfterLogout.status === 200)

  await mongoose.disconnect()
} finally {
  server.kill()
  await mongod.stop()
}

const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`)
if (failed.length) {
  console.log('FAILED CHECKS:', failed.map((f) => f.name).join(', '))
  process.exit(1)
}
process.exit(0)
