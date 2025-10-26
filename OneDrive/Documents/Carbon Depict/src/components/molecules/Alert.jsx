// Cache bust 2025-10-23
import clsx from 'clsx'
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from '@atoms/Icon'

/**
 * Alert - Display contextual feedback messages
 * Supports success, error, warning, info variants
 */
export default function Alert({
  type = 'info', // success, error, warning, info
  title,
  children,
  dismissible = false,
  onDismiss,
  className = '',
}) {
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
    <div
      role="alert"
      className={clsx(
        'relative rounded-md border p-4',
        styles[type].container,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={clsx('h-5 w-5 flex-shrink-0', styles[type].icon)} aria-hidden="true" />
        <div className="flex-1">
          {title && <p className="mb-1 font-semibold">{title}</p>}
          <div className="text-sm">{children}</div>
        </div>
        {dismissible && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 text-current opacity-60 transition-opacity hover:opacity-100"
            aria-label="Dismiss alert"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}

