/**
 * Audit Service - Phase 4 Week 20: Audit Trail & Activity Logging
 *
 * Tracks all user actions and system events:
 * - User activity logging
 * - Data change tracking
 * - Compliance audit trails
 * - Security events
 */
const mongoose = require('mongoose')
const logger = require('../utils/logger')

// Audit Log Schema
const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  action: { type: String, required: true, index: true },
  resource: { type: String, required: true, index: true },
  resourceId: { type: String, index: true },
  changes: { type: mongoose.Schema.Types.Mixed },
  metadata: {
    ip: String,
    userAgent: String,
    method: String,
    url: String
  },
  timestamp: { type: Date, default: Date.now, index: true },
  severity: { type: String, enum: ['info', 'warning', 'error', 'critical'], default: 'info', index: true }
})

// Indexes for efficient querying
auditLogSchema.index({ companyId: 1, timestamp: -1 })
auditLogSchema.index({ userId: 1, timestamp: -1 })
auditLogSchema.index({ resource: 1, resourceId: 1, timestamp: -1 })

const AuditLog = mongoose.model('AuditLog', auditLogSchema)

class AuditService {
  /**
   * Log user action
   */
  async log(data) {
    try {
      const auditEntry = await AuditLog.create({
        userId: data.userId,
        companyId: data.companyId,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        changes: data.changes,
        metadata: {
          ip: data.ip,
          userAgent: data.userAgent,
          method: data.method,
          url: data.url
        },
        severity: data.severity || 'info'
      })

      logger.info('Audit log created:', {
        id: auditEntry._id,
        action: data.action,
        resource: data.resource
      })

      return auditEntry
    } catch (error) {
      logger.error('Error creating audit log:', error)
      // Don't throw - audit logging shouldn't break main flow
    }
  }

  /**
   * Get audit logs with filters
   */
  async getLogs(filters = {}, options = {}) {
    try {
      const {
        companyId,
        userId,
        resource,
        action,
        startDate,
        endDate,
        severity
      } = filters

      const query = {}

      if (companyId) query.companyId = companyId
      if (userId) query.userId = userId
      if (resource) query.resource = resource
      if (action) query.action = action
      if (severity) query.severity = severity

      if (startDate || endDate) {
        query.timestamp = {}
        if (startDate) query.timestamp.$gte = new Date(startDate)
        if (endDate) query.timestamp.$lte = new Date(endDate)
      }

      const { page = 1, limit = 50 } = options
      const skip = (page - 1) * limit

      const [logs, total] = await Promise.all([
        AuditLog.find(query)
          .sort({ timestamp: -1 })
          .skip(skip)
          .limit(limit)
          .populate('userId', 'name email')
          .lean(),
        AuditLog.countDocuments(query)
      ])

      return {
        data: logs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      logger.error('Error fetching audit logs:', error)
      throw error
    }
  }

  /**
   * Get user activity summary
   */
  async getUserActivity(userId, days = 30) {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const activity = await AuditLog.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(userId),
            timestamp: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              action: '$action',
              resource: '$resource'
            },
            count: { $sum: 1 },
            lastActivity: { $max: '$timestamp' }
          }
        },
        { $sort: { count: -1 } }
      ])

      return activity
    } catch (error) {
      logger.error('Error getting user activity:', error)
      throw error
    }
  }

  /**
   * Get resource change history
   */
  async getResourceHistory(resource, resourceId, options = {}) {
    try {
      const { limit = 50 } = options

      const history = await AuditLog.find({
        resource,
        resourceId
      })
        .sort({ timestamp: -1 })
        .limit(limit)
        .populate('userId', 'name email')
        .lean()

      return history
    } catch (error) {
      logger.error('Error getting resource history:', error)
      throw error
    }
  }

  /**
   * Delete old audit logs
   */
  async cleanup(retentionDays = 365) {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

      const result = await AuditLog.deleteMany({
        timestamp: { $lt: cutoffDate },
        severity: { $ne: 'critical' }
      })

      logger.info(`Cleaned up ${result.deletedCount} old audit logs`)

      return result.deletedCount
    } catch (error) {
      logger.error('Error cleaning up audit logs:', error)
      throw error
    }
  }
}

module.exports = new AuditService()
