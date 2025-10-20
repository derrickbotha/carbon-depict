const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const { connectDatabases } = require('./config/database')

const app = express()
const PORT = process.env.PORT || 5500

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use('/api/', limiter)

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
      postgres: 'unknown',
      mongodb: 'unknown',
      redis: 'unknown'
    }
  }

  try {
    // Check PostgreSQL connection
    const { sequelize } = require('./config/database')
    if (sequelize) {
      await sequelize.authenticate()
      health.databases.postgres = 'connected'
    }
  } catch (error) {
    health.databases.postgres = 'disconnected'
    health.status = 'degraded'
  }

  try {
    // Check MongoDB connection
    const mongoose = require('mongoose')
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500,
    },
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found', status: 404 } })
})

// Initialize databases and start server
const startServer = async () => {
  try {
    // Connect to databases
    await connectDatabases()

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 CarbonDepict API server running on port ${PORT}`)
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
      console.log(`🌍 Frontend proxy: http://localhost:3500`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error.message)
    process.exit(1)
  }
}

startServer()

module.exports = app
