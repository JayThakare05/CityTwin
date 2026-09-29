import { assertConfiguration } from '../config.js'

assertConfiguration()
const [email, password, ...nameParts] = process.argv.slice(2)
if (!email || !password || !nameParts.length) {
  console.error('Usage: npm run bootstrap:admin -- <email> <password> <full name>')
  process.exit(1)
}

const { supabaseAdmin } = await import('../supabase.js')
const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })
if (listError) throw listError
const existingUser = users.users.find((user) => user.email?.toLowerCase() === email.toLowerCase())
const userPayload = { password, email_confirm: true, app_metadata: { ...(existingUser?.app_metadata || {}), citytwin_role: 'super_admin' } }
const result = existingUser
  ? await supabaseAdmin.auth.admin.updateUserById(existingUser.id, userPayload)
  : await supabaseAdmin.auth.admin.createUser({ email, ...userPayload })
if (result.error || !result.data.user) throw result.error || new Error('Supabase did not return an administrator user.')

const { error: profileError } = await supabaseAdmin.from('admin_profiles').upsert({
  id: result.data.user.id, email, name: nameParts.join(' '), role: 'super_admin', is_active: true,
}, { onConflict: 'id' })
if (profileError) throw profileError
console.log(`${existingUser ? 'Updated' : 'Created'} active super admin: ${email}`)
