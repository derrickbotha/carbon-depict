/**
 * Toast Notifications Hook - Phase 3 Week 11: Frontend State Management
 *
 * Custom hook for displaying toast notifications with:
 * - Multiple types (success, error, warning, info)
 * - Auto-dismiss
 * - Queue management
 * - Custom durations
 */
import { useState, useCallback, useRef, useEffect } from 'react'

let toastId = 0

export const useToast = () => {
  const [toasts, setToasts] = useState([])
  const timeouts = useRef({})

  /**
   * Add a new toast
   */
  const addToast = useCallback((message, options = {}) => {
    const {
      type = 'info',
      duration = 5000,
      dismissible = true,
      position = 'top-right',
      action = null
    } = options

    const id = toastId++

    const toast = {
      id,
      message,
      type,
      dismissible,
      position,
      action,
      createdAt: Date.now()
    }

    setToasts(prev => [...prev, toast])

    // Auto-dismiss after duration
    if (duration > 0) {
      timeouts.current[id] = setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }, [])

  /**
   * Remove a toast
   */
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))

    // Clear timeout if it exists
    if (timeouts.current[id]) {
      clearTimeout(timeouts.current[id])
      delete timeouts.current[id]
    }
  }, [])

  /**
   * Remove all toasts
   */
  const clearToasts = useCallback(() => {
    setToasts([])

    // Clear all timeouts
    Object.values(timeouts.current).forEach(clearTimeout)
    timeouts.current = {}
  }, [])

  /**
   * Show success toast
   */
  const success = useCallback((message, options = {}) => {
    return addToast(message, { ...options, type: 'success' })
  }, [addToast])

  /**
   * Show error toast
   */
  const error = useCallback((message, options = {}) => {
    return addToast(message, { ...options, type: 'error', duration: 7000 })
  }, [addToast])

  /**
   * Show warning toast
   */
  const warning = useCallback((message, options = {}) => {
    return addToast(message, { ...options, type: 'warning' })
  }, [addToast])

  /**
   * Show info toast
   */
  const info = useCallback((message, options = {}) => {
    return addToast(message, { ...options, type: 'info' })
  }, [addToast])

  /**
   * Show loading toast
   */
  const loading = useCallback((message, options = {}) => {
    return addToast(message, {
      ...options,
      type: 'loading',
      duration: 0,
      dismissible: false
    })
  }, [addToast])

  /**
   * Update existing toast
   */
  const updateToast = useCallback((id, updates) => {
    setToasts(prev =>
      prev.map(toast =>
        toast.id === id ? { ...toast, ...updates } : toast
      )
    )
  }, [])

  /**
   * Promise-based toast
   */
  const promise = useCallback(async (promise, messages = {}) => {
    const {
      loading: loadingMsg = 'Loading...',
      success: successMsg = 'Success!',
      error: errorMsg = 'Error occurred'
    } = messages

    const toastId = loading(loadingMsg)

    try {
      const result = await promise
      removeToast(toastId)
      success(typeof successMsg === 'function' ? successMsg(result) : successMsg)
      return result
    } catch (err) {
      removeToast(toastId)
      error(typeof errorMsg === 'function' ? errorMsg(err) : errorMsg)
      throw err
    }
  }, [loading, success, error, removeToast])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(timeouts.current).forEach(clearTimeout)
    }
  }, [])

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    updateToast,
    success,
    error,
    warning,
    info,
    loading,
    promise
  }
}

export default useToast
