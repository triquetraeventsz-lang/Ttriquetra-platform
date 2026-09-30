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

  // Optional: only required if the media library is actually used.
  r2: {
    accountId: process.env.R2_ACCOUNT_ID || '',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    bucket: process.env.R2_BUCKET || '',
    publicUrl: process.env.R2_PUBLIC_URL || '',
  },
}
