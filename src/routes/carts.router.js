import { Router } from 'express'
import cartManager from '../managers/CartManager.js'
import productManager from '../managers/ProductManager.js'

const router = Router()

router.post('/', async (req, res) => {
    const cart = await cartManager.create()
    res.status(201).json({ status: 'success', data: cart })
})

router.get('/:cid', async (req, res) => {
    const cart = await cartManager.getById(req.params.cid)
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
    res.json({ status: 'success', data: cart })
})

router.post('/:cid/product/:pid', async (req, res) => {
    const product = await productManager.getById(req.params.pid)
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })

    const cart = await cartManager.addProduct(req.params.cid, req.params.pid)
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })

    res.json({ status: 'success', data: cart })
})

export default router
