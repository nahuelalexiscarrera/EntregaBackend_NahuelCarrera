import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { passportCall, authorization, ownCart } from '../middlewares/auth.js'
import {
    createCart,
    getCartById,
    addProductToCart,
    removeProductFromCart,
    replaceCartProducts,
    updateProductQuantity,
    clearCart,
    purchaseCart
} from '../controllers/carts.controller.js'

const router = Router()

const userOwnCart = [passportCall('jwt'), authorization('user'), ownCart]

router.post('/', asyncHandler(createCart))
router.get('/:cid', passportCall('jwt'), asyncHandler(getCartById))
router.post('/:cid/products/:pid', userOwnCart, asyncHandler(addProductToCart))
router.delete('/:cid/products/:pid', userOwnCart, asyncHandler(removeProductFromCart))
router.put('/:cid', userOwnCart, asyncHandler(replaceCartProducts))
router.put('/:cid/products/:pid', userOwnCart, asyncHandler(updateProductQuantity))
router.delete('/:cid', userOwnCart, asyncHandler(clearCart))
router.post('/:cid/purchase', userOwnCart, asyncHandler(purchaseCart))

export default router
