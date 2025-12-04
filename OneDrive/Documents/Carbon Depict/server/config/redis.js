/**
 * Redis Configuration and Connection
 * Phase 1 Week 2: Caching Implementation
 *
 * Provides Redis client with graceful fallback when Redis is unavailable
 */

const Redis = require('ioredis')

// Check if Redis is enabled
const REDIS_ENABLED = process.env.REDIS_ENABLED !== 'false'

let redisClient = null

if (REDIS_ENABLED) {
  try {
    // Create Redis client
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    }

    // Use REDIS_URL if provided (takes precedence)
    if (process.env.REDIS_URL) {
      redisClient = new Redis(process.env.REDIS_URL, {
        retryStrategy: redisConfig.retryStrategy,
        maxRetriesPerRequest: redisConfig.maxRetriesPerRequest,
      })
    } else {
      redisClient = new Redis(redisConfig)
    }

    // Event handlers
    redisClient.on('connect', () => {
      console.log('📦 Redis connecting...')
    })

    redisClient.on('ready', () => {
      console.log('✅ Redis connected and ready')
    })

    redisClient.on('error', (err) => {
      if (err.code === 'ECONNREFUSED') {
        console.warn('⚠️  Redis connection refused - caching disabled, using in-memory fallback')
      } else {
        console.error('❌ Redis error:', err.message)
      }
    })

    redisClient.on('close', () => {
      console.warn('⚠️  Redis connection closed')
    })

    redisClient.on('reconnecting', () => {
      console.log('🔄 Redis reconnecting...')
    })

    // Attempt to connect
    redisClient.connect().catch((err) => {
      console.warn('⚠️  Redis connection failed:', err.message)
      console.warn('   Caching will use in-memory fallback')
    })

  } catch (error) {
    console.error('❌ Redis initialization error:', error.message)
    console.warn('   Caching will use in-memory fallback')
    redisClient = null
  }
} else {
  console.log('ℹ️  Redis disabled by configuration - using in-memory cache fallback')
}

/**
 * Get Redis client
 * @returns {Redis|null} Redis client or null if unavailable
 */
function getClient() {
  return redisClient
}

/**
 * Check if Redis is available
 * @returns {Boolean} True if Redis is connected
 */
function isAvailable() {
  return redisClient !== null && redisClient.status === 'ready'
}

/**
 * Gracefully close Redis connection
 */
async function disconnect() {
  if (redisClient) {
    try {
      await redisClient.quit()
      console.log('✅ Redis disconnected gracefully')
    } catch (error) {
      console.error('❌ Redis disconnect error:', error.message)
    }
  }
}

// Export Redis client (can be null if Redis is unavailable)
module.exports = redisClient

// Export helper functions
module.exports.getClient = getClient
module.exports.isAvailable = isAvailable
module.exports.disconnect = disconnect
