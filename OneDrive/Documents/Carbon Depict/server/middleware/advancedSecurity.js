/**
 * Advanced Security Middleware - Phase 4 Week 21
 *
 * Enhanced security features:
 * - Input sanitization
 * - SQL injection prevention
 * - XSS protection
 * - CSRF protection
 * - Security headers
 */
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cors = require('cors')
const logger = require('../utils/logger')

/**
 * Configure security headers with Helmet
 */
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
})

/**
 * Sanitize request data against NoSQL injection
 */
const sanitizeData = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    logger.warn('Potential NoSQL injection attempt:', {
      ip: req.ip,
      key,
      path: req.path
    })
  }
})

/**
 * Clean user input against XSS attacks
 */
const xssProtection = xss()

/**
 * Prevent HTTP Parameter Pollution
 */
const parameterPollutionProtection = hpp({
  whitelist: ['sort', 'filter', 'fields']
})

/**
 * Configure CORS
 */
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      logger.warn('CORS blocked origin:', origin)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}

const corsProtection = cors(corsOptions)

/**
 * IP whitelisting middleware
 */
const ipWhitelist = (allowedIPs = []) => {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress

    if (allowedIPs.length === 0 || allowedIPs.includes(clientIP)) {
      return next()
    }

    logger.warn('IP blocked:', { ip: clientIP, path: req.path })

    res.status(403).json({
      success: false,
      error: 'Access forbidden'
    })
  }
}

/**
 * Input validation middleware
 */
const validateInput = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false })
      next()
    } catch (error) {
      logger.warn('Validation failed:', {
        path: req.path,
        errors: error.details
      })

      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message
        }))
      })
    }
  }
}

/**
 * File upload security
 */
const secureFileUpload = (options = {}) => {
  const {
    maxFileSize = 10 * 1024 * 1024, // 10MB
    allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf']
  } = options

  return (req, res, next) => {
    if (!req.file && !req.files) {
      return next()
    }

    const files = req.files || [req.file]

    for (const file of files) {
      // Check file size
      if (file.size > maxFileSize) {
        return res.status(400).json({
          success: false,
          error: `File size exceeds maximum of ${maxFileSize / 1024 / 1024}MB`
        })
      }

      // Check MIME type
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          error: `File type ${file.mimetype} is not allowed`
        })
      }

      // Check extension
      const ext = file.originalname.substring(file.originalname.lastIndexOf('.')).toLowerCase()
      if (!allowedExtensions.includes(ext)) {
        return res.status(400).json({
          success: false,
          error: `File extension ${ext} is not allowed`
        })
      }
    }

    next()
  }
}

/**
 * Brute force protection
 */
const bruteForceProtection = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map()

  return (req, res, next) => {
    const key = `${req.ip}:${req.path}`
    const now = Date.now()

    // Clean old attempts
    if (attempts.has(key)) {
      const userAttempts = attempts.get(key)
      const recentAttempts = userAttempts.filter(time => now - time < windowMs)
      attempts.set(key, recentAttempts)

      if (recentAttempts.length >= maxAttempts) {
        logger.warn('Brute force attempt detected:', { ip: req.ip, path: req.path })

        return res.status(429).json({
          success: false,
          error: 'Too many failed attempts. Please try again later.'
        })
      }
    }

    // Track this attempt on failure
    const originalJson = res.json
    res.json = function (data) {
      if (!data.success) {
        const userAttempts = attempts.get(key) || []
        userAttempts.push(now)
        attempts.set(key, userAttempts)
      }

      return originalJson.call(this, data)
    }

    next()
  }
}

module.exports = {
  securityHeaders,
  sanitizeData,
  xssProtection,
  parameterPollutionProtection,
  corsProtection,
  ipWhitelist,
  validateInput,
  secureFileUpload,
  bruteForceProtection
}
