import { getUserFromToken } from '../supabase.js'

function bearerToken(request) {
  const [scheme, token] = (request.headers.authorization || '').split(' ')
  return scheme === 'Bearer' && token ? token : null
}

export async function requireUser(request, response, next) {
  try {
    const user = await getUserFromToken(bearerToken(request))
    if (!user) return response.status(401).json({ error: 'A valid Supabase access token is required.' })
    request.user = user
    next()
  } catch (error) {
    next(error)
  }
}

export async function requireAdmin(request, response, next) {
  try {
    const user = await getUserFromToken(bearerToken(request))
    if (!user) return response.status(401).json({ error: 'A valid Supabase access token is required.' })
    const role = user.app_metadata?.citytwin_role
    if (!['admin', 'super_admin'].includes(role)) return response.status(403).json({ error: 'An active administrator account is required.' })
    request.user = user
    request.admin = { id: user.id, role }
    next()
  } catch (error) {
    next(error)
  }
}
