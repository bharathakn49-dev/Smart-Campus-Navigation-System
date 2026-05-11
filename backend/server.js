/**
 * Express Server — Smart Campus Navigation System
 * 
 * Serves the REST API for graph algorithm computation.
 * Port: 5000
 */

const express = require('express');
const cors = require('cors');
const graphRoutes = require('./routes/graphRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/graph', graphRoutes);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Smart Campus Navigation API is running',
    timestamp: new Date().toISOString()
  });
});

// ─── Start Server ────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Smart Campus Navigation API`);
  console.log(`   Server running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Sample Graph: http://localhost:${PORT}/api/graph/sample\n`);
});
