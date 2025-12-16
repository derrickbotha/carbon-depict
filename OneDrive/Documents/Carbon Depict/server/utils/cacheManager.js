/**
 * Cache Manager Utility
 * Phase 1 Week 2: Database Optimization & Caching
 *
 * Provides Redis-based caching for query results with automatic
 * fallback to in-memory caching when Redis is unavailable.
 */

const redis = require('../config/redis')

// In-memory cache fallback (when Redis is unavailable)
const memoryCache = new Map()
const MEMORY_CACHE_MAX_SIZE = 100
const MEMORY_CACHE_DEFAULT_TTL = 300 // 5 minutes in seconds

/**
 * Check if Redis is available and connected
 *
 * @returns {Boolean} True if Redis is connected
 */
function isRedisAvailable() {
  return redis && redis.isAvailable()
}

/**
 * Get cached data
 *
 * @param {String} key - Cache key
 * @returns {Promise<Object|null>} Cached data or null
 */
async function get(key) {
  try {
    if (isRedisAvailable()) {
      // Use Redis
      const redisClient = redis.getClient()
      const data = await redisClient.get(key)
      if (data) {
        return JSON.parse(data)
      }
      return null
    } else {
      // Fallback to memory cache
      const cached = memoryCache.get(key)
      if (cached && cached.expiry > Date.now()) {
        return cached.data
      } else if (cached) {
        // Expired, delete it
        memoryCache.delete(key)
      }
      return null
    }
  } catch (error) {
    console.error('Cache get error:', error.message)
    return null
  }
}

/**
 * Set cached data
 *
 * @param {String} key - Cache key
 * @param {Object} data - Data to cache
 * @param {Number} ttl - Time to live in seconds (default: 300)
 * @returns {Promise<Boolean>} True if successful
 */
async function set(key, data, ttl = 300) {
  try {
    if (isRedisAvailable()) {
      // Use Redis
      const redisClient = redis.getClient()
      await redisClient.setex(key, ttl, JSON.stringify(data))
      return true
    } else {
      // Fallback to memory cache
      // Enforce max size
      if (memoryCache.size >= MEMORY_CACHE_MAX_SIZE) {
        // Remove oldest entry
        const firstKey = memoryCache.keys().next().value
        memoryCache.delete(firstKey)
      }

      memoryCache.set(key, {
        data,
        expiry: Date.now() + (ttl * 1000)
      })
      return true
    }
  } catch (error) {
    console.error('Cache set error:', error.message)
    return false
  }
}

/**
 * Delete cached data
 *
 * @param {String} key - Cache key
 * @returns {Promise<Boolean>} True if successful
 */
async function del(key) {
  try {
    if (isRedisAvailable()) {
      const redisClient = redis.getClient()
      await redisClient.del(key)
    } else {
      memoryCache.delete(key)
    }
    return true
  } catch (error) {
    console.error('Cache delete error:', error.message)
    return false
  }
}

/**
 * Delete all cached data matching a pattern
 *
 * @param {String} pattern - Pattern to match (e.g., 'emissions:*')
 * @returns {Promise<Number>} Number of keys deleted
 */
async function delPattern(pattern) {
  try {
    if (isRedisAvailable()) {
      // Get all keys matching pattern
      const keys = await redis.keys(pattern)
      if (keys.length > 0) {
        await redis.del(...keys)
        return keys.length
      }
      return 0
    } else {
      // Memory cache pattern matching
      let count = 0
      const regex = new RegExp('^' + pattern.replace('*', '.*') + '$')

      for (const key of memoryCache.keys()) {
        if (regex.test(key)) {
          memoryCache.delete(key)
          count++
        }
      }
      return count
    }
  } catch (error) {
    console.error('Cache delete pattern error:', error.message)
    return 0
  }
}

/**
 * Clear all cached data
 *
 * @returns {Promise<Boolean>} True if successful
 */
async function clear() {
  try {
    if (isRedisAvailable()) {
      await redis.flushdb()
    } else {
      memoryCache.clear()
    }
    return true
  } catch (error) {
    console.error('Cache clear error:', error.message)
    return false
  }
}

/**
 * Get or set cached data (cache-aside pattern)
 *
 * @param {String} key - Cache key
 * @param {Function} fetchFn - Async function to fetch data if not cached
 * @param {Number} ttl - Time to live in seconds (default: 300)
 * @returns {Promise<Object>} Data (from cache or freshly fetched)
 */
async function getOrSet(key, fetchFn, ttl = 300) {
  try {
    // Try to get from cache
    const cached = await get(key)
    if (cached !== null) {
      return { data: cached, fromCache: true }
    }

    // Cache miss - fetch data
    const data = await fetchFn()

    // Store in cache (don't wait)
    set(key, data, ttl).catch(err => {
      console.error('Cache set error in getOrSet:', err.message)
    })

    return { data, fromCache: false }
  } catch (error) {
    console.error('Cache getOrSet error:', error.message)
    // On error, just fetch the data
    const data = await fetchFn()
    return { data, fromCache: false }
  }
}

/**
 * Middleware to cache API responses
 *
 * Usage:
 *   router.get('/api/data', cache('data', 300), (req, res) => { ... })
 *
 * @param {String} keyPrefix - Cache key prefix
 * @param {Number} ttl - Time to live in seconds
 * @returns {Function} Express middleware
 */
function middleware(keyPrefix, ttl = 300) {
  return async (req, res, next) => {
    // Generate cache key from request
    const cacheKey = `${keyPrefix}:${req.user?.company || 'public'}:${JSON.stringify(req.query)}`

    try {
      // Check cache
      const cached = await get(cacheKey)
      if (cached) {
        return res.json({
          ...cached,
          fromCache: true
        })
      }

      // Cache miss - continue to route handler
      // Override res.json to cache the response
      const originalJson = res.json.bind(res)
      res.json = function (data) {
        // Cache successful responses
        if (res.statusCode === 200) {
          set(cacheKey, data, ttl).catch(err => {
            console.error('Cache middleware set error:', err.message)
          })
        }
        return originalJson(data)
      }

      next()
    } catch (error) {
      console.error('Cache middleware error:', error.message)
      // On error, skip caching
      next()
    }
  }
}

/**
 * Invalidate cache for a specific resource
 *
 * @param {String} resource - Resource name (e.g., 'emissions', 'esg')
 * @param {String} companyId - Company ID (optional)
 * @returns {Promise<Number>} Number of keys deleted
 */
async function invalidate(resource, companyId = null) {
  const pattern = companyId
    ? `${resource}:${companyId}:*`
    : `${resource}:*`

  return await delPattern(pattern)
}

module.exports = {
  get,
  set,
  del,
  delPattern,
  clear,
  getOrSet,
  middleware,
  invalidate,
  isRedisAvailable
}
