const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const apiClient = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async register(name, email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return res.json();
  },

  async getMe(token) {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.json();
  },

  // Issues
  async getIssues(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/issues?${query}`);
    return res.json();
  },

  async createIssue(issueData) {
    const res = await fetch(`${API_BASE_URL}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...issueData })
    });
    return res.json();
  },

  async likeIssue(id) {
    const res = await fetch(`${API_BASE_URL}/issues/${id}/like`, {
      method: 'PATCH'
    });
    return res.json();
  },

  // Regions Digital Twins
  async getRegions() {
    const res = await fetch(`${API_BASE_URL}/regions`);
    return res.json();
  },

  // Emergency Services
  async getEmergencyServices(type, lat, lon) {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (lat && lon) {
      params.append('lat', lat);
      params.append('lon', lon);
    }
    const res = await fetch(`${API_BASE_URL}/emergency-services?${params.toString()}`);
    return res.json();
  },

  // Weather & Forecast
  async getWeather(lat, lon) {
    const query = (lat && lon) ? `?lat=${lat}&lon=${lon}` : '';
    const res = await fetch(`${API_BASE_URL}/weather${query}`);
    return res.json();
  }
};
