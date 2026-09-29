import { assertConfiguration } from '../config.js'
import { supabaseAdmin } from '../supabase.js'

assertConfiguration()
const [email] = process.argv.slice(2)
if (!email) {
  console.error('Usage: npm run promote:admin -- <email>')
  process.exit(1)
}
const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })
if (error) throw error
const user = data.users.find((candidate) => candidate.email?.toLowerCase() === email.toLowerCase())
if (!user) throw new Error(`No Supabase Auth user exists for ${email}`)
const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, { app_metadata: { ...user.app_metadata, citytwin_role: 'super_admin' } })
if (updateError) throw updateError
console.log(`Granted super_admin access to ${email}`)
