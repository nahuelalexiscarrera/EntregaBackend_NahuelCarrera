import passport from 'passport'

export const passportCall = (strategy, failStatus = 401) => (req, res, next) => {
    passport.authenticate(strategy, { session: false }, (error, user, info) => {
        if (error) return next(error)
        if (!user) {
            return res.status(failStatus).json({ status: 'error', message: info?.message ?? 'No autenticado' })
        }
        req.user = user
        next()
    })(req, res, next)
}

export const passportCallView = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (error, user) => {
        if (error) return next(error)
        if (!user) return res.redirect('/login')
        req.user = user
        res.locals.user = user
        next()
    })(req, res, next)
}

export const attachUser = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (error, user) => {
        req.user = user || null
        res.locals.user = user || null
        next()
    })(req, res, next)
}

export const authorization = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
        return res.status(403).json({ status: 'error', message: 'No autorizado' })
    }
    next()
}

export const authorizationView = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
        return res.redirect('/products')
    }
    next()
}

export const ownCart = (req, res, next) => {
    if (String(req.user?.cart) !== req.params.cid) {
        return res.status(403).json({ status: 'error', message: 'Solo podés operar sobre tu propio carrito' })
    }
    next()
}
