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
