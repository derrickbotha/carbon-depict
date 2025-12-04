/**
 * WebSocket Server Initialization - Phase 4 Week 18
 *
 * Sets up Socket.IO for real-time features
 */
const socketIO = require('socket.io')
const CollaborationHandler = require('./collaborationHandler')
const logger = require('../utils/logger')

let io = null
let collaborationHandler = null

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

  // Initialize collaboration handler
  collaborationHandler = new CollaborationHandler(io)
  collaborationHandler.initialize()

  logger.info('WebSocket server initialized')

  return io
}

/**
 * Get Socket.IO instance
 */
const getIO = () => {
  if (!io) {
    throw new Error('WebSocket not initialized')
  }
  return io
}

/**
 * Get collaboration handler
 */
const getCollaborationHandler = () => {
  if (!collaborationHandler) {
    throw new Error('Collaboration handler not initialized')
  }
  return collaborationHandler
}

/**
 * Broadcast data update
 */
const broadcastDataUpdate = (companyId, data) => {
  if (collaborationHandler) {
    collaborationHandler.broadcastDataUpdate(companyId, data)
  }
}

module.exports = {
  initializeWebSocket,
  getIO,
  getCollaborationHandler,
  broadcastDataUpdate
}
