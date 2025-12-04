/**
 * Alert Configuration
 * Phase 2 Week 5 Day 5: Alerting Rules
 *
 * Define alert thresholds and notification rules
 */

const logger = require('../utils/logger')
const { captureMessage } = require('./errorTracking')

// Alert thresholds
const THRESHOLDS = {
  errorRate: {
    warning: 0.05, // 5% error rate
    critical: 0.10  // 10% error rate
  },
  responseTime: {
    warning: 2000,  // 2 seconds
    critical: 5000  // 5 seconds
  },
  memory: {
    warning: 0.80,  // 80% of heap
    critical: 0.90  // 90% of heap
  },
  cpu: {
    warning: 70,    // 70% CPU usage
    critical: 90    // 90% CPU usage
  }
}

// Alert cooldown (prevent alert spam)
const alertCooldowns = new Map()
const COOLDOWN_PERIOD = 5 * 60 * 1000 // 5 minutes

/**
 * Check if alert should be sent (respects cooldown)
 */
function shouldSendAlert(alertKey) {
  const lastSent = alertCooldowns.get(alertKey)
  const now = Date.now()

  if (!lastSent || (now - lastSent) > COOLDOWN_PERIOD) {
    alertCooldowns.set(alertKey, now)
    return true
  }

  return false
}

/**
 * Send alert
 */
function sendAlert(severity, title, message, context = {}) {
  const alertKey = `${severity}:${title}`

  if (!shouldSendAlert(alertKey)) {
    return // In cooldown period
  }

  // Log alert
  logger[severity === 'critical' ? 'error' : 'warn'](`ALERT: ${title}`, {
    severity,
    message,
    ...context
  })

  // Send to error tracking
  captureMessage(`ALERT: ${title} - ${message}`, severity === 'critical' ? 'error' : 'warning', context)

  // Here you can add integrations with:
  // - PagerDuty
  // - OpsGenie
  // - Slack
  // - Email
  // - SMS
}

/**
 * Check error rate and alert if needed
 */
function checkErrorRate(metrics) {
  if (!metrics.requests.total) return

  const errorRate = (metrics.requests.serverError / metrics.requests.total)

  if (errorRate >= THRESHOLDS.errorRate.critical) {
    sendAlert('critical', 'High Error Rate', `Error rate is ${(errorRate * 100).toFixed(2)}%`, {
      errorRate,
      totalRequests: metrics.requests.total,
      errors: metrics.requests.serverError
    })
  } else if (errorRate >= THRESHOLDS.errorRate.warning) {
    sendAlert('warning', 'Elevated Error Rate', `Error rate is ${(errorRate * 100).toFixed(2)}%`, {
      errorRate,
      totalRequests: metrics.requests.total,
      errors: metrics.requests.serverError
    })
  }
}

/**
 * Check response times and alert if needed
 */
function checkResponseTimes(metrics) {
  const p95 = metrics.responseTimes.p95

  if (p95 >= THRESHOLDS.responseTime.critical) {
    sendAlert('critical', 'Slow Response Times', `P95 response time is ${p95}ms`, {
      p95,
      p99: metrics.responseTimes.p99,
      avg: metrics.responseTimes.avg
    })
  } else if (p95 >= THRESHOLDS.responseTime.warning) {
    sendAlert('warning', 'Elevated Response Times', `P95 response time is ${p95}ms`, {
      p95,
      p99: metrics.responseTimes.p99,
      avg: metrics.responseTimes.avg
    })
  }
}

/**
 * Check memory usage and alert if needed
 */
function checkMemoryUsage() {
  const usage = process.memoryUsage()
  const heapUsedPercent = usage.heapUsed / usage.heapTotal

  if (heapUsedPercent >= THRESHOLDS.memory.critical) {
    sendAlert('critical', 'Critical Memory Usage', `Heap usage is ${(heapUsedPercent * 100).toFixed(2)}%`, {
      heapUsed: `${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      rss: `${(usage.rss / 1024 / 1024).toFixed(2)} MB`
    })
  } else if (heapUsedPercent >= THRESHOLDS.memory.warning) {
    sendAlert('warning', 'High Memory Usage', `Heap usage is ${(heapUsedPercent * 100).toFixed(2)}%`, {
      heapUsed: `${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB`
    })
  }
}

/**
 * Periodic health check (call every minute)
 */
function performHealthChecks(metrics) {
  checkErrorRate(metrics)
  checkResponseTimes(metrics)
  checkMemoryUsage()
}

module.exports = {
  THRESHOLDS,
  sendAlert,
  checkErrorRate,
  checkResponseTimes,
  checkMemoryUsage,
  performHealthChecks
}
