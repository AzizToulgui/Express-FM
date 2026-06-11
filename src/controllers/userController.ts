import type { Response } from 'express'
import type { AuthenticatedRequest } from '../middleware/auth.ts'
import { db } from '../db/connection.ts'
import { users } from '../db/schema.ts'
import { eq, and, desc } from 'drizzle-orm'
import { comparePassword, hashePassword } from '../utils/password.ts'

export const getAllusers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const allUsers = await db.query.users.findMany({
      orderBy: desc(users.createdAt),
    })
    res.json({ users: allUsers })
  } catch (e) {
    console.error('Error fetching users:', e)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
}

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstname,
        lastName: users.lastname,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      })
    }

    res.json({ user })
  } catch (e) {
    console.error('Get profile error:', e)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
}

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id
    const { email, username, firstname, lastname } = req.body
    const [updatedUser] = await db
      .update(users)
      .set({
        email,
        username,
        firstname,
        lastname,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstname,
        lastName: users.lastname,
        updatedAt: users.updatedAt,
      })

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    })
  } catch (e) {
    console.error('Update profile error:', e)
    res.status(500).json({ error: 'Failed to update profile' })
  }
}

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user!.id
    const { currentPassword, newPassword } = req.body
    const [user] = await db.select().from(users).where(eq(users.id, userId))

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const isValidPassword = await comparePassword(
      currentPassword,
      user.password,
    )

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    const hashedPassword = await hashePassword(newPassword)

    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))

    res.json({ message: 'Password changed successfully' })
  } catch (e) {
    console.error('Update profile error:', e)
    res.status(500).json({ error: 'Failed to update profile' })
  }
}

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id

    const [deletedUser] = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning()

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ message: 'User deleted successfully' })
  } catch (e) {
    console.error('Delete user error:', e)
    res.status(500).json({ error: 'Failed to delete user' })
  }
}
