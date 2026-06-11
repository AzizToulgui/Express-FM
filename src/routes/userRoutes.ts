import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.ts'
import {
  changePassword,
  deleteUser,
  getAllusers,
  getProfile,
  updateProfile,
} from '../controllers/userController.ts'

const router = Router()

router.use(authenticateToken)

router.get('/', getAllusers)

router.get('/:id', getProfile)

router.post('/:id', changePassword)

router.put('/:id', updateProfile)

router.delete('/:id', deleteUser)

export default router
