const express = require('express')
const http = require('http')
const cors = require('cors')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')
const session = require('express-session')
require('dotenv').config()

const { connectDatabases, disconnectDatabases, mongoose } = require('./config/database')
const { initializeWebSocket } = require('./services/websocketService')
const { initializeQueues } = require('./services/queueService')
const { startEmailWorker } = require('./workers/emailWorker')
const errorHandler = require('./middleware/errorHandler')
const { requestLogger, errorLogger } = require('./middleware/requestLogger')
const { performanceMonitoring } = require('./middleware/monitoring')
const { setupSwagger } = require('./config/swagger')
const logger = require('./utils/logger')

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 5500

// Middleware
// Set security headers
app.use(helmet())

// Prevent NoSQL injection
app.use(mongoSanitize())

// Prevent XSS attacks
app.use(xss())

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json({ limit: '10kb' })) // Body limit is 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())
// Ensure session secret is set in production
const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret && process.env.NODE_ENV === 'production') {
  throw new Error('SESSION_SECRET must be set in production environment')
}

app.use(session({
  secret: sessionSecret || 'dev-only-secret-do-not-use-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))

// Rate limiting - Enabled with environment-based configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.',
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    })
  }
})

// Apply to all API routes
app.use('/api/', limiter)

// HTTP request logging (after security middleware, before routes)
app.use(requestLogger)

// Performance monitoring (tracks response times and metrics)
app.use(performanceMonitoring)

// API Documentation (Swagger/OpenAPI) - Setup before routes
setupSwagger(app)

// Stricter rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 attempts per 15 minutes
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts, please try again later.',
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many authentication attempts',
      message: 'Too many authentication attempts from this IP, please try again later.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    })
  }
})

// Monitoring routes (health checks, metrics, version)
app.use('/api/monitoring', require('./routes/monitoring'))

// Backward compatibility - simple health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CarbonDepict API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Emission factors routes
app.use('/api/factors', require('./routes/factors'))

// Calculation routes
app.use('/api/calculate', require('./routes/calculate'))

// Emissions data routes
app.use('/api/emissions', require('./routes/emissions'))

// Auth routes (with stricter rate limiting)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)
app.use('/api/auth', require('./routes/auth'))

// User routes
app.use('/api/users', require('./routes/users'))

// Report routes
app.use('/api/reports', require('./routes/reports'))

// AI inference routes
app.use('/api/ai', require('./routes/ai'))

// ESG routes
app.use('/api/esg/metrics', require('./routes/esg-metrics'))
app.use('/api/esg/reports', require('./routes/esg-reports'))
app.use('/api/esg/framework-data', require('./routes/esg-framework-data'))

// Compliance routes
app.use('/api/compliance', require('./routes/compliance'))

// Admin routes
app.use('/api/admin', require('./routes/admin'))

// Error logging middleware (before error handler)
app.use(errorLogger)

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found', status: 404 } })
})

// Initialize databases and start server
const startServer = async () => {
  try {
    logger.info('Starting Carbon Depict server...')

    // Connect to databases
    logger.info('Connecting to databases...')
    await connectDatabases()
    logger.info('Databases connected')

    // Initialize WebSocket server
    logger.info('Initializing WebSocket server...')
    initializeWebSocket(server)
    logger.info('WebSocket server initialized')

    // Initialize job queues
    logger.info('Initializing job queues...')
    initializeQueues()
    logger.info('Job queues initialized')

    // Start background workers
    logger.info('Starting background workers...')
    startEmailWorker()
    logger.info('Email worker started')

    // Start HTTP server
    server.listen(PORT, () => {
      logger.info('Carbon Depict API Server started', {
        port: PORT,
        healthEndpoint: `http://localhost:${PORT}/api/health`,
        websocket: `ws://localhost:${PORT}`,
        smtp: process.env.SMTP_HOST || 'Not configured',
        mongodb: process.env.MONGODB_URI || 'localhost',
        redis: `${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
        environment: process.env.NODE_ENV || 'development',
        pid: process.pid
      })
    })
  } catch (error) {
    logger.error('Failed to start server', {
      error: error.message,
      stack: error.stack
    })
    process.exit(1)
  }
}

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received, starting graceful shutdown...`, { signal })

  try {
    // Close HTTP server
    server.close(() => {
      logger.info('HTTP server closed')
    })

    // Close WebSocket connections
    const { getIO } = require('./services/websocketService')
    const io = getIO()
    io.close(() => {
      logger.info('WebSocket server closed')
    })

    // Close job queues
    const { closeQueues } = require('./services/queueService')
    await closeQueues()
    logger.info('Job queues closed')

    // Close database connections
    await disconnectDatabases()
    logger.info('Database connections closed')

    logger.info('Graceful shutdown complete')
    process.exit(0)
  } catch (error) {
    logger.error('Error during shutdown', {
      error: error.message,
      stack: error.stack
    })
    process.exit(1)
  }
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

startServer()

module.exports = app
