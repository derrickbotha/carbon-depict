/**
 * Alert Component - Carbon Depict UI Library
 *
 * Accessible alert component following Greenly Design System
 *
 * Features:
 * - PropTypes validation
 * - Framer Motion animations (slide-in/out)
 * - Auto-dismiss with configurable duration
 * - Multiple variants (success, error, warning, info)
 * - Dismissible with close button
 * - Fully accessible (ARIA attributes)
 */
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from '@atoms/Icon'

/**
 * Alert - Display contextual feedback messages
 * Supports success, error, warning, info variants
 */
export default function Alert({
  type = 'info',
  title,
  children,
  dismissible = false,
  onDismiss,
  autoDismiss = false,
  autoDismissDuration = 5000,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoDismiss && autoDismissDuration > 0) {
      const timer = setTimeout(() => {
        handleDismiss()
      }, autoDismissDuration)

      return () => clearTimeout(timer)
    }
  }, [autoDismiss, autoDismissDuration])

  const handleDismiss = () => {
    setIsVisible(false)
    // Wait for animation to complete before calling onDismiss
    setTimeout(() => {
      onDismiss?.()
    }, 200)
  }

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const Icon = icons[type]

  const styles = {
    success: {
      container: 'bg-cd-mint/10 border-cd-mint text-cd-midnight',
      icon: 'text-cd-success',
    },
    error: {
      container: 'bg-red-50 border-cd-error text-cd-error',
      icon: 'text-cd-error',
    },
    warning: {
      container: 'bg-orange-50 border-cd-warning text-cd-warning',
      icon: 'text-cd-warning',
    },
    info: {
      container: 'bg-blue-50 border-cd-info text-cd-info',
      icon: 'text-cd-info',
    },
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="alert"
          aria-live="polite"
          aria-atomic="true"
          className={clsx(
            'relative rounded-md border p-4',
            styles[type].container,
            className
          )}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <div className="flex items-start gap-3">
            <Icon className={clsx('h-5 w-5 flex-shrink-0', styles[type].icon)} aria-hidden="true" />
            <div className="flex-1">
              {title && <p className="mb-1 font-semibold">{title}</p>}
              <div className="text-sm">{children}</div>
            </div>
            {dismissible && (
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 text-current opacity-60 transition-opacity hover:opacity-100"
                aria-label="Dismiss alert"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          {autoDismiss && autoDismissDuration > 0 && (
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-current opacity-20 rounded-b-md"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: autoDismissDuration / 1000, ease: 'linear' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

Alert.propTypes = {
  /** Alert variant type */
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  /** Alert title */
  title: PropTypes.string,
  /** Alert message content */
  children: PropTypes.node.isRequired,
  /** Whether the alert can be dismissed */
  dismissible: PropTypes.bool,
  /** Callback fired when alert is dismissed */
  onDismiss: PropTypes.func,
  /** Enable auto-dismiss after duration */
  autoDismiss: PropTypes.bool,
  /** Auto-dismiss duration in milliseconds (default: 5000) */
  autoDismissDuration: PropTypes.number,
  /** Additional CSS classes */
  className: PropTypes.string,
}

