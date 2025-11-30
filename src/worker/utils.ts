import jwt from 'jsonwebtoken'

const SECRET = 'your-super-secret-key'

export const generateToken = (username: string, role: string) => {
  return jwt.sign({ username, role }, SECRET, { expiresIn: '12h' })
}

export const verifyToken = (token?: string) => {
  if (!token) return null
  try {
    return jwt.verify(token, SECRET) as { username: string; role: string }
  } catch {
    return null
  }
}
