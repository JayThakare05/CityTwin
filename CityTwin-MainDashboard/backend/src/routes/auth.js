import { Router } from 'express'
import { supabaseAdmin } from '../supabase.js'

const router = Router()

router.post('/login', async (request, response, next) => {
  try {
    const { email, password } = request.body
    if (!email || !password) return response.status(400).json({ error: 'Email and password are required.' })
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({ email, password })
    if (error || !data.session || !data.user) return response.status(401).json({ error: 'Invalid email or password.' })
    const role = data.user.app_metadata?.citytwin_role
    if (!['admin', 'super_admin'].includes(role)) {
      await supabaseAdmin.auth.signOut(data.session.access_token)
      return response.status(403).json({ error: 'This account does not have active administrator access.' })
    }
    response.json({ access_token: data.session.access_token, expires_at: data.session.expires_at, admin: { id: data.user.id, role } })
  } catch (error) { next(error) }
})

export default router
