import { Router } from 'express'
import { validateBody, validateParams } from '../middleware/validation.ts'
import { z } from 'zod'
import { authenticateToken } from '../middleware/auth.ts'

const createHabitSchema = z.object({
  name: z.string(),
})

const completeHabitParamsSchema = z.object({
  id: z.string().max(3),
})

const router = Router()

router.use(authenticateToken)

router.get('/', (req, res) => {
  res.json({ message: 'Get all habits' })
})

router.get('/:id', (req, res) => {
  res.json({ message: `Get habit with id: ${req.params.id}` })
})

router.post('/', validateBody(createHabitSchema), (req, res) => {
  res.status(201).json({ message: 'Create a new habit' })
})

router.delete('/:id', (req, res) => {
  res.json({ message: `Delete habit with id: ${req.params.id}` })
})

router.post(
  '/:id/complete',
  validateParams(completeHabitParamsSchema),
  validateBody(createHabitSchema),
  (req, res) => {
    res.json({ message: `Mark habit with id: ${req.params.id} as complete` })
  },
)

export default router
