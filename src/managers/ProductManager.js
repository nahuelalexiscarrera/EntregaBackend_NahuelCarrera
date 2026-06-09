import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.resolve(__dirname, '../data/products.json')

class ProductManager {
    async #read() {
        try {
            const raw = await fs.readFile(DB_PATH, 'utf-8')
            return JSON.parse(raw)
        } catch {
            return { nextId: 1, products: [] }
        }
    }

    async #write(data) {
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2))
    }

    async getAll(limit) {
        const { products } = await this.#read()
        return limit ? products.slice(0, limit) : products
    }

    async getById(id) {
        const { products } = await this.#read()
        return products.find(p => p.id === Number(id)) ?? null
    }

    async add({ title, description, code, price, status = true, stock, category, thumbnails = [] }) {
        const db = await this.#read()
        const product = {
            id: db.nextId++,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        }
        db.products.push(product)
        await this.#write(db)
        return product
    }

    async update(id, fields) {
        const db = await this.#read()
        const idx = db.products.findIndex(p => p.id === Number(id))
        if (idx === -1) return null
        const { id: _removed, ...safeFields } = fields
        db.products[idx] = { ...db.products[idx], ...safeFields }
        await this.#write(db)
        return db.products[idx]
    }

    async delete(id) {
        const db = await this.#read()
        const idx = db.products.findIndex(p => p.id === Number(id))
        if (idx === -1) return false
        db.products.splice(idx, 1)
        await this.#write(db)
        return true
    }
}

export default new ProductManager()
