import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

const EXPIRES_IN = '8h'
export const AUTH_COOKIE_NAME = 'triquetra_admin_token'

export function signToken(user) {
  return jwt.sign({ sub: String(user._id), role: user.role }, env.jwtSecret, { expiresIn: EXPIRES_IN })
}

export function verifyToken(token) {
  return jwt.verify(token, env.jwtSecret)
}

export function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000,
    path: '/',
  }
}
