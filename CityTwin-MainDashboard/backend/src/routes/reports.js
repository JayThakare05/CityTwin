import { Router } from 'express'
import { requireAdmin, requireUser } from '../middleware/auth.js'
import { verifyReportWithGroq } from '../services/reportVerification.js'
import { supabaseAdmin } from '../supabase.js'
import { config } from '../config.js'

const router = Router()
const allowedSeverity = new Set(['low', 'medium', 'high', 'critical'])

router.post('/', requireUser, async (request, response, next) => {
  try {
    const { category_id, title, description, zone_id, severity = 'medium', latitude, longitude } = request.body
    if (!category_id || !title || !Number.isFinite(Number(latitude)) || !Number.isFinite(Number(longitude))) {
      return response.status(400).json({ error: 'category_id, title, latitude, and longitude are required.' })
    }
    if (!allowedSeverity.has(severity)) return response.status(400).json({ error: 'Invalid severity.' })
    const location = `SRID=4326;POINT(${Number(longitude)} ${Number(latitude)})`
    const { data, error } = await supabaseAdmin.from('reports').insert({
      user_id: request.user.id, category_id, title: String(title).slice(0, 200), description,
      zone_id: zone_id || null, severity, location,
    }).select().single()
    if (error) throw error
    response.status(201).json({ report: data })
  } catch (error) { next(error) }
})

router.post('/:reportId/verify', requireAdmin, async (request, response, next) => {
  try {
    const { data: report, error: readError } = await supabaseAdmin
      .from('reports')
      .select('id, title, description, severity, created_at, category:report_categories(name), report_media(id, media_type, storage_path)')
      .eq('id', request.params.reportId)
      .single()
    if (readError || !report) return response.status(404).json({ error: 'Report not found.' })

    const result = await verifyReportWithGroq(report)
    const { data: verification, error: verificationError } = await supabaseAdmin.from('report_verifications').insert({
      report_id: report.id,
      model_name: config.groqReportVerificationModel,
      status: result.status,
      confidence: result.confidence,
      reason: result.reason,
      image_analysis: result.image_analysis,
      text_analysis: result.text_analysis,
    }).select().single()
    if (verificationError) throw verificationError
    const { error: updateError } = await supabaseAdmin.from('reports').update({ status: result.status }).eq('id', report.id)
    if (updateError) throw updateError
    response.json({ verification, report_status: result.status, advisory: 'AI verification is a triage aid and requires human oversight.' })
  } catch (error) { next(error) }
})

export default router
