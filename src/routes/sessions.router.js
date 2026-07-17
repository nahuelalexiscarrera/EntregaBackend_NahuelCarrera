import { Router } from 'express'
import { passportCall } from '../middlewares/auth.js'
import { register, login, current, logout } from '../controllers/sessions.controller.js'

const router = Router()

router.post('/register', passportCall('register', 400), register)
router.post('/login', passportCall('login'), login)
router.get('/current', passportCall('jwt'), current)
router.post('/logout', logout)

export default router
