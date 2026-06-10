import { Router } from 'express'

const router = Router()

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
