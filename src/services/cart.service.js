import mongoose from 'mongoose'
import { Cart } from '../models/cart.model.js'
import { Product } from '../models/product.model.js'
import { Ticket } from '../models/ticket.model.js'

class CartService {
    async create() {
        const cart = await Cart.create({})
        return cart.toObject()
    }

    async getByIdPopulated(id) {
        return Cart.findById(id).populate('products.product').lean()
    }

    async addProduct(cartId, productId) {
        const incremented = await Cart.findOneAndUpdate(
            { _id: cartId, 'products.product': productId },
            { $inc: { 'products.$.quantity': 1 } },
            { new: true }
        ).lean()
        if (incremented) return incremented

        return Cart.findByIdAndUpdate(
            cartId,
            { $push: { products: { product: productId, quantity: 1 } } },
            { new: true }
        ).lean()
    }

    async removeProduct(cartId, productId) {
        return Cart.findOneAndUpdate(
            { _id: cartId, 'products.product': productId },
            { $pull: { products: { product: productId } } },
            { new: true }
        ).lean()
    }

    async replaceProducts(cartId, products) {
        const ids = products.map(item => item.product)
        const found = await Product.countDocuments({ _id: { $in: ids } })
        if (found !== new Set(ids.map(String)).size) return { error: 'Uno o más productos no existen' }

        const cart = await Cart.findByIdAndUpdate(
            cartId,
            { products },
            { new: true, runValidators: true }
        ).lean()
        return { cart }
    }

    async updateQuantity(cartId, productId, quantity) {
        return Cart.findOneAndUpdate(
            { _id: cartId, 'products.product': productId },
            { $set: { 'products.$.quantity': quantity } },
            { new: true, runValidators: true }
        ).lean()
    }

    async clear(cartId) {
        return Cart.findByIdAndUpdate(cartId, { products: [] }, { new: true }).lean()
    }

    async purchase(cartId, purchaserEmail) {
        const cart = await Cart.findById(cartId).populate('products.product').lean()
        if (!cart) return null

        let amount = 0
        const notProcessed = []

        for (const item of cart.products) {
            if (!item.product) continue
            const updated = await Product.findOneAndUpdate(
                { _id: item.product._id, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { new: true }
            )
            if (updated) {
                amount += item.product.price * item.quantity
            } else {
                notProcessed.push({ product: item.product._id, quantity: item.quantity })
            }
        }

        let ticket = null
        if (amount > 0) {
            ticket = await Ticket.create({ amount, purchaser: purchaserEmail })
            ticket = ticket.toObject()
        }

        await Cart.findByIdAndUpdate(cartId, { products: notProcessed })

        return { ticket, notProcessedIds: notProcessed.map(item => item.product) }
    }
}

export const cartService = new CartService()

export const isValidCartProducts = products =>
    Array.isArray(products) && products.every(item =>
        item &&
        typeof item === 'object' &&
        mongoose.isValidObjectId(item.product) &&
        Number.isInteger(item.quantity) &&
        item.quantity >= 1
    )
