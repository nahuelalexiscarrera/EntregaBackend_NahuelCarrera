import { Product } from '../models/product.model.js'

const escapeRegex = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const buildFilter = query => {
    if (!query) return {}
    if (query === 'disponible') return { status: true, stock: { $gt: 0 } }
    if (query === 'nodisponible') return { $or: [{ status: false }, { stock: 0 }] }
    return { category: { $regex: `^${escapeRegex(query)}$`, $options: 'i' } }
}

class ProductService {
    async getPaginated({ limit, page, sort, query }) {
        const options = {
            limit: Number.isInteger(limit) && limit > 0 ? limit : 10,
            page: Number.isInteger(page) && page > 0 ? page : 1,
            lean: true
        }
        if (sort === 'asc' || sort === 'desc') {
            options.sort = { price: sort === 'asc' ? 1 : -1 }
        }
        return Product.paginate(buildFilter(query), options)
    }

    async getAll() {
        return Product.find().lean()
    }

    async getById(id) {
        return Product.findById(id).lean()
    }

    async create(data) {
        const product = await Product.create(data)
        return product.toObject()
    }

    async update(id, fields) {
        const { _id, ...safeFields } = fields
        return Product.findByIdAndUpdate(id, safeFields, { new: true, runValidators: true }).lean()
    }

    async delete(id) {
        const deleted = await Product.findByIdAndDelete(id)
        return deleted !== null
    }
}

export const productService = new ProductService()
