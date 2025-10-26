const express = require('express')
const http = require('http')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const securityHeaders = require('./middleware/security')
const { createProxyMiddleware } = require('http-proxy-middleware')
require('dotenv').config()

const { connectDatabases, disconnectDatabases } = require('./config/database')
const { initializeWebSocket } = require('./services/websocketService')

const app = express()
const server = http.createServer(app)

// Get service name from command line or environment
const serviceName = process.argv.find(arg => arg.startsWith('--service='))?.split('=')[1] || process.env.SERVICE_NAME || 'gateway'
const PORT = process.env.PORT || (
  serviceName === 'emissions' ? 5501 :
  serviceName === 'esg' ? 5502 :
  5500
)

console.log(`🚀 Starting ${serviceName.toUpperCase()} service on port ${PORT}`)

// Security middleware
app.use(securityHeaders)
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 10000,
  message: 'Too many requests',
  skip: (req) => req.path === '/api/health' || req.path.startsWith('/api/auth/')
})

app.use('/api/', limiter)

// Health check (all services)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: serviceName,
    port: PORT,
    timestamp: new Date().toISOString()
  })
})

// API Gateway routing logic
if (serviceName === 'gateway') {
  console.log('🌐 Configured as API Gateway')
  
  // Proxy emissions requests to emissions service
  app.use('/api/emissions', createProxyMiddleware({
    target: process.env.EMISSIONS_SERVICE_URL || 'http://localhost:5501',
    changeOrigin: true,
    pathRewrite: { '^/api': '/api' },
    onError: (err, req, res) => {
      console.error('Emissions service error:', err.message)
      res.status(503).json({ error: 'Emissions service unavailable' })
    }
  }))

  // Proxy ESG requests to ESG service
  app.use('/api/esg', createProxyMiddleware({
    target: process.env.ESG_SERVICE_URL || 'http://localhost:5502',
    changeOrigin: true,
    pathRewrite: { '^/api': '/api' },
    onError: (err, req, res) => {
      console.error('ESG service error:', err.message)
      res.status(503).json({ error: 'ESG service unavailable' })
    }
  }))

  app.use('/api/compliance', createProxyMiddleware({
    target: process.env.ESG_SERVICE_URL || 'http://localhost:5502',
    changeOrigin: true,
    pathRewrite: { '^/api': '/api' }
  }))

  // Handle auth locally in gateway
  app.use('/api/auth', require('./routes/auth'))
  app.use('/api/users', require('./routes/users'))
  
  console.log('✅ API Gateway routes configured')
}

// Emissions Service routes
if (serviceName === 'emissions' || serviceName === 'gateway') {
  if (serviceName === 'emissions') {
    console.log('📊 Configured as Emissions Service')
    app.use('/api/emissions', require('./routes/emissions'))
    app.use('/api/calculate', require('./routes/calculate'))
    app.use('/api/factors', require('./routes/factors'))
    console.log('✅ Emissions service routes configured')
  }
}

// ESG Service routes
if (serviceName === 'esg' || serviceName === 'gateway') {
  if (serviceName === 'esg') {
    console.log('📈 Configured as ESG Service')
    app.use('/api/esg/metrics', require('./routes/esg-metrics'))
    app.use('/api/compliance', require('./routes/compliance'))
    app.use('/api/frameworks', require('./routes/frameworks'))
    console.log('✅ ESG service routes configured')
  }
}

// Common routes (available in all services)
app.use('/api/analytics', require('./routes/analytics'))
app.use('/api/system', require('./routes/system'))

// Error handling
const { globalErrorHandler } = require('./utils/errorHandler')
app.use(globalErrorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found', status: 404 } })
})

// Initialize and start server
const startServer = async () => {
  try {
    console.log(`🔄 Starting ${serviceName.toUpperCase()} service...`)

    // Connect to databases
    await connectDatabases()
    console.log('✅ Databases connected')

    // Initialize WebSocket (if not in gateway mode)
    if (serviceName !== 'gateway') {
      initializeWebSocket(server)
      console.log('✅ WebSocket server initialized')
    }

    // Start HTTP server
    server.listen(PORT, () => {
      console.log('\n🚀 ========================================')
      console.log(`   Carbon Depict ${serviceName.toUpperCase()} Service`)
      console.log('   ========================================')
      console.log(`   🌐 Server:     http://localhost:${PORT}`)
      console.log(`   📊 Health:     http://localhost:${PORT}/api/health`)
      console.log(`   🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`   🔧 Service:     ${serviceName}`)
      console.log('   ========================================\n')
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error.message)
    process.exit(1)
  }
}

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n🛑 ${signal} received, shutting down ${serviceName} service...`)
  
  try {
    server.close(() => console.log('✅ HTTP server closed'))
    
    if (serviceName !== 'gateway') {
      const { getIO } = require('./services/websocketService')
      const io = getIO()
      io.close(() => console.log('✅ WebSocket server closed'))
    }

    await disconnectDatabases()
    console.log('✅ Database connections closed')
    console.log('👋 Graceful shutdown complete')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during shutdown:', error)
    process.exit(1)
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))

startServer()

module.exports = app

