import bycrypt from 'bcrypt'
import env from '../../env.ts'

export const hashePassword = async (password: string) => {
  return bycrypt.hash(password, env.BCRYPT_ROUNDS)
}

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  return bycrypt.compare(password, hashedPassword)
}
