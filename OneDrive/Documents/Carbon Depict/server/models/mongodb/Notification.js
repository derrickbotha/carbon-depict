/**
 * Notification Model - System Notifications
 *
 * Manages notifications for approvals, rejections, and broadcasts
 */
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    required: true,
    enum: ['approval', 'rejection', 'message', 'broadcast', 'system', 'info', 'success', 'error', 'warning'],
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  read: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date
  },
  metadata: {
    entryId: mongoose.Schema.Types.ObjectId,
    entryType: String,
    reason: String,
    notes: String,
    action: {
      label: String,
      url: String,
      onClick: String
    },
    broadcast: {
      isBroadcast: Boolean,
      fromAdmin: Boolean,
      priority: String
    }
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  }
}, {
  timestamps: true
});

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });
notificationSchema.index({ companyId: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
