import { config } from '../config.js'

const outcomes = new Set(['verified', 'needs_review', 'rejected', 'duplicate'])

function parseJsonObject(content) {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const raw = fenced ? fenced[1] : content
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start < 0 || end < start) throw new Error('Groq did not return a JSON object.')
  return JSON.parse(raw.slice(start, end + 1))
}

export async function verifyReportWithGroq(report) {
  if (!config.groqApiKey) throw new Error('GROQ_API_KEY is not configured.')

  // GPT-OSS 120B is text-only on Groq. Media presence is context, never represented as visual analysis.
  const reportContext = {
    category: report.category?.name || 'Unknown',
    title: report.title,
    description: report.description || '',
    severity: report.severity,
    submitted_at: report.created_at,
    attached_media_count: report.report_media?.length || 0,
  }
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.groqApiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: config.groqReportVerificationModel,
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are a cautious civic-report triage assistant. This is a filtering aid, not a source of truth. Assess only the provided report. Do not invent visual facts. Return JSON with status (verified, needs_review, rejected, or duplicate), confidence (0-100), reason (short string), text_analysis (object), and image_analysis (object). Use needs_review whenever evidence is incomplete or uncertain. For image_analysis, state that no visual inspection was performed when only media metadata is provided.',
        },
        { role: 'user', content: `Assess this citizen report:\n${JSON.stringify(reportContext)}` },
      ],
    }),
  })
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Groq verification failed (${response.status}): ${detail.slice(0, 500)}`)
  }
  const payload = await response.json()
  const result = parseJsonObject(payload.choices?.[0]?.message?.content || '')
  if (!outcomes.has(result.status)) result.status = 'needs_review'
  result.confidence = Math.max(0, Math.min(100, Number(result.confidence) || 0))
  result.reason = String(result.reason || 'No reason was returned by the verification model.').slice(0, 2000)
  result.text_analysis = result.text_analysis && typeof result.text_analysis === 'object' ? result.text_analysis : {}
  result.image_analysis = result.image_analysis && typeof result.image_analysis === 'object'
    ? result.image_analysis
    : { inspected: false, note: 'No image bytes were sent to the text-only verification model.' }
  return result
}
