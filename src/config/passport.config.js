import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { config } from './env.js'
import { userService } from '../services/user.service.js'
import { cartService } from '../services/cart.service.js'
import { hashPassword, isValidPassword } from '../utils/hash.js'

const cookieExtractor = req => req?.cookies?.[config.cookieName] ?? null

export const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { usernameField: 'email', passReqToCallback: true, session: false },
        async (req, email, password, done) => {
            try {
                const { first_name, last_name, age } = req.body
                if (!first_name || !last_name) {
                    return done(null, false, { message: 'Faltan campos obligatorios' })
                }
                const exists = await userService.getByEmail(email)
                if (exists) {
                    return done(null, false, { message: 'El email ya está registrado' })
                }
                const cart = await cartService.create()
                const user = await userService.create({
                    first_name,
                    last_name,
                    email,
                    age,
                    password: hashPassword(password),
                    cart: cart._id
                })
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('login', new LocalStrategy(
        { usernameField: 'email', session: false },
        async (email, password, done) => {
            try {
                const user = await userService.getByEmail(email)
                if (!user || !isValidPassword(password, user.password)) {
                    return done(null, false, { message: 'Credenciales inválidas' })
                }
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: config.jwtSecret
        },
        (payload, done) => done(null, payload.user)
    ))
}
