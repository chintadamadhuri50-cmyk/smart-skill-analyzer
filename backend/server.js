require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status:  'ok',
    service: 'SkillSnap AI API',
    version: '2.0.0',
    db:      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    time:    new Date().toISOString(),
  });
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api', require('./routes/analysisRoutes'));   // POST /api/analyze, GET/DELETE /api/analysis
app.use('/api', require('./routes/dataRoutes'));        // GET  /api/questions, /api/careers, /api/skills

// ── 404 catch-all ─────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ success: false, message: 'Something went wrong. Please try again.' });
});

// ── Database + Start ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
const URI  = process.env.MONGO_URI;

if (!URI) {
  console.error('❌  MONGO_URI is not set in .env — please add it and restart.');
  process.exit(1);
}

mongoose.connect(URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log('');
      console.log('  ╔══════════════════════════════════════╗');
      console.log('  ║       SkillSnap AI — Backend         ║');
      console.log('  ╠══════════════════════════════════════╣');
      console.log(`  ║  API    →  http://localhost:${PORT}     ║`);
      console.log(`  ║  Health →  http://localhost:${PORT}/api/health ║`);
      console.log('  ║  DB     →  MongoDB Atlas ✓            ║');
      console.log('  ╚══════════════════════════════════════╝');
      console.log('');
    });
  })
  .catch(e => {
    console.error('❌  MongoDB connection failed:', e.message);
    process.exit(1);
  });
