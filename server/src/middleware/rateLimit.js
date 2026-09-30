import rateLimit from 'express-rate-limit'

// Applied to public write endpoints (lead forms) to blunt basic abuse
// without adding a heavyweight dependency.
export const leadFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions. Please try again later.' },
})

// Blunts brute-force login attempts. Keyed on IP like the limiter above —
// good enough for V1 (Section 53: don't over-engineer); a shared-IP office
// hitting this would just need to wait 15 minutes.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
})
