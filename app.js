import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import passport from 'passport'

import { config } from './src/config/env.js'
import { connectDB } from './src/config/db.js'
import { initializePassport } from './src/config/passport.config.js'
import { configSocket } from './src/config/socket.js'
import { notFound, errorHandler } from './src/middlewares/errorHandler.js'
import productsRouter from './src/routes/products.router.js'
import cartsRouter from './src/routes/carts.router.js'
import sessionsRouter from './src/routes/sessions.router.js'
import viewsRouter from './src/routes/views.router.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

await connectDB()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

app.engine('handlebars', engine({
    helpers: {
        multiply: (a, b) => a * b,
        eq: (a, b) => a === b
    }
}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'src/views'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser())

initializePassport()
app.use(passport.initialize())

app.set('io', io)

app.use('/', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionsRouter)

app.use(notFound)
app.use(errorHandler)

configSocket(io)

httpServer.listen(config.port, () => console.log(`Servidor escuchando en http://localhost:${config.port}`))
