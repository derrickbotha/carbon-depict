/**
 * NotificationPanel - Notification dropdown component
 *
 * Displays real-time notifications from the system including:
 * - Data approval/rejection notifications
 * - System announcements
 * - Manager communications
 * - Activity updates
 */
import { useState, useEffect, useRef } from 'react'
import { Bell, Check, X, AlertCircle, Info, CheckCircle, XCircle, MessageSquare, Clock } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import { formatDistance } from 'date-fns'
import clsx from 'clsx'

const NotificationIcon = ({ type }) => {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-greenly-success" />,
    error: <XCircle className="h-5 w-5 text-greenly-alert" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    message: <MessageSquare className="h-5 w-5 text-greenly-primary" />,
    approval: <CheckCircle className="h-5 w-5 text-green-600" />,
    rejection: <XCircle className="h-5 w-5 text-red-600" />,
  }
  return icons[type] || icons.info
}

const NotificationItem = ({ notification, onMarkRead, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const formattedTime = notification.timestamp
    ? formatDistance(new Date(notification.timestamp), new Date(), { addSuffix: true })
    : ''

  return (
    <div
      className={clsx(
        'px-4 py-3 border-b border-greenly-light hover:bg-greenly-off-white transition-colors cursor-pointer',
        !notification.read && 'bg-blue-50/50'
      )}
      onClick={() => {
        setIsExpanded(!isExpanded)
        if (!notification.read) {
          onMarkRead(notification.id)
        }
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <NotificationIcon type={notification.type} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              {notification.title && (
                <p className="text-sm font-semibold text-greenly-midnight">
                  {notification.title}
                </p>
              )}
              <p className={clsx(
                "text-sm text-greenly-slate",
                isExpanded ? "" : "line-clamp-2"
              )}>
                {notification.message}
              </p>

              {isExpanded && notification.metadata && (
                <div className="mt-2 p-2 bg-greenly-off-white rounded-lg border border-greenly-light">
                  {notification.metadata.reason && (
                    <p className="text-xs text-greenly-slate">
                      <span className="font-semibold">Reason:</span> {notification.metadata.reason}
                    </p>
                  )}
                  {notification.metadata.entryType && (
                    <p className="text-xs text-greenly-slate mt-1">
                      <span className="font-semibold">Entry Type:</span> {notification.metadata.entryType}
                    </p>
                  )}
                  {notification.metadata.action && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (notification.metadata.action.onClick) {
                          notification.metadata.action.onClick()
                        }
                      }}
                      className="mt-2 text-xs font-semibold text-greenly-primary hover:underline"
                    >
                      {notification.metadata.action.label || 'View Details'}
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onRemove(notification.id)
              }}
              className="flex-shrink-0 text-greenly-gray hover:text-greenly-midnight transition-colors"
              aria-label="Remove notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Clock className="h-3 w-3 text-greenly-gray" />
            <span className="text-xs text-greenly-gray">{formattedTime}</span>
            {!notification.read && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
                New
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef(null)

  const {
    notifications,
    notificationsLoaded,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    removeNotification,
    clearNotifications,
  } = useAppState()

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-greenly-light transition-colors"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-greenly-midnight" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-greenly-alert text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-greenly-lg border border-greenly-light z-50 max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-greenly-light flex items-center justify-between bg-greenly-midnight text-white rounded-t-lg">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-greenly-alert text-white text-xs font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="text-xs font-medium text-greenly-mint hover:text-white transition-colors"
                  title="Mark all as read"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="text-xs font-medium text-greenly-mint hover:text-white transition-colors"
                  title="Clear all"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {!notificationsLoaded ? (
              <div className="px-4 py-12 text-center">
                <div className="h-8 w-8 border-2 border-greenly-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-greenly-gray">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <Bell className="h-12 w-12 text-greenly-gray mx-auto mb-3" />
                <p className="text-sm text-greenly-gray font-medium">No notifications</p>
                <p className="text-xs text-greenly-slate mt-1">
                  You're all caught up!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-greenly-light">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkRead={markNotificationRead}
                    onRemove={removeNotification}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-greenly-light bg-greenly-off-white rounded-b-lg">
              <button
                onClick={() => {
                  clearNotifications()
                  setIsOpen(false)
                }}
                className="text-sm font-medium text-greenly-primary hover:text-greenly-midnight transition-colors"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
