import { Router } from 'express'
import productManager from '../managers/ProductManager.js'

const router = Router()

router.get('/', async (req, res) => {
    const products = await productManager.getAll()
    res.render('home', { products })
})

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts')
})

export default router
