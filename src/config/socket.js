import jwt from 'jsonwebtoken'
import { config } from './env.js'
import { productService } from '../services/product.service.js'

const getUserFromCookies = cookieHeader => {
    const token = cookieHeader
        ?.split('; ')
        .find(cookie => cookie.startsWith(`${config.cookieName}=`))
        ?.slice(config.cookieName.length + 1)
    if (!token) return null
    try {
        return jwt.verify(token, config.jwtSecret).user
    } catch {
        return null
    }
}

export const configSocket = io => {
    io.use((socket, next) => {
        socket.data.user = getUserFromCookies(socket.handshake.headers.cookie)
        next()
    })

    io.on('connection', async socket => {
        const isAdmin = socket.data.user?.role === 'admin'

        try {
            socket.emit('updateProducts', await productService.getAll())
        } catch {
            socket.emit('productError', 'No se pudieron cargar los productos')
        }

        socket.on('newProduct', async data => {
            if (!isAdmin) return socket.emit('productError', 'Solo el administrador puede crear productos')
            try {
                await productService.create(data)
                io.emit('updateProducts', await productService.getAll())
            } catch (error) {
                socket.emit('productError', error.code === 11000 ? 'El código ya existe' : 'No se pudo crear el producto')
            }
        })

        socket.on('deleteProduct', async id => {
            if (!isAdmin) return socket.emit('productError', 'Solo el administrador puede eliminar productos')
            try {
                await productService.delete(id)
                io.emit('updateProducts', await productService.getAll())
            } catch {
                socket.emit('productError', 'No se pudo eliminar el producto')
            }
        })
    })
}
