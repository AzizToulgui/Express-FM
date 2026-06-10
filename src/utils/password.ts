import bycrypt from 'bcrypt'
import env from '../../env.ts'

export const hashePassword = async (password: string) => {
  return bycrypt.hash(password, env.BCRYPT_ROUNDS)
}
