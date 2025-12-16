/**
 * Notifications API Routes
 *
 * Handles system notifications, approvals, rejections, and broadcasts
 */
const express = require('express');
const router = express.Router();
const Notification = require('../models/mongodb/Notification');
const { authenticate, authorize } = require('../middleware/auth');

// Get all notifications for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const { unreadOnly = false, limit = 50, skip = 0 } = req.query;

    const query = {
      recipient: req.user._id,
      companyId: req.user.companyId
    };

    if (unreadOnly === 'true') {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .populate('sender', 'firstName lastName email role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      companyId: req.user.companyId,
      read: false
    });

    res.json({
      success: true,
      data: notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications'
    });
  }
});

// Create notification
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      recipientId,
      type,
      title,
      message,
      metadata
    } = req.body;

    if (!recipientId || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const notification = await Notification.create({
      recipient: recipientId,
      sender: req.user._id,
      type,
      title,
      message,
      metadata,
      companyId: req.user.companyId
    });

    await notification.populate('sender', 'firstName lastName email role');

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create notification'
    });
  }
});

// Broadcast notification to all users (admin/system owner only)
router.post('/broadcast', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { title, message, type = 'broadcast', priority = 'normal' } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Title and message are required'
      });
    }

    // Get all users in the company
    const User = require('../models/mongodb/User');
    const users = await User.find({
      companyId: req.user.companyId,
      _id: { $ne: req.user._id }
    }).select('_id');

    // Create notifications for all users
    const notifications = users.map(user => ({
      recipient: user._id,
      sender: req.user._id,
      type,
      title,
      message,
      metadata: {
        broadcast: {
          isBroadcast: true,
          fromAdmin: true,
          priority
        }
      },
      companyId: req.user.companyId
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: `Broadcast sent to ${users.length} users`,
      recipientCount: users.length
    });
  } catch (error) {
    console.error('Error broadcasting notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to broadcast notification'
    });
  }
});

// Mark notification as read
router.put('/:id/read', authenticate, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user._id,
        companyId: req.user.companyId
      },
      {
        read: true,
        readAt: new Date()
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    res.json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read'
    });
  }
});

// Mark all notifications as read
router.put('/read-all', authenticate, async (req, res) => {
  try {
    const result = await Notification.updateMany(
      {
        recipient: req.user._id,
        companyId: req.user.companyId,
        read: false
      },
      {
        read: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      message: `Marked ${result.modifiedCount} notifications as read`
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notifications as read'
    });
  }
});

// Delete notification
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id,
      companyId: req.user.companyId
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete notification'
    });
  }
});

// Delete all notifications
router.delete('/', authenticate, async (req, res) => {
  try {
    const result = await Notification.deleteMany({
      recipient: req.user._id,
      companyId: req.user.companyId
    });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} notifications`
    });
  } catch (error) {
    console.error('Error deleting notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete notifications'
    });
  }
});

module.exports = router;
