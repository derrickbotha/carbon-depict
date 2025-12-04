/**
 * Monitoring Routes
 * Phase 2 Week 5 Day 3-4: Monitoring Infrastructure
 *
 * Provides health check and metrics endpoints for monitoring systems
 */

const express = require('express')
const router = express.Router()
const { performHealthCheck, quickHealthCheck } = require('../utils/healthCheck')
const { getMetrics, resetMetrics } = require('../middleware/monitoring')
const { authenticate } = require('../middleware/auth')
const logger = require('../utils/logger')

/**
 * @swagger
 * /api/monitoring/health:
 *   get:
 *     summary: Comprehensive health check
 *     description: Returns detailed health status of all system components including MongoDB, Redis, system resources, and disk space
 *     tags: [Monitoring]
 *     responses:
 *       200:
 *         description: System is healthy or degraded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [healthy, degraded, unhealthy]
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 responseTime:
 *                   type: string
 *                   example: "45ms"
 *                 components:
 *                   type: object
 *                   properties:
 *                     mongodb:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           enum: [healthy, unhealthy]
 *                         responseTime:
 *                           type: string
 *                         details:
 *                           type: object
 *                     redis:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                           enum: [healthy, degraded, unavailable]
 *                         responseTime:
 *                           type: string
 *                     system:
 *                       type: object
 *                       properties:
 *                         memory:
 *                           type: object
 *                         cpu:
 *                           type: object
 *                         uptime:
 *                           type: number
 *                     disk:
 *                       type: object
 *       503:
 *         description: System is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/health', async (req, res) => {
  try {
    const health = await performHealthCheck()

    const statusCode = health.status === 'healthy' ? 200 :
                       health.status === 'degraded' ? 200 : 503

    res.status(statusCode).json(health)
  } catch (error) {
    logger.error('Health check endpoint error', {
      error: error.message,
      stack: error.stack
    })

    res.status(503).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
})

/**
 * @swagger
 * /api/monitoring/health/quick:
 *   get:
 *     summary: Quick health check
 *     description: Fast health check endpoint optimized for load balancers and high-frequency polling
 *     tags: [Monitoring]
 *     responses:
 *       200:
 *         description: System is operational
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [ok, error]
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       503:
 *         description: System is not operational
 */
router.get('/health/quick', async (req, res) => {
  try {
    const health = await quickHealthCheck()

    const statusCode = health.status === 'ok' ? 200 : 503

    res.status(statusCode).json(health)
  } catch (error) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString()
    })
  }
})

/**
 * @swagger
 * /api/monitoring/health/liveness:
 *   get:
 *     summary: Kubernetes liveness probe
 *     description: Checks if the application process is alive and running (always returns 200 if process is up)
 *     tags: [Monitoring]
 *     responses:
 *       200:
 *         description: Process is alive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: alive
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/health/liveness', (req, res) => {
  // Just check if the process is running
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString()
  })
})

/**
 * @swagger
 * /api/monitoring/health/readiness:
 *   get:
 *     summary: Kubernetes readiness probe
 *     description: Checks if the application is ready to handle traffic (verifies critical dependencies)
 *     tags: [Monitoring]
 *     responses:
 *       200:
 *         description: Application is ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ready
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       503:
 *         description: Application is not ready
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: not-ready
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/health/readiness', async (req, res) => {
  // Check if the app can handle traffic
  try {
    const health = await quickHealthCheck()

    if (health.status === 'ok') {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString()
      })
    } else {
      res.status(503).json({
        status: 'not-ready',
        timestamp: new Date().toISOString()
      })
    }
  } catch (error) {
    res.status(503).json({
      status: 'not-ready',
      timestamp: new Date().toISOString()
    })
  }
})

/**
 * @swagger
 * /api/monitoring/metrics:
 *   get:
 *     summary: Get performance metrics
 *     description: Returns detailed performance metrics including request counts, response times, and slow requests. Requires admin authentication.
 *     tags: [Monitoring]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Performance metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     uptime:
 *                       type: number
 *                       description: Server uptime in seconds
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     requests:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                         success:
 *                           type: number
 *                         clientError:
 *                           type: number
 *                         serverError:
 *                           type: number
 *                     responseTimes:
 *                       type: object
 *                       properties:
 *                         avg:
 *                           type: number
 *                         min:
 *                           type: number
 *                         max:
 *                           type: number
 *                         p50:
 *                           type: number
 *                         p95:
 *                           type: number
 *                         p99:
 *                           type: number
 *                     slowRequests:
 *                       type: object
 *                       properties:
 *                         count:
 *                           type: number
 *                         recent:
 *                           type: array
 *                           items:
 *                             type: object
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/metrics', authenticate, (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      })
    }

    const metrics = getMetrics()

    res.json({
      success: true,
      data: metrics
    })
  } catch (error) {
    logger.error('Metrics endpoint error', {
      error: error.message,
      stack: error.stack
    })

    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * @swagger
 * /api/monitoring/metrics/reset:
 *   post:
 *     summary: Reset performance metrics
 *     description: Resets all collected performance metrics to zero. Requires admin authentication.
 *     tags: [Monitoring]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Metrics reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Metrics reset successfully
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/metrics/reset', authenticate, (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      })
    }

    resetMetrics()

    logger.info('Performance metrics reset', {
      userId: req.user.id,
      correlationId: req.correlationId
    })

    res.json({
      success: true,
      message: 'Metrics reset successfully'
    })
  } catch (error) {
    logger.error('Metrics reset error', {
      error: error.message,
      stack: error.stack
    })

    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

/**
 * @swagger
 * /api/monitoring/version:
 *   get:
 *     summary: Get application version
 *     description: Returns application version, build information, and runtime details
 *     tags: [Monitoring]
 *     responses:
 *       200:
 *         description: Version information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: carbon-depict-server
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 description:
 *                   type: string
 *                 nodeVersion:
 *                   type: string
 *                   example: v18.17.0
 *                 environment:
 *                   type: string
 *                   enum: [development, production, staging]
 *                   example: production
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/version', (req, res) => {
  const packageJson = require('../../package.json')

  res.json({
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  })
})

module.exports = router
