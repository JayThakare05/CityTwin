import api from './api'

// Models remain in the FastAPI AI service; the browser only submits simulation inputs.
export const cityService = {
  overview: () => api.get('/city/overview'),
  layers: () => api.get('/city/layers'),
  alerts: () => api.get('/alerts'),
  reports: (status = 'verified') => api.get('/citizen-reports', { params: { status } }),
  resources: () => api.get('/emergency/resources'),
  runSimulation: (payload) => api.post('/simulations/run', payload),
  login: (email, password) => api.post('/auth/login', { email, password }),
  submitReport: (payload) => api.post('/reports', payload),
  verifyReport: (reportId) => api.post(`/reports/${reportId}/verify`),
}
