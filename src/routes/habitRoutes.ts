import { Router } from 'express'
import { validateBody, validateParams } from '../middleware/validation.ts'
import { z } from 'zod'
import { authenticateToken } from '../middleware/auth.ts'
import {
  createHabit,
  deleteHabit,
  getHabitById,
  getUserHabits,
  updateHabit,
} from '../controllers/habitController.ts'

const createHabitSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  frequency: z.string(),
  targetCount: z.string(),
  tagIds: z.array(z.string()).optional(),
})

const completeHabitParamsSchema = z.object({
  id: z.string().max(3),
})

const router = Router()

router.use(authenticateToken)

router.get('/', getUserHabits)

router.get('/:id', getHabitById)

router.post('/', validateBody(createHabitSchema), createHabit)

router.patch('/:id', updateHabit)

router.delete('/:id', deleteHabit)

export default router
