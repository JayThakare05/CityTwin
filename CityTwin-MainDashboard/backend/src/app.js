import cors from 'cors'
import express from 'express'
import { config } from './config.js'
import authRoutes from './routes/auth.js'
import cityRoutes from './routes/city.js'
import reportRoutes from './routes/reports.js'

const app = express()
app.use(cors({ origin: config.frontendOrigin, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/city', cityRoutes)
app.use('/api', cityRoutes)
app.use('/api/reports', reportRoutes)
app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(500).json({ error: 'The server could not complete this request.' })
})

export default app
