const socketIO = require('socket.io')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const { User, Company } = require('../models/mongodb')

let io = null

/**
 * Initialize WebSocket server
 */
const initializeWebSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  })

  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1]

      if (!token) {
        return next(new Error('Authentication token required'))
      }

      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')

      if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
        return next(new Error('Invalid token'))
      }

      // Get user with company
      const user = await User.findById(decoded.userId)
        .populate({ path: 'company', select: 'name isActive' })
        .select('email firstName lastName role companyId isActive emailVerified')

      if (!user || !user.isActive || !user.emailVerified) {
        return next(new Error('Invalid or inactive user'))
      }

      // Attach user to socket
      socket.user = user
      socket.companyId = user.companyId ? user.companyId.toString() : user.company?._id?.toString()

      next()
    } catch (error) {
      console.error('WebSocket authentication error:', error)
      next(new Error('Authentication failed'))
    }
  })

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.email} (Company: ${socket.user.company.name})`)

    // Join user-specific room
    socket.join(`user:${socket.user.id}`)

    // Join company-specific room
    socket.join(`company:${socket.companyId}`)

    // Join role-specific room
    socket.join(`role:${socket.user.role}`)

    // Send connection success
    socket.emit('connected', {
      message: 'Connected to Carbon Depict real-time server',
      userId: socket.user.id,
      companyId: socket.companyId,
      role: socket.user.role
    })

    // Handle emissions data updates subscription
    socket.on('subscribe:emissions', (data) => {
      const { facilityId, locationId } = data || {}
      if (facilityId) {
        socket.join(`facility:${facilityId}`)
        console.log(`User ${socket.user.email} subscribed to facility ${facilityId}`)
      }
      if (locationId) {
        socket.join(`location:${locationId}`)
        console.log(`User ${socket.user.email} subscribed to location ${locationId}`)
      }
    })

    // Handle unsubscribe
    socket.on('unsubscribe:emissions', (data) => {
      const { facilityId, locationId } = data || {}
      if (facilityId) {
        socket.leave(`facility:${facilityId}`)
      }
      if (locationId) {
        socket.leave(`location:${locationId}`)
      }
    })

    // Handle ESG metrics subscription
    socket.on('subscribe:esg', (data) => {
      socket.join(`company:${socket.companyId}:esg`)
      console.log(`User ${socket.user.email} subscribed to ESG updates`)
    })

    // Handle reports subscription
    socket.on('subscribe:reports', () => {
      socket.join(`company:${socket.companyId}:reports`)
      console.log(`User ${socket.user.email} subscribed to report updates`)
    })

    // Handle AI predictions subscription
    socket.on('subscribe:ai', () => {
      socket.join(`company:${socket.companyId}:ai`)
      console.log(`User ${socket.user.email} subscribed to AI updates`)
    })

    // Handle notification preferences
    socket.on('preferences:update', (preferences) => {
      socket.preferences = preferences
      console.log(`User ${socket.user.email} updated notification preferences`)
    })

    // Handle ping for connection keep-alive
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() })
    })

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`User disconnected: ${socket.user.email} (Reason: ${reason})`)
    })

    // Error handler
    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.user.email}:`, error)
    })
  })

  console.log('WebSocket server initialized')
  return io
}

/**
 * Get Socket.IO instance
 */
const getIO = () => {
  if (!io) {
    throw new Error('WebSocket server not initialized. Call initializeWebSocket first.')
  }
  return io
}

/**
 * Emit event to specific user
 */
const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data)
  }
}

/**
 * Emit event to company
 */
const emitToCompany = (companyId, event, data) => {
  if (io) {
    io.to(`company:${companyId}`).emit(event, data)
  }
}

/**
 * Emit event to facility subscribers
 */
const emitToFacility = (facilityId, event, data) => {
  if (io) {
    io.to(`facility:${facilityId}`).emit(event, data)
  }
}

/**
 * Emit event to location subscribers
 */
const emitToLocation = (locationId, event, data) => {
  if (io) {
    io.to(`location:${locationId}`).emit(event, data)
  }
}

/**
 * Emit event to role (admin, manager, user)
 */
const emitToRole = (role, event, data) => {
  if (io) {
    io.to(`role:${role}`).emit(event, data)
  }
}

/**
 * Emit ESG update to company
 */
const emitESGUpdate = (companyId, data) => {
  if (io) {
    io.to(`company:${companyId}:esg`).emit('esg:update', data)
  }
}

/**
 * Emit report update to company
 */
const emitReportUpdate = (companyId, data) => {
  if (io) {
    io.to(`company:${companyId}:reports`).emit('report:update', data)
  }
}

/**
 * Emit AI prediction to company
 */
const emitAIPrediction = (companyId, data) => {
  if (io) {
    io.to(`company:${companyId}:ai`).emit('ai:prediction', data)
  }
}

/**
 * Emit emissions update
 */
const emitEmissionsUpdate = (companyId, facilityId, locationId, data) => {
  if (io) {
    // Emit to company
    io.to(`company:${companyId}`).emit('emissions:update', data)
    
    // Emit to facility subscribers if specified
    if (facilityId) {
      io.to(`facility:${facilityId}`).emit('emissions:update', data)
    }
    
    // Emit to location subscribers if specified
    if (locationId) {
      io.to(`location:${locationId}`).emit('emissions:update', data)
    }
  }
}

/**
 * Broadcast system notification to all admins
 */
const broadcastToAdmins = (event, data) => {
  if (io) {
    io.to('role:admin').emit(event, data)
  }
}

/**
 * Get connected users count
 */
const getConnectedUsersCount = async () => {
  if (!io) return 0
  const sockets = await io.fetchSockets()
  return sockets.length
}

/**
 * Get connected users by company
 */
const getConnectedUsersByCompany = async (companyId) => {
  if (!io) return 0
  const sockets = await io.in(`company:${companyId}`).fetchSockets()
  return sockets.length
}

/**
 * Disconnect user (force logout)
 */
const disconnectUser = async (userId, reason = 'Forced logout') => {
  if (!io) return
  const sockets = await io.in(`user:${userId}`).fetchSockets()
  sockets.forEach(socket => {
    socket.emit('force_logout', { reason })
    socket.disconnect(true)
  })
}

module.exports = {
  initializeWebSocket,
  getIO,
  emitToUser,
  emitToCompany,
  emitToFacility,
  emitToLocation,
  emitToRole,
  emitESGUpdate,
  emitReportUpdate,
  emitAIPrediction,
  emitEmissionsUpdate,
  broadcastToAdmins,
  getConnectedUsersCount,
  getConnectedUsersByCompany,
  disconnectUser
}
