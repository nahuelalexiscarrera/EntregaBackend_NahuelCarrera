import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { passportCall, authorization } from '../middlewares/auth.js'
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/products.controller.js'

const router = Router()

router.get('/', asyncHandler(getProducts))
router.get('/:pid', asyncHandler(getProductById))
router.post('/', passportCall('jwt'), authorization('admin'), asyncHandler(createProduct))
router.put('/:pid', passportCall('jwt'), authorization('admin'), asyncHandler(updateProduct))
router.delete('/:pid', passportCall('jwt'), authorization('admin'), asyncHandler(deleteProduct))

export default router
