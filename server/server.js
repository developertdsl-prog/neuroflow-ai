const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const logger = require('./utils/logger');
const authApiKey = require('./middleware/authApiKey');
const rateLimiter = require('./middleware/rateLimiter');
const tokenTracker = require('./middleware/tokenTracker');
const errorHandler = require('./middleware/errorHandler');

// Route Handlers
const agentRoutes = require('./routes/agentRoutes');
const workflowRoutes = require('./routes/workflowRoutes');
const memoryRoutes = require('./routes/memoryRoutes');
const guardrailRoutes = require('./routes/guardrailRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Utility Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } }));
}

// Global Custom Middlewares
app.use(tokenTracker);
app.use(rateLimiter);

// System Health Endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'NeuroFlow-AI', timestamp: new Date().toISOString() });
});

app.get('/api/v1/ping', (req, res) => {
  res.json({
    status: 'OPTIMAL',
    platform: 'NeuroFlow-AI Autonomous Agent Orchestrator',
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// Protected REST Routes
app.use('/api/v1/agents', authApiKey, agentRoutes);
app.use('/api/v1/workflows', authApiKey, workflowRoutes);
app.use('/api/v1/memory', authApiKey, memoryRoutes);
app.use('/api/v1/guardrails', authApiKey, guardrailRoutes);
app.use('/api/v1/analytics', authApiKey, analyticsRoutes);

// Error Handling
app.use(errorHandler);

let server;
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    server = app.listen(PORT, () => {
      logger.info(`NeuroFlow-AI Engine active on port ${PORT} [Env: ${process.env.NODE_ENV || 'development'}]`);
    });
  });
}

// Graceful Shutdown
const shutdown = () => {
  logger.info('Initiating graceful shutdown of NeuroFlow-AI...');
  if (server) {
    server.close(() => {
      logger.info('NeuroFlow-AI server stopped safely.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = app;
