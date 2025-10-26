const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const mongoose = require('mongoose')
const { User, Company, Location, Facility, GHGEmission, ActivityLog } = require('../models/mongodb')
const { authenticate, isAdmin } = require('../middleware/auth')
const { emitToUser, emitToCompany, disconnectUser, getConnectedUsersCount, getConnectedUsersByCompany } = require('../services/websocketService')
const { getAllQueuesStats, getJobStatus, retryJob, removeJob, pauseQueue, resumeQueue, cleanQueue } = require('../services/queueService')

// All admin routes require authentication and admin role
router.use(authenticate, isAdmin)

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 */
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      totalCompanies,
      activeUsers,
      verifiedUsers,
      totalEmissions,
      totalFacilities,
      connectedUsers,
    ] = await Promise.all([
      User.countDocuments(),
      Company.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ emailVerified: true }),
      GHGEmission.countDocuments(),
      Facility.countDocuments(),
      getConnectedUsersCount(),
    ])

    const recentActivity = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean()

    const queueStats = await getAllQueuesStats()

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })

    res.json({
      stats: {
        users: {
          total: totalUsers,
          active: activeUsers,
          verified: verifiedUsers,
          newLast30Days: newUsers,
          connected: connectedUsers
        },
        companies: {
          total: totalCompanies
        },
        emissions: {
          total: totalEmissions
        },
        facilities: {
          total: totalFacilities
        }
      },
      queueStats,
      recentActivity
    })
  } catch (error) {
    console.error('Admin dashboard error:', error)
    res.status(500).json({ error: 'Failed to load dashboard' })
  }
})

/**
 * GET /api/admin/users
 * Get all users with pagination and filtering
 */
router.get('/users', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      role,
      isActive,
      emailVerified,
      companyId,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query

    const pageNumber = Math.max(parseInt(page, 10) || 1, 1)
    const pageSize = Math.min(parseInt(limit, 10) || 20, 100)
    const skip = (pageNumber - 1) * pageSize

    const filter = {}

    if (search) {
      const regex = new RegExp(search, 'i')
      filter.$or = [
        { email: regex },
        { firstName: regex },
        { lastName: regex }
      ]
    }

    if (role) filter.role = role
    if (isActive !== undefined) filter.isActive = isActive === 'true'
    if (emailVerified !== undefined) filter.emailVerified = emailVerified === 'true'
    if (companyId && mongoose.Types.ObjectId.isValid(companyId)) {
      filter.companyId = companyId
    }

    const allowedSortFields = ['createdAt', 'email', 'firstName', 'lastName', 'role', 'lastLogin']
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt'
    const sortDirection = sortOrder && sortOrder.toUpperCase() === 'ASC' ? 1 : -1
    const sort = { [sortField]: sortDirection }

    const [users, count] = await Promise.all([
      User.find(filter)
        .populate({
          path: 'company',
          select: 'name industry subscription isActive'
        })
        .sort(sort)
        .skip(skip)
        .limit(pageSize)
        .select('-password'),
      User.countDocuments(filter)
    ])

    res.json({
      users,
      pagination: {
        total: count,
        page: pageNumber,
        limit: pageSize,
        pages: Math.ceil(count / pageSize)
      }
    })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

/**
 * GET /api/admin/users/:id
 * Get user details
 */
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = await User.findById(id)
      .populate({ path: 'company', select: 'name industry subscription isActive' })
      .select('-password')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Get user activity logs
    const activityLogs = await ActivityLog.find({
      userId: user.id.toString()
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    res.json({
      user,
      activityLogs
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

/**
 * POST /api/admin/users
 * Create new user (admin)
 */
router.post('/users', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('companyId').isMongoId(),
  body('role').isIn(['admin', 'manager', 'user'])
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password, firstName, lastName, companyId, role } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Verify company exists
    const company = await Company.findById(companyId)
    if (!company) {
      return res.status(404).json({ error: 'Company not found' })
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      companyId,
      role,
      isActive: true,
      emailVerified: true // Admin-created users are pre-verified
    })

    await user.populate({ path: 'company', select: 'name industry subscription isActive' })

    // Log activity
    await ActivityLog.create({
      action: 'user_created_by_admin',
      userId: user.id.toString(),
      companyId: companyId.toString(),
      resourceType: 'user',
      resourceId: user.id.toString(),
      metadata: {
        createdBy: req.user.id.toString(),
        createdByEmail: req.user.email
      }
    })

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        company: {
          id: company.id,
          name: company.name
        }
      }
    })
  } catch (error) {
    console.error('Create user error:', error)
    res.status(500).json({ error: 'Failed to create user' })
  }
})

/**
 * PUT /api/admin/users/:id
 * Update user
 */
router.put('/users/:id', [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('role').optional().isIn(['admin', 'manager', 'user']),
  body('isActive').optional().isBoolean(),
  body('emailVerified').optional().isBoolean()
], async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const { firstName, lastName, role, isActive, emailVerified } = req.body

    // Update fields
    if (firstName !== undefined) user.firstName = firstName
    if (lastName !== undefined) user.lastName = lastName
    if (role !== undefined) user.role = role
    if (isActive !== undefined) user.isActive = isActive
    if (emailVerified !== undefined) user.emailVerified = emailVerified

  await user.save()

    // If user is deactivated, disconnect them
    if (isActive === false) {
      await disconnectUser(user.id, 'Account deactivated by administrator')
    }

    // Log activity
    await ActivityLog.create({
      action: 'user_updated_by_admin',
      userId: user.id.toString(),
      companyId: user.companyId.toString(),
      resourceType: 'user',
      resourceId: user.id.toString(),
      metadata: {
        updatedBy: req.user.id.toString(),
        changes: req.body
      }
    })

    // Emit real-time update
    emitToUser(user.id, 'account_updated', { user })

    res.json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified
      }
    })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

/**
 * DELETE /api/admin/users/:id
 * Delete user (soft delete)
 */
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Prevent self-deletion
    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' })
    }

    // Soft delete
  await user.deleteOne()

    // Disconnect user
    await disconnectUser(user.id, 'Account deleted by administrator')

    // Log activity
    await ActivityLog.create({
      action: 'user_deleted_by_admin',
      userId: user.id.toString(),
      companyId: user.companyId.toString(),
      resourceType: 'user',
      resourceId: user.id.toString(),
      metadata: {
        deletedBy: req.user.id.toString(),
        deletedByEmail: req.user.email
      }
    })

    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

/**
 * GET /api/admin/companies
 * Get all companies
 */
router.get('/companies', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, industry, isActive } = req.query
    const pageNumber = Math.max(parseInt(page, 10) || 1, 1)
    const pageSize = Math.min(parseInt(limit, 10) || 20, 100)
    const skip = (pageNumber - 1) * pageSize

    const filter = {}
    if (search) filter.name = new RegExp(search, 'i')
    if (industry) filter.industry = industry
    if (isActive !== undefined) filter.isActive = isActive === 'true'

    const [companies, count] = await Promise.all([
      Company.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate({
          path: 'users',
          select: 'email firstName lastName role isActive'
        }),
      Company.countDocuments(filter)
    ])

    res.json({
      companies,
      pagination: {
        total: count,
        page: pageNumber,
        limit: pageSize,
        pages: Math.ceil(count / pageSize)
      }
    })
  } catch (error) {
    console.error('Get companies error:', error)
    res.status(500).json({ error: 'Failed to fetch companies' })
  }
})

/**
 * PUT /api/admin/companies/:id
 * Update company
 */
router.put('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'Company not found' })
    }

    const company = await Company.findById(id)

    if (!company) {
      return res.status(404).json({ error: 'Company not found' })
    }

    const { name, industry, subscription, isActive, settings } = req.body

    if (name !== undefined) company.name = name
    if (industry !== undefined) company.industry = industry
    if (subscription !== undefined) company.subscription = subscription
    if (isActive !== undefined) company.isActive = isActive
    if (settings !== undefined) company.settings = { ...company.settings, ...settings }

    await company.save()

    // If company is deactivated, notify all users
    if (isActive === false) {
      emitToCompany(company.id, 'company_deactivated', {
        message: 'Your company account has been deactivated'
      })
    }

    // Log activity
    await ActivityLog.create({
      action: 'company_updated_by_admin',
      companyId: company.id.toString(),
      resourceType: 'company',
      resourceId: company.id.toString(),
      metadata: {
        updatedBy: req.user.id.toString(),
        changes: req.body
      }
    })

    res.json({
      message: 'Company updated successfully',
      company
    })
  } catch (error) {
    console.error('Update company error:', error)
    res.status(500).json({ error: 'Failed to update company' })
  }
})

/**
 * GET /api/admin/activity
 * Get activity logs
 */
router.get('/activity', async (req, res) => {
  try {
    const { page = 1, limit = 50, action, userId, companyId, resourceType } = req.query
    const skip = (page - 1) * limit

    const query = {}
    if (action) query.action = action
    if (userId) query.userId = userId
    if (companyId) query.companyId = companyId
    if (resourceType) query.resourceType = resourceType

    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .sort({ timestamp: -1 })
        .limit(parseInt(limit))
        .skip(skip)
        .lean(),
      ActivityLog.countDocuments(query)
    ])

    res.json({
      logs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get activity logs error:', error)
    res.status(500).json({ error: 'Failed to fetch activity logs' })
  }
})

/**
 * GET /api/admin/system/queues
 * Get queue statistics
 */
router.get('/system/queues', async (req, res) => {
  try {
    const stats = await getAllQueuesStats()
    res.json({ queues: stats })
  } catch (error) {
    console.error('Get queue stats error:', error)
    res.status(500).json({ error: 'Failed to fetch queue statistics' })
  }
})

/**
 * POST /api/admin/system/queues/:queueName/pause
 * Pause a queue
 */
router.post('/system/queues/:queueName/pause', async (req, res) => {
  try {
    await pauseQueue(req.params.queueName)
    res.json({ message: `Queue ${req.params.queueName} paused successfully` })
  } catch (error) {
    console.error('Pause queue error:', error)
    res.status(500).json({ error: 'Failed to pause queue' })
  }
})

/**
 * POST /api/admin/system/queues/:queueName/resume
 * Resume a queue
 */
router.post('/system/queues/:queueName/resume', async (req, res) => {
  try {
    await resumeQueue(req.params.queueName)
    res.json({ message: `Queue ${req.params.queueName} resumed successfully` })
  } catch (error) {
    console.error('Resume queue error:', error)
    res.status(500).json({ error: 'Failed to resume queue' })
  }
})

/**
 * POST /api/admin/system/queues/:queueName/clean
 * Clean old jobs from queue
 */
router.post('/system/queues/:queueName/clean', async (req, res) => {
  try {
    const { grace = 86400000, status = 'completed' } = req.body
    const cleaned = await cleanQueue(req.params.queueName, grace, status)
    res.json({ 
      message: `Cleaned ${cleaned.length} ${status} jobs`,
      cleaned: cleaned.length
    })
  } catch (error) {
    console.error('Clean queue error:', error)
    res.status(500).json({ error: 'Failed to clean queue' })
  }
})

/**
 * GET /api/admin/system/websockets
 * Get WebSocket connection statistics
 */
router.get('/system/websockets', async (req, res) => {
  try {
    const totalConnected = await getConnectedUsersCount()

    // Get connected users by company
    const companies = await Company.find({}, 'name')
    const companyCounts = await Promise.all(
      companies.map(async (company) => ({
        companyId: company._id.toString(),
        companyName: company.name,
        connectedUsers: await getConnectedUsersByCompany(company._id.toString())
      }))
    )

    res.json({
      totalConnected,
      byCompany: companyCounts
    })
  } catch (error) {
    console.error('Get WebSocket stats error:', error)
    res.status(500).json({ error: 'Failed to fetch WebSocket statistics' })
  }
})

module.exports = router
