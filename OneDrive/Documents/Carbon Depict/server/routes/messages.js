/**
 * Messages API Routes
 *
 * Handles internal messaging between users
 */
const express = require('express');
const router = express.Router();
const Conversation = require('../models/mongodb/Conversation');
const Message = require('../models/mongodb/Message');
const { authenticate } = require('../middleware/auth');

// Get all conversations for current user
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
      companyId: req.user.companyId
    })
      .populate('participants', 'firstName lastName email role')
      .populate('lastMessage')
      .populate('createdBy', 'firstName lastName email')
      .sort({ updatedAt: -1 });

    // Calculate unread counts
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          sender: { $ne: req.user._id },
          read: { $ne: req.user._id }
        });

        return {
          ...conv.toObject(),
          unreadCount
        };
      })
    );

    res.json({
      success: true,
      data: conversationsWithUnread
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversations'
    });
  }
});

// Get messages for a conversation
router.get('/conversations/:id', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      participants: req.user._id,
      companyId: req.user.companyId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    const messages = await Message.find({
      conversationId: req.params.id
    })
      .populate('sender', 'firstName lastName email role')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId: req.params.id,
        sender: { $ne: req.user._id },
        read: { $ne: req.user._id }
      },
      {
        $addToSet: { read: req.user._id }
      }
    );

    res.json({
      success: true,
      data: {
        conversation,
        messages
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages'
    });
  }
});

// Create new conversation and send first message
router.post('/conversations', authenticate, async (req, res) => {
  try {
    const { recipients, message } = req.body;

    if (!recipients || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one recipient is required'
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required'
      });
    }

    // Check if conversation already exists with same participants
    const participants = [...recipients, req.user._id].sort();
    let conversation = await Conversation.findOne({
      participants: { $all: participants, $size: participants.length },
      companyId: req.user.companyId
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants,
        isGroup: recipients.length > 1,
        companyId: req.user.companyId,
        createdBy: req.user._id
      });
    }

    // Create message
    const newMessage = await Message.create({
      conversationId: conversation._id,
      sender: req.user._id,
      content: message.trim(),
      read: [req.user._id]
    });

    // Update conversation last message
    conversation.lastMessage = newMessage._id;
    await conversation.save();

    // Populate conversation
    await conversation.populate('participants', 'firstName lastName email role');
    await conversation.populate('lastMessage');

    res.status(201).json({
      success: true,
      data: conversation
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create conversation'
    });
  }
});

// Send message to existing conversation
router.post('/conversations/:id', authenticate, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required'
      });
    }

    const conversation = await Conversation.findOne({
      _id: req.params.id,
      participants: req.user._id,
      companyId: req.user.companyId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    const newMessage = await Message.create({
      conversationId: conversation._id,
      sender: req.user._id,
      content: message.trim(),
      read: [req.user._id]
    });

    // Update conversation
    conversation.lastMessage = newMessage._id;
    await conversation.save();

    await newMessage.populate('sender', 'firstName lastName email role');

    res.status(201).json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message'
    });
  }
});

// Delete conversation
router.delete('/conversations/:id', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      participants: req.user._id,
      companyId: req.user.companyId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    // Delete all messages
    await Message.deleteMany({ conversationId: conversation._id });

    // Delete conversation
    await Conversation.deleteOne({ _id: conversation._id });

    res.json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete conversation'
    });
  }
});

module.exports = router;
