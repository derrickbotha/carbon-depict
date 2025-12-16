/**
 * Rate Limiter Middleware - Phase 4 Week 22
 *
 * Implements rate limiting and throttling:
 * - Per-user limits
 * - Per-IP limits
 * - Route-specific limits
 * - Distributed rate limiting with Redis
 */
const rateLimit = require('express-rate-limit')
const RedisStore = require('rate-limit-redis')
const redis = require('../config/redis')
const logger = require('../utils/logger')

/**
 * Create rate limiter with options
 */
const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // limit each IP to 100 requests per windowMs
    message = 'Too many requests, please try again later.',
    standardHeaders = true,
    legacyHeaders = false,
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    keyGenerator = (req) => req.ip,
    ...rest
  } = options

  const limiterOptions = {
    windowMs,
    max,
    message: { error: message },
    standardHeaders,
    legacyHeaders,
    skipSuccessfulRequests,
    skipFailedRequests,
    keyGenerator,
    handler: (req, res) => {
      logger.warn('Rate limit exceeded:', {
        ip: req.ip,
        path: req.path,
        user: req.user?.id
      })

      res.status(429).json({
        success: false,
        error: message,
        retryAfter: Math.ceil(windowMs / 1000)
      })
    },
    ...rest
  }

  // Use Redis store if available
  if (redis.isAvailable()) {
    limiterOptions.store = new RedisStore({
      client: redis.getClient(),
      prefix: 'rl:'
    })
  }

  return rateLimit(limiterOptions)
}

/**
 * Strict rate limiter (for auth endpoints)
 */
const strictLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: 'Too many attempts, please try again after 15 minutes.'
})

/**
 * Standard API rate limiter
 */
const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many API requests, please try again later.'
})

/**
 * File upload rate limiter
 */
const uploadLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: 'Too many uploads, please try again later.'
})

/**
 * Per-user rate limiter
 */
const userLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: 'Too many requests from your account, please slow down.'
})

/**
 * Slow down middleware (gradually increase response time)
 */
const slowDown = require('express-slow-down')

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: 500,
  maxDelayMs: 20000
})

module.exports = {
  createRateLimiter,
  strictLimiter,
  apiLimiter,
  uploadLimiter,
  userLimiter,
  speedLimiter
}
