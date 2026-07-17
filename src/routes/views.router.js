import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { attachUser, passportCallView } from '../middlewares/auth.js'
import {
    renderHome,
    renderRealTimeProducts,
    renderProducts,
    renderProductDetail,
    renderCart,
    renderLogin,
    renderRegister
} from '../controllers/views.controller.js'

const router = Router()

router.get('/', attachUser, asyncHandler(renderHome))
router.get('/realtimeproducts', attachUser, renderRealTimeProducts)
router.get('/products', attachUser, asyncHandler(renderProducts))
router.get('/products/:pid', attachUser, asyncHandler(renderProductDetail))
router.get('/carts/:cid', passportCallView, asyncHandler(renderCart))
router.get('/login', attachUser, renderLogin)
router.get('/register', attachUser, renderRegister)

export default router
