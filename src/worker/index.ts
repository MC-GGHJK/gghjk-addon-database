import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { verifyToken, generateToken } from './utils'

const app = new Hono()
app.use('*', cors())

// login endpoint
app.post('/api/login', async c => {
  const { username, password } = await c.req.json()
  // MOCK: uživatelé
  const users = [
    { username: 'Beard', password: '1234', role: 'uploader' },
    { username: 'Admin', password: 'admin', role: 'admin' },
  ]
  const user = users.find(u => u.username === username && u.password === password)
  if (!user) return c.json({ error: 'Invalid credentials' }, 401)

  const token = generateToken(user.username, user.role)
  return c.json({ token, role: user.role })
})

// Middleware pro ověření role
const authMiddleware = (role: string) => async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')
  if (!token) return c.json({ error: 'Not authenticated' }, 401)

  const user = verifyToken(token)
  if (!user || user.role !== role) return c.json({ error: 'No permission' }, 403)

  return next()
}

// upload endpoint
app.post('/api/upload', authMiddleware('uploader'), async c => {
  const formData = await c.req.formData()
  const file = formData.get('file') as File
  if (!file) return c.json({ error: 'No file provided' }, 400)

  // validace typu
  const allowed = ['zip', 'mcaddon']
  const ext = file.name.split('.').pop()
  if (!ext || !allowed.includes(ext)) return c.json({ error: 'Invalid file type' }, 400)

  // uložit do R2 bucketu
  await R2_BUCKET.put(file.name, file.stream())
  return c.json({ success: true })
})

// seznam souborů
app.get('/api/files', async c => {
  const list = await R2_BUCKET.list()
  return c.json(list.objects.map(obj => obj.key))
})

export default app
