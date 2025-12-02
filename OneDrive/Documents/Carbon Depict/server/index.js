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
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))

// Rate limiting - TEMPORARILY DISABLED FOR DEVELOPMENT
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 1000 requests in dev, 100 in production
//   message: 'Too many requests from this IP, please try again later.',
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// })
// app.use('/api/', limiter)

// Health check routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CarbonDepict API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Detailed health check with database connections
app.get('/api/health/detailed', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    memory: {
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + ' MB'
    },
    databases: {
      mongodb: 'unknown',
      redis: 'unknown'
    }
  }

  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState === 1) {
      health.databases.mongodb = 'connected'
    } else {
      health.databases.mongodb = 'disconnected'
      health.status = 'degraded'
    }
  } catch (error) {
    health.databases.mongodb = 'disconnected'
    health.status = 'degraded'
  }

  try {
    // Check Redis connection (if configured)
    if (process.env.REDIS_HOST) {
      // Redis check would go here if redis client is set up
      health.databases.redis = 'not configured'
    } else {
      health.databases.redis = 'not configured'
    }
  } catch (error) {
    health.databases.redis = 'disconnected'
    health.status = 'degraded'
  }

  const statusCode = health.status === 'ok' ? 200 : 503
  res.status(statusCode).json(health)
})

// Emission factors routes
app.use('/api/factors', require('./routes/factors'))

// Calculation routes
app.use('/api/calculate', require('./routes/calculate'))

// Emissions data routes
app.use('/api/emissions', require('./routes/emissions'))

// Auth routes
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

// Error handling middleware
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found', status: 404 } })
})

// Initialize databases and start server
const startServer = async () => {
  try {
    console.log('🔄 Starting Carbon Depict server...')

    // Connect to databases
    console.log('📊 Connecting to databases...')
    await connectDatabases()
    console.log('✅ Databases connected')

    // Initialize WebSocket server
    console.log('🔌 Initializing WebSocket server...')
    initializeWebSocket(server)
    console.log('✅ WebSocket server initialized')

    // Initialize job queues
    console.log('⚙️  Initializing job queues...')
    initializeQueues()
    console.log('✅ Job queues initialized')

    // Start background workers
    console.log('👷 Starting background workers...')
    startEmailWorker()
    console.log('✅ Email worker started')

    // Start HTTP server
    server.listen(PORT, () => {
      console.log('\n🚀 ========================================')
      console.log(`   Carbon Depict API Server`)
      console.log('   ========================================')
      console.log(`   🌐 Server:     http://localhost:${PORT}`)
      console.log(`   📊 Health:     http://localhost:${PORT}/api/health`)
      console.log(`   🔌 WebSocket:  ws://localhost:${PORT}`)
      console.log(`   📧 Email:      ${process.env.SMTP_HOST || 'Not configured'}`)
      console.log(`   🍃 MongoDB:    ${process.env.MONGO_URI || 'localhost'}`)
      console.log(`   🔴 Redis:      ${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`)
      console.log(`   🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log('   ========================================\n')
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 ${signal} received, starting graceful shutdown...`)

  try {
    // Close HTTP server
    server.close(() => {
      console.log('✅ HTTP server closed')
    })

    // Close WebSocket connections
    const { getIO } = require('./services/websocketService')
    const io = getIO()
    io.close(() => {
      console.log('✅ WebSocket server closed')
    })

    // Close job queues
    const { closeQueues } = require('./services/queueService')
    await closeQueues()
    console.log('✅ Job queues closed')

    // Close database connections
    await disconnectDatabases()
    console.log('✅ Database connections closed')

    console.log('👋 Graceful shutdown complete')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during shutdown:', error)
    process.exit(1)
  }
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

startServer()

module.exports = app
