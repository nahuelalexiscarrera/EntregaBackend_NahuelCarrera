import { config } from '../config/env.js'
import { generateToken, cookieOptions } from '../utils/jwt.js'

const tokenPayload = user => ({
    id: user._id,
    first_name: user.first_name,
    email: user.email,
    role: user.role,
    cart: user.cart
})

export const register = (req, res) => {
    res.status(201).json({ status: 'success', message: 'Usuario registrado' })
}

export const login = (req, res) => {
    const token = generateToken(tokenPayload(req.user))
    res.cookie(config.cookieName, token, cookieOptions)
    res.json({ status: 'success', message: 'Sesión iniciada' })
}

export const current = (req, res) => {
    res.json({ status: 'success', payload: req.user })
}

export const logout = (req, res) => {
    res.clearCookie(config.cookieName)
    res.json({ status: 'success', message: 'Sesión cerrada' })
}
