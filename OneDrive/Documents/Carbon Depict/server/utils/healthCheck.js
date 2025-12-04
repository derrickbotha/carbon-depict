/**
 * Health Check Utility
 * Phase 2 Week 5 Day 3-4: Monitoring Infrastructure
 *
 * Provides comprehensive health checks for all system components
 */

const mongoose = require('mongoose')
const redis = require('../config/redis')
const logger = require('./logger')

/**
 * Check MongoDB health
 */
async function checkMongoDB() {
  try {
    const state = mongoose.connection.readyState
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }

    const isHealthy = state === 1

    // Get additional stats if connected
    let stats = null
    if (isHealthy) {
      const db = mongoose.connection.db
      stats = await db.stats()
    }

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      state: states[state],
      responseTime: isHealthy ? await measureMongoDBResponseTime() : null,
      details: stats ? {
        collections: stats.collections,
        dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
        indexSize: `${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`,
        avgObjSize: `${(stats.avgObjSize / 1024).toFixed(2)} KB`
      } : null
    }
  } catch (error) {
    logger.error('MongoDB health check failed', { error: error.message })
    return {
      status: 'unhealthy',
      error: error.message
    }
  }
}

/**
 * Measure MongoDB response time
 */
async function measureMongoDBResponseTime() {
  try {
    const start = Date.now()
    await mongoose.connection.db.admin().ping()
    return Date.now() - start
  } catch (error) {
    return null
  }
}

/**
 * Check Redis health
 */
async function checkRedis() {
  try {
    if (!redis || redis.status !== 'ready') {
      return {
        status: 'degraded',
        message: 'Redis not available - using in-memory fallback'
      }
    }

    const start = Date.now()
    await redis.ping()
    const responseTime = Date.now() - start

    // Get Redis info
    const info = await redis.info('server')
    const memory = await redis.info('memory')

    return {
      status: 'healthy',
      responseTime,
      details: {
        version: info.match(/redis_version:(.+)/)?.[1]?.trim(),
        uptime: info.match(/uptime_in_seconds:(.+)/)?.[1]?.trim() + 's',
        usedMemory: memory.match(/used_memory_human:(.+)/)?.[1]?.trim()
      }
    }
  } catch (error) {
    logger.error('Redis health check failed', { error: error.message })
    return {
      status: 'degraded',
      error: error.message,
      message: 'Redis unavailable - using in-memory fallback'
    }
  }
}

/**
 * Check system resources
 */
function checkSystemResources() {
  const used = process.memoryUsage()
  const cpuUsage = process.cpuUsage()

  return {
    status: 'healthy',
    memory: {
      rss: `${(used.rss / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(used.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(used.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      external: `${(used.external / 1024 / 1024).toFixed(2)} MB`
    },
    cpu: {
      user: `${(cpuUsage.user / 1000).toFixed(2)} ms`,
      system: `${(cpuUsage.system / 1000).toFixed(2)} ms`
    },
    uptime: `${(process.uptime() / 60).toFixed(2)} minutes`,
    pid: process.pid,
    nodeVersion: process.version
  }
}

/**
 * Check disk space
 */
async function checkDiskSpace() {
  try {
    const { execSync } = require('child_process')

    // Get disk usage for logs directory
    const logsPath = require('path').join(__dirname, '../../logs')
    let diskUsage = null

    try {
      const df = execSync(`df -h ${logsPath}`).toString()
      const lines = df.split('\n')
      if (lines[1]) {
        const parts = lines[1].split(/\s+/)
        diskUsage = {
          filesystem: parts[0],
          size: parts[1],
          used: parts[2],
          available: parts[3],
          usePercent: parts[4],
          mountPoint: parts[5]
        }
      }
    } catch (error) {
      // Fallback - just note it's not available
      diskUsage = { error: 'Unable to check disk space' }
    }

    return {
      status: 'healthy',
      logsDirectory: logsPath,
      diskUsage
    }
  } catch (error) {
    return {
      status: 'unknown',
      error: error.message
    }
  }
}

/**
 * Comprehensive health check
 */
async function performHealthCheck() {
  const startTime = Date.now()

  const [mongodb, redisHealth, system, disk] = await Promise.all([
    checkMongoDB(),
    checkRedis(),
    Promise.resolve(checkSystemResources()),
    checkDiskSpace()
  ])

  // Determine overall status
  let overallStatus = 'healthy'
  if (mongodb.status === 'unhealthy') {
    overallStatus = 'unhealthy'
  } else if (redisHealth.status === 'degraded') {
    overallStatus = 'degraded'
  }

  const responseTime = Date.now() - startTime

  return {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    responseTime: `${responseTime}ms`,
    environment: process.env.NODE_ENV || 'development',
    version: require('../../package.json').version || '1.0.0',
    components: {
      mongodb,
      redis: redisHealth,
      system,
      disk
    }
  }
}

/**
 * Quick health check (for load balancers)
 */
async function quickHealthCheck() {
  const mongoState = mongoose.connection.readyState
  const isHealthy = mongoState === 1

  return {
    status: isHealthy ? 'ok' : 'error',
    timestamp: new Date().toISOString()
  }
}

module.exports = {
  performHealthCheck,
  quickHealthCheck,
  checkMongoDB,
  checkRedis,
  checkSystemResources,
  checkDiskSpace
}
