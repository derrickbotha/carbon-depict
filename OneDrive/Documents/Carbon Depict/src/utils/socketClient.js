/**
 * Socket.IO Client
 * WebSocket connection for real-time updates
 */

import { io } from 'socket.io-client';

let socket = null;
let isConnected = false;

/**
 * Initialize Socket.IO connection
 */
export const initializeSocket = () => {
  if (socket) {
    return socket;
  }

  const token = localStorage.getItem('token');

  if (!token) {
    console.warn('⚠️ Cannot initialize WebSocket: No authentication token found');
    return null;
  }

  socket = io('http://localhost:5500', {
    auth: {
      token
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  });

  socket.on('connect', () => {
    isConnected = true;
    console.log('✅ WebSocket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    isConnected = false;
    console.log('❌ WebSocket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
  });

  socket.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  return socket;
};

/**
 * Get Socket.IO instance
 */
export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

/**
 * Check if connected
 */
export const isSocketConnected = () => {
  return isConnected && socket?.connected;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnected = false;
  }
};
/**
 * Emit event
 */
export const emitEvent = (event, data) => {
  const socketInstance = getSocket();
  if (isSocketConnected()) {
    socketInstance.emit(event, data);
  } else {
    console.warn('Socket not connected, cannot emit event:', event);
  }
};

export default {
  initializeSocket,
  getSocket,
  isSocketConnected,
  disconnectSocket,
  subscribeToEvent,
  emitEvent
};
