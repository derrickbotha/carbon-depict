/**
 * WebSocket Collaboration Handler - Phase 4 Week 18
 *
 * Handles real-time collaboration features:
 * - User presence tracking
 * - Live data updates
 * - Collaborative editing
 * - Real-time notifications
 */
const logger = require('../utils/logger')

class CollaborationHandler {
  constructor(io) {
    this.io = io
    this.activeUsers = new Map() // roomId => Set of user IDs
    this.userSockets = new Map() // userId => Set of socket IDs
    this.documentLocks = new Map() // documentId => userId
  }

  /**
   * Initialize WebSocket handlers
   */
  initialize() {
    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`)

      // Authentication
      const user = socket.handshake.auth.user
      if (!user) {
        socket.disconnect()
        return
      }

      // Track user socket
      if (!this.userSockets.has(user.id)) {
        this.userSockets.set(user.id, new Set())
      }
      this.userSockets.get(user.id).add(socket.id)

      // Join user's company room
      socket.join(`company:${user.companyId}`)

      // Event handlers
      this.setupEventHandlers(socket, user)

      // Send initial presence
      this.broadcastPresence(user.companyId)

      // Handle disconnect
      socket.on('disconnect', () => {
        this.handleDisconnect(socket, user)
      })
    })

    logger.info('WebSocket collaboration handlers initialized')
  }

  /**
   * Setup event handlers for socket
   */
  setupEventHandlers(socket, user) {
    // Join specific room
    socket.on('join:room', (data) => {
      this.handleJoinRoom(socket, user, data)
    })

    // Leave room
    socket.on('leave:room', (data) => {
      this.handleLeaveRoom(socket, user, data)
    })

    // Document editing events
    socket.on('document:lock', (data) => {
      this.handleDocumentLock(socket, user, data)
    })

    socket.on('document:unlock', (data) => {
      this.handleDocumentUnlock(socket, user, data)
    })

    socket.on('document:update', (data) => {
      this.handleDocumentUpdate(socket, user, data)
    })

    // Cursor tracking
    socket.on('cursor:move', (data) => {
      this.handleCursorMove(socket, user, data)
    })

    // Comments and mentions
    socket.on('comment:add', (data) => {
      this.handleCommentAdd(socket, user, data)
    })

    // Typing indicators
    socket.on('typing:start', (data) => {
      this.handleTypingStart(socket, user, data)
    })

    socket.on('typing:stop', (data) => {
      this.handleTypingStop(socket, user, data)
    })

    // Data updates
    socket.on('data:update', (data) => {
      this.handleDataUpdate(socket, user, data)
    })

    // Notifications
    socket.on('notification:send', (data) => {
      this.handleNotificationSend(socket, user, data)
    })
  }

  /**
   * Handle user joining a room
   */
  handleJoinRoom(socket, user, data) {
    const { roomId, roomType } = data

    socket.join(roomId)

    // Track active users in room
    if (!this.activeUsers.has(roomId)) {
      this.activeUsers.set(roomId, new Set())
    }
    this.activeUsers.get(roomId).add(user.id)

    // Broadcast to room
    socket.to(roomId).emit('user:joined', {
      userId: user.id,
      userName: user.name,
      timestamp: new Date()
    })

    // Send current users in room
    const usersInRoom = Array.from(this.activeUsers.get(roomId))
    socket.emit('room:users', {
      roomId,
      users: usersInRoom
    })

    logger.info(`User ${user.id} joined room ${roomId}`)
  }

  /**
   * Handle user leaving a room
   */
  handleLeaveRoom(socket, user, data) {
    const { roomId } = data

    socket.leave(roomId)

    // Remove from active users
    if (this.activeUsers.has(roomId)) {
      this.activeUsers.get(roomId).delete(user.id)

      if (this.activeUsers.get(roomId).size === 0) {
        this.activeUsers.delete(roomId)
      }
    }

    // Broadcast to room
    socket.to(roomId).emit('user:left', {
      userId: user.id,
      timestamp: new Date()
    })

    logger.info(`User ${user.id} left room ${roomId}`)
  }

  /**
   * Handle document lock request
   */
  handleDocumentLock(socket, user, data) {
    const { documentId } = data

    // Check if document is already locked
    if (this.documentLocks.has(documentId)) {
      const lockedBy = this.documentLocks.get(documentId)
      socket.emit('document:lock:failed', {
        documentId,
        lockedBy,
        message: 'Document is currently being edited by another user'
      })
      return
    }

    // Lock document
    this.documentLocks.set(documentId, user.id)

    socket.emit('document:lock:success', {
      documentId,
      timestamp: new Date()
    })

    // Notify others in room
    socket.to(`document:${documentId}`).emit('document:locked', {
      documentId,
      lockedBy: user.id,
      lockedByName: user.name,
      timestamp: new Date()
    })

    logger.info(`Document ${documentId} locked by user ${user.id}`)
  }

  /**
   * Handle document unlock
   */
  handleDocumentUnlock(socket, user, data) {
    const { documentId } = data

    // Verify user owns the lock
    if (this.documentLocks.get(documentId) !== user.id) {
      socket.emit('document:unlock:failed', {
        documentId,
        message: 'You do not have the lock on this document'
      })
      return
    }

    // Unlock document
    this.documentLocks.delete(documentId)

    socket.emit('document:unlock:success', {
      documentId,
      timestamp: new Date()
    })

    // Notify others
    socket.to(`document:${documentId}`).emit('document:unlocked', {
      documentId,
      timestamp: new Date()
    })

    logger.info(`Document ${documentId} unlocked by user ${user.id}`)
  }

  /**
   * Handle document update
   */
  handleDocumentUpdate(socket, user, data) {
    const { documentId, changes, version } = data

    // Verify user has lock
    if (this.documentLocks.get(documentId) !== user.id) {
      socket.emit('document:update:failed', {
        documentId,
        message: 'You must lock the document before updating'
      })
      return
    }

    // Broadcast changes to others
    socket.to(`document:${documentId}`).emit('document:updated', {
      documentId,
      changes,
      version,
      userId: user.id,
      userName: user.name,
      timestamp: new Date()
    })

    logger.info(`Document ${documentId} updated by user ${user.id}`)
  }

  /**
   * Handle cursor movement
   */
  handleCursorMove(socket, user, data) {
    const { documentId, position } = data

    // Broadcast cursor position to others in same document
    socket.to(`document:${documentId}`).emit('cursor:moved', {
      userId: user.id,
      userName: user.name,
      position,
      timestamp: Date.now()
    })
  }

  /**
   * Handle comment addition
   */
  handleCommentAdd(socket, user, data) {
    const { documentId, comment, mentions } = data

    // Broadcast comment
    this.io.to(`document:${documentId}`).emit('comment:added', {
      documentId,
      comment: {
        ...comment,
        userId: user.id,
        userName: user.name,
        timestamp: new Date()
      }
    })

    // Send notifications to mentioned users
    if (mentions && mentions.length > 0) {
      mentions.forEach(mentionedUserId => {
        this.sendNotificationToUser(mentionedUserId, {
          type: 'mention',
          message: `${user.name} mentioned you in a comment`,
          documentId,
          commentId: comment.id
        })
      })
    }

    logger.info(`Comment added to document ${documentId} by user ${user.id}`)
  }

  /**
   * Handle typing start
   */
  handleTypingStart(socket, user, data) {
    const { documentId } = data

    socket.to(`document:${documentId}`).emit('typing:started', {
      userId: user.id,
      userName: user.name,
      documentId,
      timestamp: Date.now()
    })
  }

  /**
   * Handle typing stop
   */
  handleTypingStop(socket, user, data) {
    const { documentId } = data

    socket.to(`document:${documentId}`).emit('typing:stopped', {
      userId: user.id,
      documentId,
      timestamp: Date.now()
    })
  }

  /**
   * Handle data update broadcast
   */
  handleDataUpdate(socket, user, data) {
    const { type, entityId, changes } = data

    // Broadcast to company room
    socket.to(`company:${user.companyId}`).emit('data:updated', {
      type,
      entityId,
      changes,
      userId: user.id,
      timestamp: new Date()
    })

    logger.info(`Data update broadcast: ${type} ${entityId} by user ${user.id}`)
  }

  /**
   * Handle notification send
   */
  handleNotificationSend(socket, user, data) {
    const { recipientIds, notification } = data

    recipientIds.forEach(recipientId => {
      this.sendNotificationToUser(recipientId, {
        ...notification,
        senderId: user.id,
        senderName: user.name,
        timestamp: new Date()
      })
    })
  }

  /**
   * Handle disconnect
   */
  handleDisconnect(socket, user) {
    logger.info(`Client disconnected: ${socket.id}`)

    // Remove socket from user's sockets
    if (this.userSockets.has(user.id)) {
      this.userSockets.get(user.id).delete(socket.id)

      if (this.userSockets.get(user.id).size === 0) {
        this.userSockets.delete(user.id)
      }
    }

    // Release any document locks held by this user
    for (const [documentId, userId] of this.documentLocks.entries()) {
      if (userId === user.id) {
        this.documentLocks.delete(documentId)

        // Notify others
        this.io.to(`document:${documentId}`).emit('document:unlocked', {
          documentId,
          reason: 'User disconnected',
          timestamp: new Date()
        })
      }
    }

    // Remove from all rooms
    for (const [roomId, users] of this.activeUsers.entries()) {
      if (users.has(user.id)) {
        users.delete(user.id)

        this.io.to(roomId).emit('user:left', {
          userId: user.id,
          timestamp: new Date()
        })

        if (users.size === 0) {
          this.activeUsers.delete(roomId)
        }
      }
    }

    // Broadcast presence update
    this.broadcastPresence(user.companyId)
  }

  /**
   * Broadcast presence to company
   */
  broadcastPresence(companyId) {
    const room = `company:${companyId}`
    const activeUserIds = new Set()

    // Collect all active users in company room
    const sockets = this.io.sockets.adapter.rooms.get(room)
    if (sockets) {
      for (const socketId of sockets) {
        const socket = this.io.sockets.sockets.get(socketId)
        if (socket && socket.handshake.auth.user) {
          activeUserIds.add(socket.handshake.auth.user.id)
        }
      }
    }

    // Broadcast to company room
    this.io.to(room).emit('presence:update', {
      activeUsers: Array.from(activeUserIds),
      timestamp: new Date()
    })
  }

  /**
   * Send notification to specific user
   */
  sendNotificationToUser(userId, notification) {
    const userSocketIds = this.userSockets.get(userId)

    if (userSocketIds) {
      userSocketIds.forEach(socketId => {
        const socket = this.io.sockets.sockets.get(socketId)
        if (socket) {
          socket.emit('notification:received', notification)
        }
      })
    }
  }

  /**
   * Broadcast data update to company
   */
  broadcastDataUpdate(companyId, data) {
    this.io.to(`company:${companyId}`).emit('data:updated', {
      ...data,
      timestamp: new Date()
    })
  }

  /**
   * Get active users in room
   */
  getActiveUsersInRoom(roomId) {
    return Array.from(this.activeUsers.get(roomId) || [])
  }

  /**
   * Check if document is locked
   */
  isDocumentLocked(documentId) {
    return this.documentLocks.has(documentId)
  }

  /**
   * Get document lock owner
   */
  getDocumentLockOwner(documentId) {
    return this.documentLocks.get(documentId)
  }
}

module.exports = CollaborationHandler
