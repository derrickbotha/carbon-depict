/**
 * Error Handler Utility
 * Centralized error handling for the application
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

const globalErrorHandler = (err, req, res, next) => {
  console.error('🚨 Global Error Handler Caught:', err.stack)

  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  // Specific error handling for common errors
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      error: {
        message: `Invalid ID: ${err.value}`,
        status: 400,
        code: 'INVALID_ID'
      }
    })
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message)
    return res.status(400).json({
      error: {
        message: `Validation failed: ${errors.join(', ')}`,
        status: 400,
        code: 'VALIDATION_FAILED',
        details: errors
      }
    })
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: {
        message: 'Invalid token. Please log in again!',
        status: 401,
        code: 'INVALID_TOKEN'
      }
    })
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: {
        message: 'Your token has expired! Please log in again.',
        status: 401,
        code: 'TOKEN_EXPIRED'
      }
    })
  }

  // Generic error response
  res.status(statusCode).json({
    error: {
      message: message,
      status: statusCode,
      // Only send stack trace in development
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  })
}

module.exports = { AppError, globalErrorHandler }