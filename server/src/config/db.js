import dns from 'node:dns'
import mongoose from 'mongoose'
import { env } from './env.js'

let connected = false

/**
 * Connects once on server startup and reuses that single connection for
 * every request (Mongoose maintains its own internal pool — we never open
 * a new connection per request). Fails loudly if MongoDB is unreachable,
 * since serving requests against no database is worse than not starting.
 */
export async function connectDB() {
  if (connected) return mongoose.connection

  // Dev-only, opt-in (DEV_DNS_SERVERS) workaround for Node's default
  // resolver refusing mongodb+srv:// SRV lookups on some Windows/VPN/router
  // setups. Gated on !isProduction too, as a second guard — this must
  // never run against a real deploy host, which should rely entirely on
  // its own provider's DNS.
  if (!env.isProduction && env.devDnsServers.length) {
    dns.setServers(env.devDnsServers)
    // eslint-disable-next-line no-console
    console.log(`DEV_DNS_SERVERS override active: ${env.devDnsServers.join(', ')}`) // public resolver IPs, not secrets
  }

  mongoose.connection.on('error', (err) => {
    // eslint-disable-next-line no-console
    console.error('MongoDB connection error:', err.message)
  })
  mongoose.connection.on('disconnected', () => {
    // eslint-disable-next-line no-console
    console.warn('MongoDB disconnected.')
  })

  try {
    await mongoose.connect(env.mongodbUri, { serverSelectionTimeoutMS: 8000 })
    connected = true
    // eslint-disable-next-line no-console
    console.log(`MongoDB connected: ${mongoose.connection.name}`)
    return mongoose.connection
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Could not connect to MongoDB. Check MONGODB_URI in .env:', err.message)
    process.exit(1)
  }
}

export async function disconnectDB() {
  if (!connected) return
  await mongoose.disconnect()
  connected = false
}
