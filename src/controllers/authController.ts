import type { Request, Response } from 'express'
import bycrypt from 'bcrypt'
import { db } from '../db/connection.ts'
import { users } from '../db/schema.ts'

export const register = async (req: Request, res: Response) => {
  try {
  } catch (e) {
    console.error('Error during registration:', e)
    res.status(500).json({ message: 'Internal server error' })
  }
}
