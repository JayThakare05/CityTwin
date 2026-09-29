import 'dotenv/config'

const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'OPENWEATHER_API_KEY']

export function assertConfiguration() {
  const missing = required.filter((name) => !process.env[name])
  if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
}

export const config = {
  port: Number(process.env.PORT || 8000),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  groqApiKey: process.env.GROQ_API_KEY,
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
  tomtomApiKey: process.env.TOMTOM_API_KEY,
  cityLatitude: Number(process.env.CITY_LATITUDE || 19.195),
  cityLongitude: Number(process.env.CITY_LONGITUDE || 72.975),
  // “groq-gpt-oss-12b” is not a Groq API model ID; Groq documents this 120B ID.
  groqReportVerificationModel: process.env.GROQ_REPORT_VERIFICATION_MODEL || 'openai/gpt-oss-120b',
}
