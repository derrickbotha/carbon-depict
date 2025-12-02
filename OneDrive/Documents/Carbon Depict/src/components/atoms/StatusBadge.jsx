// Greenly Design System - StatusBadge Component
import clsx from 'clsx'
import { CheckCircle, AlertCircle, XCircle, Info } from './Icon'

/**
 * StatusBadge - Greenly Design System
 * 28px height, 14px radius, status color variants
 * 
 * @param {Object} props
 * @param {'on-track' | 'behind' | 'critical' | 'info'} props.status - Badge status variant
 * @param {string} props.label - Badge text
 * @param {boolean} props.showIcon - Show status icon (default: true)
 * @param {string} props.className - Additional CSS classes
 */
export default function StatusBadge({ 
  status = 'info', 
  label, 
  showIcon = true, 
  className = '' 
}) {
  const statusConfig = {
    'on-track': {
      className: 'status-badge-on-track',
      icon: CheckCircle,
    },
    'behind': {
      className: 'status-badge-behind',
      icon: AlertCircle,
    },
    'critical': {
      className: 'status-badge-critical',
      icon: XCircle,
    },
    'info': {
      className: 'status-badge-info',
      icon: Info,
    },
  }

  const config = statusConfig[status] || statusConfig.info
  const Icon = config.icon

  return (
    <span
      className={clsx(
        config.className,
        'inline-flex items-center gap-1.5',
        className
      )}
    >
      {showIcon && <Icon className="h-4 w-4" strokeWidth={2} />}
      <span>{label}</span>
    </span>
  )
}

/**
 * StatusDot - Simple colored dot indicator
 */
export function StatusDot({ status = 'info', className = '' }) {
  const dotColors = {
    'on-track': 'bg-greenly-success',
    'behind': 'bg-greenly-warning',
    'critical': 'bg-greenly-alert',
    'info': 'bg-greenly-info',
  }

  return (
    <span
      className={clsx(
        'inline-block h-2.5 w-2.5 rounded-full',
        dotColors[status] || dotColors.info,
        className
      )}
      aria-label={status}
    />
  )
}
