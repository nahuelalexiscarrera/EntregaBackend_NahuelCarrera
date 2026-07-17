import { cartService, isValidCartProducts } from '../services/cart.service.js'
import { productService } from '../services/product.service.js'

export const createCart = async (req, res) => {
    const cart = await cartService.create()
    res.status(201).json({ status: 'success', payload: cart })
}

export const getCartById = async (req, res) => {
    const cart = await cartService.getByIdPopulated(req.params.cid)
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
    res.json({ status: 'success', payload: cart })
}

export const addProductToCart = async (req, res) => {
    const product = await productService.getById(req.params.pid)
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })

    const cart = await cartService.addProduct(req.params.cid, req.params.pid)
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
    res.json({ status: 'success', payload: cart })
}

export const removeProductFromCart = async (req, res) => {
    const cart = await cartService.removeProduct(req.params.cid, req.params.pid)
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito o producto no encontrado' })
    res.json({ status: 'success', payload: cart })
}

export const replaceCartProducts = async (req, res) => {
    const { products } = req.body
    if (!isValidCartProducts(products)) {
        return res.status(400).json({ status: 'error', message: 'El body debe contener un arreglo products con formato { product, quantity }' })
    }
    const { cart, error } = await cartService.replaceProducts(req.params.cid, products)
    if (error) return res.status(400).json({ status: 'error', message: error })
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
    res.json({ status: 'success', payload: cart })
}

export const updateProductQuantity = async (req, res) => {
    const { quantity } = req.body
    if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ status: 'error', message: 'quantity debe ser un entero mayor o igual a 1' })
    }
    const cart = await cartService.updateQuantity(req.params.cid, req.params.pid, quantity)
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito o producto no encontrado' })
    res.json({ status: 'success', payload: cart })
}

export const clearCart = async (req, res) => {
    const cart = await cartService.clear(req.params.cid)
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })
    res.json({ status: 'success', payload: cart })
}

export const purchaseCart = async (req, res) => {
    const result = await cartService.purchase(req.params.cid, req.user.email)
    if (!result) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' })

    if (!result.ticket && result.notProcessedIds.length === 0) {
        return res.status(400).json({ status: 'error', message: 'El carrito está vacío' })
    }

    const message = result.ticket
        ? 'Compra realizada'
        : 'No se pudo procesar ningún producto por falta de stock'
    res.json({ status: 'success', message, payload: result })
}
