const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files and ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/wishlist', require('./routes/wishlist'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Your Queen API is running' });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.path
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;

// Start server with retry logic for EADDRINUSE (port in use)
const MAX_PORT_ATTEMPTS = 5;

function startServer(port, attempt = 0) {
  const server = app.listen(port, () => {
    console.log(`✓ Server running on port ${port}`);
    console.log(`✓ API Health Check: http://localhost:${port}/api/health`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠ Port ${port} in use.`);
      if (attempt < MAX_PORT_ATTEMPTS) {
        const nextPort = port + 1;
        console.log(`↻ Attempting to listen on port ${nextPort} (attempt ${attempt + 1}/${MAX_PORT_ATTEMPTS})`);
        setTimeout(() => startServer(nextPort, attempt + 1), 500);
      } else {
        console.error(`✗ Failed to bind server after ${MAX_PORT_ATTEMPTS} attempts. Exiting.`);
        process.exit(1);
      }
    } else {
      console.error('✗ Server error:', err);
      process.exit(1);
    }
  });
}

// Global error handlers to avoid unhandled crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('✗ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('✗ Uncaught Exception thrown:', err);
  process.exit(1);
});

startServer(PORT);

