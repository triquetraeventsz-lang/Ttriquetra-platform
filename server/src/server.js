import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'
import { connectDB } from './config/db.js'
import publicRoutes from './routes/public/index.js'
import adminRoutes from './routes/admin/index.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'

async function main() {
  await connectDB()

  const app = express()

  // Standard security headers. Defaults are fine here — this API only ever
  // serves JSON/CSV/XML, never HTML, so there's no page to write a CSP for.
  app.use(helmet())

  // Only the known client/admin origins may send credentials (the admin
  // auth cookie) cross-origin — never a wildcard alongside credentials.
  app.use(
    cors({
      origin: [env.clientUrl, env.adminUrl],
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '2mb' }))
  app.use(cookieParser())

  app.get('/health', (req, res) => res.json({ ok: true }))

  app.use('/api/public', publicRoutes)
  app.use('/api/admin', adminRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${env.port} (${env.nodeEnv})`)
  })
}

main()
