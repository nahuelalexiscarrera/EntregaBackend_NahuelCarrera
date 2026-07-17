import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'

export const TOKEN_TTL_MS = 60 * 60 * 1000

export const generateToken = user => jwt.sign({ user }, config.jwtSecret, { expiresIn: TOKEN_TTL_MS / 1000 })

export const cookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: TOKEN_TTL_MS
}
