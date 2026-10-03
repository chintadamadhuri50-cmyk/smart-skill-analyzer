import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 90000,
});

// ── Analysis (existing backend) ─────────────────────────────────────────────
export const analyzeSkills    = (data) => api.post('/analyze', data).then(r => r.data);
export const getAnalyses      = ()     => api.get('/analysis').then(r => r.data.data);
export const getAnalysis      = (id)   => api.get(`/analysis/${id}`).then(r => r.data.data);
export const deleteAnalysis   = (id)   => api.delete(`/analysis/${id}`).then(r => r.data);

// ── Resume upload (stub — wire to backend when ready) ──────────────────────
export const uploadResume = (file) => {
  const fd = new FormData();
  fd.append('resume', file);
  return api.post('/resume/analyze', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data);
};

// ── Chat (stub — wire to backend AI route when ready) ──────────────────────
export const sendChatMessage = (message, context) =>
  api.post('/chat', { message, context }).then(r => r.data);

// ── Error helper ────────────────────────────────────────────────────────────
export const errMsg = (e) =>
  e?.response?.data?.message || 'Cannot reach the server. Check that the backend is running.';
