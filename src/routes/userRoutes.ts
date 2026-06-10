import { Router } from 'express'
import { authenticateToken } from '../middleware/auth.ts'

const router = Router()

router.use(authenticateToken)

router.get('/', (req, res) => {
  res.json({ message: 'Get all users' })
})

router.get('/:id', (req, res) => {
  res.json({ message: `Get user with id: ${req.params.id}` })
})

router.put('/:id', (req, res) => {
  res.json({ message: `Update user with id: ${req.params.id}` })
})

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete user with id: ${req.params.id}` })
})

export default router
