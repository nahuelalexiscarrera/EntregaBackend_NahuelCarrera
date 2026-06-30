import { Router } from 'express'
import productManager from '../managers/ProductManager.js'

const router = Router()

router.get('/', async (req, res) => {
    const { limit } = req.query
    const products = await productManager.getAll(limit ? Number(limit) : undefined)
    res.json({ status: 'success', data: products })
})

router.get('/:pid', async (req, res) => {
    const product = await productManager.getById(req.params.pid)
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
    res.json({ status: 'success', data: product })
})

router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body

    if (!title || !description || !code || price == null || stock == null || !category) {
        return res.status(400).json({ status: 'error', message: 'Faltan campos obligatorios' })
    }

    const product = await productManager.add({ title, description, code, price, status, stock, category, thumbnails })

    const io = req.app.get('io')
    const updated = await productManager.getAll()
    io.emit('updateProducts', updated)

    res.status(201).json({ status: 'success', data: product })
})

router.put('/:pid', async (req, res) => {
    const updated = await productManager.update(req.params.pid, req.body)
    if (!updated) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
    res.json({ status: 'success', data: updated })
})

router.delete('/:pid', async (req, res) => {
    const deleted = await productManager.delete(req.params.pid)
    if (!deleted) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })

    const io = req.app.get('io')
    const updated = await productManager.getAll()
    io.emit('updateProducts', updated)

    res.json({ status: 'success', message: 'Producto eliminado' })
})

export default router
