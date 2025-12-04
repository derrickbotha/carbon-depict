/**
 * Performance Monitoring Middleware
 * Phase 2 Week 5 Day 3-4: Monitoring Infrastructure
 *
 * Tracks API performance metrics and slow queries
 */

const logger = require('../utils/logger')

// Performance thresholds (milliseconds)
const THRESHOLDS = {
  slow: parseInt(process.env.SLOW_REQUEST_THRESHOLD, 10) || 1000,
  verySlow: parseInt(process.env.VERY_SLOW_REQUEST_THRESHOLD, 10) || 3000,
  critical: parseInt(process.env.CRITICAL_REQUEST_THRESHOLD, 10) || 5000
}

// Store metrics in memory (for /api/metrics endpoint)
const metrics = {
  requests: {
    total: 0,
    success: 0,
    clientError: 0,
    serverError: 0
  },
  responseTimes: [],
  slowRequests: [],
  endpoints: {} // Track per-endpoint metrics
}

/**
 * Performance monitoring middleware
 */
function performanceMonitoring(req, res, next) {
  const startTime = Date.now()
  const startUsage = process.cpuUsage()

  // Capture original end method
  const originalEnd = res.end

  res.end = function (chunk, encoding) {
    // Restore original end
    res.end = originalEnd

    // Calculate metrics
    const responseTime = Date.now() - startTime
    const cpuUsage = process.cpuUsage(startUsage)
    const cpuTime = (cpuUsage.user + cpuUsage.system) / 1000 // Convert to ms

    // Update metrics
    updateMetrics(req, res, responseTime, cpuTime)

    // Log slow requests
    if (responseTime > THRESHOLDS.slow) {
      logSlowRequest(req, res, responseTime, cpuTime)
    }

    // Call original end
    return originalEnd.call(this, chunk, encoding)
  }

  next()
}

/**
 * Update performance metrics
 */
function updateMetrics(req, res, responseTime, cpuTime) {
  // Total requests
  metrics.requests.total++

  // Success/error counts
  if (res.statusCode >= 200 && res.statusCode < 300) {
    metrics.requests.success++
  } else if (res.statusCode >= 400 && res.statusCode < 500) {
    metrics.requests.clientError++
  } else if (res.statusCode >= 500) {
    metrics.requests.serverError++
  }

  // Response times (keep last 1000)
  metrics.responseTimes.push(responseTime)
  if (metrics.responseTimes.length > 1000) {
    metrics.responseTimes.shift()
  }

  // Per-endpoint metrics
  const endpoint = `${req.method} ${req.route?.path || req.path}`
  if (!metrics.endpoints[endpoint]) {
    metrics.endpoints[endpoint] = {
      count: 0,
      totalTime: 0,
      avgTime: 0,
      minTime: Infinity,
      maxTime: 0,
      errors: 0
    }
  }

  const endpointMetrics = metrics.endpoints[endpoint]
  endpointMetrics.count++
  endpointMetrics.totalTime += responseTime
  endpointMetrics.avgTime = endpointMetrics.totalTime / endpointMetrics.count
  endpointMetrics.minTime = Math.min(endpointMetrics.minTime, responseTime)
  endpointMetrics.maxTime = Math.max(endpointMetrics.maxTime, responseTime)

  if (res.statusCode >= 400) {
    endpointMetrics.errors++
  }

  // Track slow requests (keep last 100)
  if (responseTime > THRESHOLDS.slow) {
    metrics.slowRequests.push({
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime,
      cpuTime,
      userId: req.user?.id,
      correlationId: req.correlationId
    })

    if (metrics.slowRequests.length > 100) {
      metrics.slowRequests.shift()
    }
  }
}

/**
 * Log slow request
 */
function logSlowRequest(req, res, responseTime, cpuTime) {
  const severity = responseTime > THRESHOLDS.critical ? 'error' :
                   responseTime > THRESHOLDS.verySlow ? 'warn' : 'info'

  const message = `Slow request detected (${responseTime}ms)`

  const meta = {
    method: req.method,
    path: req.path,
    query: req.query,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    cpuTime: `${cpuTime}ms`,
    userId: req.user?.id,
    companyId: req.user?.company,
    correlationId: req.correlationId,
    userAgent: req.get('user-agent')
  }

  logger[severity](message, meta)
}

/**
 * Get current metrics
 */
function getMetrics() {
  // Calculate statistics
  const responseTimes = metrics.responseTimes
  const sortedTimes = [...responseTimes].sort((a, b) => a - b)

  const stats = {
    count: responseTimes.length,
    avg: responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0,
    min: responseTimes.length > 0 ? Math.min(...responseTimes) : 0,
    max: responseTimes.length > 0 ? Math.max(...responseTimes) : 0,
    p50: sortedTimes[Math.floor(sortedTimes.length * 0.5)] || 0,
    p95: sortedTimes[Math.floor(sortedTimes.length * 0.95)] || 0,
    p99: sortedTimes[Math.floor(sortedTimes.length * 0.99)] || 0
  }

  // Top 10 slowest endpoints
  const topSlowEndpoints = Object.entries(metrics.endpoints)
    .map(([endpoint, data]) => ({
      endpoint,
      avgTime: Math.round(data.avgTime),
      count: data.count,
      errors: data.errors,
      errorRate: data.count > 0 ? ((data.errors / data.count) * 100).toFixed(2) + '%' : '0%'
    }))
    .sort((a, b) => b.avgTime - a.avgTime)
    .slice(0, 10)

  return {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    requests: metrics.requests,
    responseTimes: stats,
    slowRequests: {
      count: metrics.slowRequests.length,
      recent: metrics.slowRequests.slice(-10)
    },
    topSlowEndpoints
  }
}

/**
 * Reset metrics (for testing or periodic reset)
 */
function resetMetrics() {
  metrics.requests = {
    total: 0,
    success: 0,
    clientError: 0,
    serverError: 0
  }
  metrics.responseTimes = []
  metrics.slowRequests = []
  metrics.endpoints = {}

  logger.info('Performance metrics reset')
}

module.exports = {
  performanceMonitoring,
  getMetrics,
  resetMetrics,
  THRESHOLDS
}
