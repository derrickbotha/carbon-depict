/**
 * Error Tracking Configuration
 * Phase 2 Week 5 Day 5: Alerting & Error Tracking
 *
 * Integrates with Sentry or other error tracking services
 * Set SENTRY_DSN environment variable to enable
 */

const logger = require('../utils/logger')

let Sentry = null
let isEnabled = false

/**
 * Initialize error tracking
 */
function initializeErrorTracking() {
  const sentryDSN = process.env.SENTRY_DSN
  const environment = process.env.NODE_ENV || 'development'

  if (!sentryDSN) {
    logger.info('Error tracking disabled - SENTRY_DSN not configured')
    return
  }

  try {
    // Dynamic import to avoid dependency if not used
    Sentry = require('@sentry/node')
    const Tracing = require('@sentry/tracing')

    Sentry.init({
      dsn: sentryDSN,
      environment,
      release: process.env.npm_package_version || '1.0.0',

      // Performance monitoring
      tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),

      // Integrations
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Tracing.Integrations.Mongo(),
        new Tracing.Integrations.Express()
      ],

      // Filter sensitive data
      beforeSend(event, hint) {
        // Remove sensitive headers
        if (event.request?.headers) {
          delete event.request.headers.authorization
          delete event.request.headers.cookie
        }

        // Remove passwords from extra data
        if (event.extra) {
          const sanitized = JSON.stringify(event.extra)
            .replace(/"password":"[^"]*"/g, '"password":"[REDACTED]"')
            .replace(/"token":"[^"]*"/g, '"token":"[REDACTED]"')

          event.extra = JSON.parse(sanitized)
        }

        return event
      }
    })

    isEnabled = true
    logger.info('Error tracking initialized', { service: 'Sentry', environment })
  } catch (error) {
    logger.warn('Failed to initialize error tracking', {
      error: error.message,
      hint: 'Install @sentry/node if you want error tracking'
    })
  }
}

/**
 * Get Sentry request handler (for Express)
 */
function getRequestHandler() {
  if (isEnabled && Sentry) {
    return Sentry.Handlers.requestHandler()
  }
  return (req, res, next) => next()
}

/**
 * Get Sentry error handler (for Express)
 */
function getErrorHandler() {
  if (isEnabled && Sentry) {
    return Sentry.Handlers.errorHandler()
  }
  return (err, req, res, next) => next(err)
}

/**
 * Capture exception manually
 */
function captureException(error, context = {}) {
  if (isEnabled && Sentry) {
    Sentry.captureException(error, {
      extra: context
    })
  }

  // Always log to Winston as well
  logger.error('Exception captured', {
    error: error.message,
    stack: error.stack,
    ...context
  })
}

/**
 * Capture message manually
 */
function captureMessage(message, level = 'info', context = {}) {
  if (isEnabled && Sentry) {
    Sentry.captureMessage(message, {
      level,
      extra: context
    })
  }

  logger[level](message, context)
}

/**
 * Set user context
 */
function setUser(user) {
  if (isEnabled && Sentry) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username
    })
  }
}

/**
 * Clear user context
 */
function clearUser() {
  if (isEnabled && Sentry) {
    Sentry.setUser(null)
  }
}

/**
 * Add breadcrumb
 */
function addBreadcrumb(breadcrumb) {
  if (isEnabled && Sentry) {
    Sentry.addBreadcrumb(breadcrumb)
  }
}

module.exports = {
  initializeErrorTracking,
  getRequestHandler,
  getErrorHandler,
  captureException,
  captureMessage,
  setUser,
  clearUser,
  addBreadcrumb,
  isEnabled: () => isEnabled
}
