import { isValidObjectId } from 'mongoose'
import { productService } from '../services/product.service.js'
import { cartService } from '../services/cart.service.js'
import { buildPaginatedResponse } from './products.controller.js'

export const renderHome = async (req, res) => {
    const products = await productService.getAll()
    res.render('home', { products })
}

export const renderRealTimeProducts = (req, res) => {
    res.render('realTimeProducts')
}

export const renderProducts = async (req, res) => {
    const { limit, page, sort, query } = req.query
    const result = await productService.getPaginated({
        limit: Number(limit),
        page: Number(page),
        sort,
        query
    })
    const pagination = buildPaginatedResponse(req, result, '/products')
    res.render('index', {
        products: result.docs,
        pagination
    })
}

export const renderProductDetail = async (req, res) => {
    if (!isValidObjectId(req.params.pid)) {
        return res.status(404).render('index', { products: [], notFoundMessage: 'Producto no encontrado' })
    }
    const product = await productService.getById(req.params.pid)
    if (!product) return res.status(404).render('index', { products: [], notFoundMessage: 'Producto no encontrado' })
    res.render('productDetail', { product })
}

export const renderCart = async (req, res) => {
    if (!isValidObjectId(req.params.cid)) {
        return res.status(404).render('cart', { items: [], notFoundMessage: 'Carrito no encontrado' })
    }
    const cart = await cartService.getByIdPopulated(req.params.cid)
    if (!cart) return res.status(404).render('cart', { items: [], notFoundMessage: 'Carrito no encontrado' })

    const items = cart.products
        .filter(item => item.product)
        .map(item => ({
            ...item,
            subtotal: item.product.price * item.quantity
        }))
    const total = items.reduce((acc, item) => acc + item.subtotal, 0)

    res.render('cart', { cartId: cart._id, items, total })
}

export const renderLogin = (req, res) => {
    if (req.user) return res.redirect('/products')
    res.render('login')
}

export const renderRegister = (req, res) => {
    if (req.user) return res.redirect('/products')
    res.render('register')
}
