const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const winston = require('winston');

require('dotenv').config();

// Import route modules
const authRoutes = require('./src/routes/auth.routes');
const crmRoutes = require('./src/routes/crm.routes');
const inventoryRoutes = require('./src/routes/inventory.routes');
const supportRoutes = require('./src/routes/support.routes');

// Import middleware
const { authenticateToken } = require('./src/middleware/auth.middleware');
const { requestLogger } = require('./src/middleware/logging.middleware');

const app = express();
const PORT = 3000;

// Middleware setup
app.use(helmet());
app.use(express.json());
app.use(requestLogger);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Routes
app.use('/auth', authRoutes);
app.use('/api/crm', authenticateToken, crmRoutes);
app.use('/api/inventory', authenticateToken, inventoryRoutes);
app.use('/api/support', authenticateToken, supportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV !== 'production' ? err.stack : {}
  });
});

// Server startup
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;