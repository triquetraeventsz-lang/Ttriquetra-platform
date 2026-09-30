// One-off script to create the very first ADMIN user — there's no other
// way to bootstrap this, since every /api/admin route (including user
// creation) requires already being signed in as an ADMIN.
//
// Usage:
//   node scripts/createAdmin.js "Jane Doe" jane@example.com "a-strong-password"

import bcrypt from 'bcryptjs'
import { env } from '../src/config/env.js'
import { connectDB, disconnectDB } from '../src/config/db.js'
import User from '../src/models/User.js'

async function run() {
  const [name, email, password] = process.argv.slice(2)
  if (!name || !email || !password) {
    console.error('Usage: node scripts/createAdmin.js "Full Name" email@example.com "password"')
    process.exit(1)
  }
  if (password.length < 8) {
    console.error('Password must be at least 8 characters.')
    process.exit(1)
  }

  await connectDB()

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) {
    console.error(`A user with email ${email} already exists.`)
    await disconnectDB()
    process.exit(1)
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await User.create({ name, email: email.toLowerCase(), passwordHash, role: 'ADMIN' })

  console.log(`Created ADMIN user: ${user.email}`)
  await disconnectDB()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
