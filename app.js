import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { engine } from 'express-handlebars'
import path from 'path'
import { fileURLToPath } from 'url'

import productsRouter from './src/routes/products.router.js'
import cartsRouter from './src/routes/carts.router.js'
import viewsRouter from './src/routes/views.router.js'
import productManager from './src/managers/ProductManager.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)
const PORT = 8080

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'src/views'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.set('io', io)

app.use('/', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

io.on('connection', async (socket) => {
    const products = await productManager.getAll()
    socket.emit('updateProducts', products)

    socket.on('newProduct', async (data) => {
        await productManager.add(data)
        const updated = await productManager.getAll()
        io.emit('updateProducts', updated)
    })

    socket.on('deleteProduct', async (id) => {
        await productManager.delete(id)
        const updated = await productManager.getAll()
        io.emit('updateProducts', updated)
    })
})

httpServer.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`))
