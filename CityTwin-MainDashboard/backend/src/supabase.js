import { createClient } from '@supabase/supabase-js'
import { config } from './config.js'

export const supabaseAdmin = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

export async function getUserFromToken(token) {
  if (!token) return null
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error) return null
  return data.user
}

export async function isActiveAdmin(userId) {
  const { data, error } = await supabaseAdmin
    .from('admin_profiles')
    .select('id, role')
    .eq('id', userId)
    .eq('is_active', true)
    .maybeSingle()
  if (error) throw error
  return data
}
