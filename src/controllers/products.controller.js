import { productService } from '../services/product.service.js'

const buildLink = (req, page, base) => {
    if (!page) return null
    const params = new URLSearchParams({ ...req.query, page })
    return `${base}?${params}`
}

export const buildPaginatedResponse = (req, result, base) => ({
    status: 'success',
    payload: result.docs,
    totalPages: result.totalPages,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: buildLink(req, result.prevPage, base),
    nextLink: buildLink(req, result.nextPage, base)
})

export const getProducts = async (req, res) => {
    const { limit, page, sort, query } = req.query
    const result = await productService.getPaginated({
        limit: Number(limit),
        page: Number(page),
        sort,
        query
    })
    if (result.totalDocs > 0 && result.page > result.totalPages) {
        return res.status(400).json({ status: 'error', message: 'Página inexistente' })
    }
    res.json(buildPaginatedResponse(req, result, req.baseUrl))
}

export const getProductById = async (req, res) => {
    const product = await productService.getById(req.params.pid)
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
    res.json({ status: 'success', payload: product })
}

export const createProduct = async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body
    if (!title || !description || !code || price == null || stock == null || !category) {
        return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' })
    }
    const product = await productService.create({ title, description, code, price, status, stock, category, thumbnails })
    req.app.get('io').emit('updateProducts', await productService.getAll())
    res.status(201).json({ status: 'success', payload: product })
}

export const updateProduct = async (req, res) => {
    const updated = await productService.update(req.params.pid, req.body)
    if (!updated) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
    res.json({ status: 'success', payload: updated })
}

export const deleteProduct = async (req, res) => {
    const deleted = await productService.delete(req.params.pid)
    if (!deleted) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
    req.app.get('io').emit('updateProducts', await productService.getAll())
    res.json({ status: 'success', message: 'Producto eliminado' })
}
