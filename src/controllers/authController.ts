import type { Request, Response } from 'express'
import bycrypt from 'bcrypt'
import { db } from '../db/connection.ts'
import { users, type NewUser } from '../db/schema.ts'
import { generateToken } from '../utils/jwt.ts'
import { hashePassword } from '../utils/password.ts'

export const register = async (
  req: Request<any, any, NewUser>,
  res: Response,
) => {
  try {
    const hashedPassword = await hashePassword(req.body.password)
    const [user] = await db
      .insert(users)
      .values({
        ...req.body,
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstname: users.firstname,
        lastname: users.lastname,
        createdAt: users.createdAt,
      })

    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })

    return res
      .status(201)
      .json({ message: 'User registered successfully', user, token })
  } catch (e) {
    console.error('Error during registration:', e)
    res.status(500).json({ message: 'Internal server error' })
  }
}
