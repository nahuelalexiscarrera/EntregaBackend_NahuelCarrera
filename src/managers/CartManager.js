import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.resolve(__dirname, '../data/carts.json')

class CartManager {
    async #read() {
        try {
            const raw = await fs.readFile(DB_PATH, 'utf-8')
            return JSON.parse(raw)
        } catch {
            return { nextId: 1, carts: [] }
        }
    }

    async #write(data) {
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2))
    }

    async create() {
        const db = await this.#read()
        const cart = { id: db.nextId++, products: [] }
        db.carts.push(cart)
        await this.#write(db)
        return cart
    }

    async getById(id) {
        const { carts } = await this.#read()
        return carts.find(c => c.id === Number(id)) ?? null
    }

    async addProduct(cartId, productId) {
        const db = await this.#read()
        const cart = db.carts.find(c => c.id === Number(cartId))
        if (!cart) return null

        const existing = cart.products.find(p => p.product === Number(productId))
        if (existing) {
            existing.quantity++
        } else {
            cart.products.push({ product: Number(productId), quantity: 1 })
        }

        await this.#write(db)
        return cart
    }
}

export default new CartManager()
