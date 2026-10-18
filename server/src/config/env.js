import 'dotenv/config'

const required = ['MONGODB_URI', 'JWT_SECRET']

for (const key of required) {
  if (!process.env[key]) {
    // Fail loudly and immediately — never start half-configured.
    // eslint-disable-next-line no-console
    console.error(`Missing required environment variable: ${key}. Check .env against .env.example.`)
    process.exit(1)
  }
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:5174',
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  // 0 = trust no proxy (correct for local dev, where there is none — trusting
  // one when there isn't would let a client spoof X-Forwarded-For to dodge
  // IP-based rate limiting). Set to 1+ once a real reverse-proxy host is chosen.
  trustProxyHops: Number(process.env.TRUST_PROXY_HOPS) || 0,

  // Dev-only DNS resolver override — see .env.example. Empty array (the
  // default) means "do nothing, use Node's normal resolver."
  devDnsServers: (process.env.DEV_DNS_SERVERS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),

  // Optional: only required if the media library is actually used.
  r2: {
    accountId: process.env.R2_ACCOUNT_ID || '',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    bucket: process.env.R2_BUCKET || '',
    publicUrl: process.env.R2_PUBLIC_URL || '',
  },
}
