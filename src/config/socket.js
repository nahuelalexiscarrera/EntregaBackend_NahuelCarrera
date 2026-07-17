import { productService } from '../services/product.service.js'

export const configSocket = io => {
    io.on('connection', async socket => {
        try {
            socket.emit('updateProducts', await productService.getAll())
        } catch (error) {
            socket.emit('productError', 'No se pudieron cargar los productos')
        }

        socket.on('newProduct', async data => {
            try {
                await productService.create(data)
                io.emit('updateProducts', await productService.getAll())
            } catch (error) {
                socket.emit('productError', error.code === 11000 ? 'El código ya existe' : 'No se pudo crear el producto')
            }
        })

        socket.on('deleteProduct', async id => {
            try {
                await productService.delete(id)
                io.emit('updateProducts', await productService.getAll())
            } catch (error) {
                socket.emit('productError', 'No se pudo eliminar el producto')
            }
        })
    })
}
