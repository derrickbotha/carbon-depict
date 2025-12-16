/**
 * App State Context - Phase 3 Week 11: Frontend State Management
 *
 * Global application state management for:
 * - UI preferences (theme, sidebar, etc.)
 * - Notifications and toasts
 * - Loading states
 * - Network status
 * - Global modals
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { apiClient } from '../utils/api'

const AppStateContext = createContext(null)

export const useAppState = () => {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider')
  }
  return context
}

export const AppStateProvider = ({ children }) => {
  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen')
    return saved !== null ? JSON.parse(saved) : true
  })

  // Theme State
  // Supports: 'light', 'dark', 'system'
  const [themePreference, setThemePreference] = useState(() => {
    return localStorage.getItem('themePreference') || 'system'
  })

  const [effectiveTheme, setEffectiveTheme] = useState(() => {
    const preference = localStorage.getItem('themePreference') || 'system'
    if (preference === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return preference
  })

  // Keep legacy 'theme' for backward compatibility
  const theme = effectiveTheme

  // Notifications
  const [notifications, setNotifications] = useState([])
  const [notificationsLoaded, setNotificationsLoaded] = useState(false)
  const [toasts, setToasts] = useState([])

  // Loading States
  const [globalLoading, setGlobalLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')

  // Network Status
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // Modal State
  const [modals, setModals] = useState({})

  /**
   * Toggle sidebar
   */
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => {
      const newState = !prev
      localStorage.setItem('sidebarOpen', JSON.stringify(newState))
      return newState
    })
  }, [])

  /**
   * Set sidebar state
   */
  const setSidebar = useCallback((open) => {
    setSidebarOpen(open)
    localStorage.setItem('sidebarOpen', JSON.stringify(open))
  }, [])

  /**
   * Toggle theme (cycles through light -> dark -> system)
   */
  const toggleTheme = useCallback(() => {
    setThemePreference(prev => {
      let newPreference
      if (prev === 'light') {
        newPreference = 'dark'
      } else if (prev === 'dark') {
        newPreference = 'system'
      } else {
        newPreference = 'light'
      }

      localStorage.setItem('themePreference', newPreference)

      // Calculate effective theme
      let newEffective = newPreference
      if (newPreference === 'system') {
        newEffective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }

      setEffectiveTheme(newEffective)
      document.documentElement.setAttribute('data-theme', newEffective)
      return newPreference
    })
  }, [])

  /**
   * Set theme preference
   * @param {string} newPreference - 'light', 'dark', or 'system'
   */
  const setAppTheme = useCallback((newPreference) => {
    if (!['light', 'dark', 'system'].includes(newPreference)) {
      console.warn(`Invalid theme preference: ${newPreference}. Must be 'light', 'dark', or 'system'.`)
      return
    }

    setThemePreference(newPreference)
    localStorage.setItem('themePreference', newPreference)

    // Calculate effective theme
    let newEffective = newPreference
    if (newPreference === 'system') {
      newEffective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    setEffectiveTheme(newEffective)
    document.documentElement.setAttribute('data-theme', newEffective)
  }, [])

  /**
   * Load notifications from database
   */
  const loadNotifications = useCallback(async () => {
    try {
      const response = await apiClient.get('/api/notifications')
      if (response.data?.success) {
        const dbNotifications = response.data.data.map(notif => ({
          id: notif._id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          timestamp: new Date(notif.createdAt),
          read: notif.read,
          metadata: notif.metadata
        }))
        setNotifications(dbNotifications)
        setNotificationsLoaded(true)
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
      setNotificationsLoaded(true)
    }
  }, [])

  /**
   * Add notification (also saves to database)
   */
  const addNotification = useCallback(async (notification) => {
    const tempId = `notification_${Date.now()}_${Math.random()}`
    const newNotification = {
      id: tempId,
      timestamp: new Date(),
      read: false,
      ...notification
    }

    // Optimistically update UI
    setNotifications(prev => [newNotification, ...prev])

    // Save to database (if this is a client-side notification)
    // Server-side notifications are created via API directly

    return tempId
  }, [])

  /**
   * Mark notification as read (also updates database)
   */
  const markNotificationRead = useCallback(async (id) => {
    // Optimistically update UI
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )

    // Update database
    try {
      await apiClient.put(`/api/notifications/${id}/read`)
    } catch (error) {
      console.error('Error marking notification as read:', error)
      // Revert on error
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, read: false } : notif
        )
      )
    }
  }, [])

  /**
   * Mark all notifications as read (also updates database)
   */
  const markAllNotificationsRead = useCallback(async () => {
    // Optimistically update UI
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )

    // Update database
    try {
      await apiClient.put('/api/notifications/read-all')
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      // Reload from database on error
      loadNotifications()
    }
  }, [loadNotifications])

  /**
   * Remove notification (also deletes from database)
   */
  const removeNotification = useCallback(async (id) => {
    // Optimistically update UI
    const prevNotifications = notifications
    setNotifications(prev => prev.filter(notif => notif.id !== id))

    // Delete from database
    try {
      await apiClient.delete(`/api/notifications/${id}`)
    } catch (error) {
      console.error('Error removing notification:', error)
      // Revert on error
      setNotifications(prevNotifications)
    }
  }, [notifications])

  /**
   * Clear all notifications (also deletes from database)
   */
  const clearNotifications = useCallback(async () => {
    // Optimistically update UI
    const prevNotifications = notifications
    setNotifications([])

    // Delete from database
    try {
      await apiClient.delete('/api/notifications')
    } catch (error) {
      console.error('Error clearing notifications:', error)
      // Revert on error
      setNotifications(prevNotifications)
    }
  }, [notifications])

  /**
   * Show toast notification
   */
  const showToast = useCallback((toast) => {
    const id = `toast_${Date.now()}_${Math.random()}`
    const newToast = {
      id,
      type: 'info',
      duration: 3000,
      ...toast
    }

    setToasts(prev => [...prev, newToast])

    // Auto-remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }, [])

  /**
   * Remove toast
   */
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  /**
   * Clear all toasts
   */
  const clearToasts = useCallback(() => {
    setToasts([])
  }, [])

  /**
   * Show success toast
   */
  const showSuccess = useCallback((message, options = {}) => {
    return showToast({
      type: 'success',
      message,
      ...options
    })
  }, [showToast])

  /**
   * Show error toast
   */
  const showError = useCallback((message, options = {}) => {
    return showToast({
      type: 'error',
      message,
      duration: 5000, // Errors show longer
      ...options
    })
  }, [showToast])

  /**
   * Show warning toast
   */
  const showWarning = useCallback((message, options = {}) => {
    return showToast({
      type: 'warning',
      message,
      ...options
    })
  }, [showToast])

  /**
   * Show info toast
   */
  const showInfo = useCallback((message, options = {}) => {
    return showToast({
      type: 'info',
      message,
      ...options
    })
  }, [showToast])

  /**
   * Set global loading state
   */
  const setLoading = useCallback((loading, message = '') => {
    setGlobalLoading(loading)
    setLoadingMessage(message)
  }, [])

  /**
   * Open modal
   */
  const openModal = useCallback((modalId, data = null) => {
    setModals(prev => ({
      ...prev,
      [modalId]: { open: true, data }
    }))
  }, [])

  /**
   * Close modal
   */
  const closeModal = useCallback((modalId) => {
    setModals(prev => ({
      ...prev,
      [modalId]: { open: false, data: null }
    }))
  }, [])

  /**
   * Close all modals
   */
  const closeAllModals = useCallback(() => {
    setModals({})
  }, [])

  /**
   * Check if modal is open
   */
  const isModalOpen = useCallback((modalId) => {
    return modals[modalId]?.open || false
  }, [modals])

  /**
   * Get modal data
   */
  const getModalData = useCallback((modalId) => {
    return modals[modalId]?.data || null
  }, [modals])

  // Network status listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      showSuccess('Connection restored')
    }

    const handleOffline = () => {
      setIsOnline(false)
      showWarning('No internet connection', { duration: 0 }) // Persistent until online
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [showSuccess, showWarning])

  // Load notifications from database on mount
  useEffect(() => {
    loadNotifications()

    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [loadNotifications])

  // Initialize theme and listen for system theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', effectiveTheme)

    // Listen for system theme changes when preference is 'system'
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleSystemThemeChange = (e) => {
      if (themePreference === 'system') {
        const newEffective = e.matches ? 'dark' : 'light'
        setEffectiveTheme(newEffective)
        document.documentElement.setAttribute('data-theme', newEffective)
      }
    }

    // Modern browsers support addEventListener on MediaQueryList
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange)
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleSystemThemeChange)
      return () => mediaQuery.removeListener(handleSystemThemeChange)
    }
  }, [effectiveTheme, themePreference])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Cmd/Ctrl + K to toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggleSidebar()
      }

      // Escape to close all modals
      if (e.key === 'Escape') {
        const hasOpenModals = Object.values(modals).some(m => m.open)
        if (hasOpenModals) {
          e.preventDefault()
          closeAllModals()
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [toggleSidebar, modals, closeAllModals])

  const value = {
    // UI State
    sidebarOpen,
    toggleSidebar,
    setSidebar,

    // Theme State
    theme,                    // Effective theme (light or dark) - for backward compatibility
    themePreference,          // User preference (light, dark, or system)
    effectiveTheme,           // Currently applied theme (light or dark)
    toggleTheme,              // Cycles through light -> dark -> system
    setAppTheme,              // Set theme preference directly

    // Notifications
    notifications,
    notificationsLoaded,
    unreadCount: notifications.filter(n => !n.read).length,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    removeNotification,
    clearNotifications,
    loadNotifications,

    // Toasts
    toasts,
    showToast,
    removeToast,
    clearToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,

    // Loading
    globalLoading,
    loadingMessage,
    setLoading,

    // Network
    isOnline,
    isOffline: !isOnline,

    // Modals
    modals,
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen,
    getModalData,
  }

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export default AppStateContext
