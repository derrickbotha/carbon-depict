/**
 * System Routes
 * Handles system health, stats, and logs
 */

const express = require('express')
const router = express.Router()
const { authenticate, authorize } = require('../middleware/auth')
const { ActivityLog } = require('../models/mongodb')
const { AppError } = require('../utils/errorHandler')

// Apply authentication to all routes
router.use(authenticate)

// Get system stats
router.get('/stats', authorize('admin'), async (req, res, next) => {
  try {
    const stats = {
      users: {
        total: 25,
        active: 20,
        inactive: 5
      },
      data: {
        emissions: 1250,
        esgMetrics: 340,
        reports: 15,
        files: 89
      },
      performance: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
      },
      lastUpdated: new Date()
    }

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    next(error)
  }
})

// Get system logs
router.get('/logs', authorize('admin'), async (req, res, next) => {
  try {
    const { page = 1, limit = 50, level, startDate, endDate } = req.query
    const filter = { companyId: req.user.companyId }
    
    if (level) filter.level = level
    if (startDate || endDate) {
      filter.timestamp = {}
      if (startDate) filter.timestamp.$gte = new Date(startDate)
      if (endDate) filter.timestamp.$lte = new Date(endDate)
    }

    const logs = await ActivityLog.find(filter)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean()

    const total = await ActivityLog.countDocuments(filter)

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
