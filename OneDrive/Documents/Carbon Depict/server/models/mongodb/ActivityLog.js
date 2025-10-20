const mongoose = require('mongoose')

/**
 * ActivityLog Model (MongoDB)
 * Stores audit trail and user activity logs
 * Non-relational structure for flexible logging
 */
const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    companyId: {
      type: String,
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
      // 'emission.created', 'report.generated', 'user.login', etc.
    },
    resource: {
      type: String,
      // Resource type: emission, report, factor, user
    },
    resourceId: {
      type: String,
      // UUID of affected resource
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      // Flexible structure for action details
    },
    previousState: {
      type: mongoose.Schema.Types.Mixed,
      // For updates, store previous values
    },
    newState: {
      type: mongoose.Schema.Types.Mixed,
      // For updates, store new values
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'pending'],
      default: 'success',
    },
    error: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'activity_logs',
  }
)

// Indexes for efficient querying
activityLogSchema.index({ userId: 1, createdAt: -1 })
activityLogSchema.index({ companyId: 1, action: 1, createdAt: -1 })
activityLogSchema.index({ resource: 1, resourceId: 1 })
activityLogSchema.index({ createdAt: -1 })

// TTL index to auto-delete logs after 2 years
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 63072000 })

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema)

module.exports = ActivityLog
