/**
 * API Error Handler - Phase 3 Week 12: Frontend API Integration
 *
 * Centralized error handling for API requests with:
 * - Error classification
 * - User-friendly error messages
 * - Error logging
 * - Error recovery strategies
 */

/**
 * Error types
 */
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  SERVER: 'SERVER_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
}

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(message, type, statusCode, originalError = null, details = null) {
    super(message)
    this.name = 'APIError'
    this.type = type
    this.statusCode = statusCode
    this.originalError = originalError
    this.details = details
    this.timestamp = new Date().toISOString()

    // Maintains proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError)
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      statusCode: this.statusCode,
      details: this.details,
      timestamp: this.timestamp
    }
  }
}

/**
 * Classify error type based on error object
 */
export const classifyError = (error) => {
  // Network errors (no response)
  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return ErrorTypes.TIMEOUT
    }
    return ErrorTypes.NETWORK
  }

  // HTTP status code errors
  const status = error.response.status

  if (status === 400) return ErrorTypes.VALIDATION
  if (status === 401) return ErrorTypes.AUTHENTICATION
  if (status === 403) return ErrorTypes.AUTHORIZATION
  if (status === 404) return ErrorTypes.NOT_FOUND
  if (status === 429) return ErrorTypes.RATE_LIMIT
  if (status >= 500) return ErrorTypes.SERVER

  return ErrorTypes.UNKNOWN
}

/**
 * Get user-friendly error message
 */
export const getUserFriendlyMessage = (error, type) => {
  const messages = {
    [ErrorTypes.NETWORK]: 'Unable to connect to the server. Please check your internet connection.',
    [ErrorTypes.TIMEOUT]: 'The request took too long to complete. Please try again.',
    [ErrorTypes.VALIDATION]: error.response?.data?.message || 'The provided data is invalid. Please check your input.',
    [ErrorTypes.AUTHENTICATION]: 'Your session has expired. Please log in again.',
    [ErrorTypes.AUTHORIZATION]: 'You do not have permission to perform this action.',
    [ErrorTypes.NOT_FOUND]: 'The requested resource was not found.',
    [ErrorTypes.SERVER]: 'A server error occurred. Our team has been notified.',
    [ErrorTypes.RATE_LIMIT]: 'Too many requests. Please wait a moment and try again.',
    [ErrorTypes.UNKNOWN]: 'An unexpected error occurred. Please try again later.'
  }

  return messages[type] || messages[ErrorTypes.UNKNOWN]
}

/**
 * Extract error details from response
 */
export const extractErrorDetails = (error) => {
  if (!error.response) {
    return null
  }

  const data = error.response.data

  return {
    message: data?.message || data?.error,
    errors: data?.errors,
    code: data?.code,
    field: data?.field
  }
}

/**
 * Main error handler
 */
export const handleAPIError = (error, options = {}) => {
  const {
    showToast = true,
    logError = true,
    rethrow = true
  } = options

  // Classify the error
  const errorType = classifyError(error)

  // Extract details
  const details = extractErrorDetails(error)

  // Get user-friendly message
  const message = getUserFriendlyMessage(error, errorType)

  // Create custom error
  const apiError = new APIError(
    message,
    errorType,
    error.response?.status,
    error,
    details
  )

  // Log error
  if (logError) {
    logAPIError(apiError)
  }

  // Show toast notification
  if (showToast && window.showToast) {
    window.showToast(message, { type: 'error' })
  }

  // Rethrow if needed
  if (rethrow) {
    throw apiError
  }

  return apiError
}

/**
 * Log API error
 */
export const logAPIError = (error) => {
  // Log to console in development
  if (import.meta.env.MODE === 'development') {
    console.error('[API Error]', {
      type: error.type,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      timestamp: error.timestamp
    })

    if (error.originalError) {
      console.error('[Original Error]', error.originalError)
    }
  }

  // Send to error tracking service in production
  if (import.meta.env.MODE === 'production' && window.errorTracker) {
    window.errorTracker.captureException(error)
  }

  // Store in local error log
  try {
    const errorLog = JSON.parse(localStorage.getItem('apiErrorLog') || '[]')
    errorLog.push(error.toJSON())

    // Keep only last 50 errors
    if (errorLog.length > 50) {
      errorLog.shift()
    }

    localStorage.setItem('apiErrorLog', JSON.stringify(errorLog))
  } catch (e) {
    console.warn('Failed to store error log:', e)
  }
}

/**
 * Get error log
 */
export const getErrorLog = () => {
  try {
    return JSON.parse(localStorage.getItem('apiErrorLog') || '[]')
  } catch (e) {
    return []
  }
}

/**
 * Clear error log
 */
export const clearErrorLog = () => {
  localStorage.removeItem('apiErrorLog')
}

/**
 * Check if error is retryable
 */
export const isRetryableError = (error) => {
  const type = classifyError(error)

  return [
    ErrorTypes.NETWORK,
    ErrorTypes.TIMEOUT,
    ErrorTypes.RATE_LIMIT,
    ErrorTypes.SERVER
  ].includes(type)
}

/**
 * Handle validation errors
 */
export const handleValidationErrors = (error) => {
  const details = extractErrorDetails(error)

  if (!details?.errors) {
    return {}
  }

  // Convert errors array to field-error map
  const fieldErrors = {}

  if (Array.isArray(details.errors)) {
    details.errors.forEach(err => {
      if (err.field) {
        fieldErrors[err.field] = err.message
      }
    })
  } else if (typeof details.errors === 'object') {
    Object.assign(fieldErrors, details.errors)
  }

  return fieldErrors
}

/**
 * Create error boundary handler
 */
export const createErrorBoundaryHandler = (onError) => {
  return (error, errorInfo) => {
    const apiError = new APIError(
      error.message,
      ErrorTypes.UNKNOWN,
      null,
      error,
      errorInfo
    )

    logAPIError(apiError)

    if (onError) {
      onError(apiError)
    }
  }
}

export default {
  ErrorTypes,
  APIError,
  classifyError,
  getUserFriendlyMessage,
  extractErrorDetails,
  handleAPIError,
  logAPIError,
  getErrorLog,
  clearErrorLog,
  isRetryableError,
  handleValidationErrors,
  createErrorBoundaryHandler
}
