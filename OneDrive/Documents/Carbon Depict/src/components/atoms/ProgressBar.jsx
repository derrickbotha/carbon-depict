// Greenly Design System - ProgressBar Component
import clsx from 'clsx'

/**
 * ProgressBar - Greenly Design System
 * 8px height, gradient fills, warning/critical variants, optional milestones
 * 
 * @param {Object} props
 * @param {number} props.value - Current progress value (0-100)
 * @param {number} props.max - Maximum value (default: 100)
 * @param {'default' | 'warning' | 'critical'} props.variant - Visual variant
 * @param {Array} props.milestones - Optional milestone markers [{ value: number, label: string }]
 * @param {boolean} props.showLabel - Show percentage label (default: false)
 * @param {string} props.className - Additional CSS classes
 */
export default function ProgressBar({
  value = 0,
  max = 100,
  variant = 'default',
  milestones = [],
  showLabel = false,
  className = '',
}) {
  const percentage = Math.min((value / max) * 100, 100)

  const variantClass = {
    default: 'progress-bar',
    warning: 'progress-bar-warning',
    critical: 'progress-bar-critical',
  }

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-xs text-greenly-gray">Progress</span>
          <span className="text-xs font-medium text-greenly-charcoal">
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}

      <div className="relative">
        {/* Progress Bar */}
        <div className={variantClass[variant]}>
          <div
            className="progress-bar-fill transition-all duration-[350ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
          />
        </div>

        {/* Milestone Markers */}
        {milestones.length > 0 && (
          <div className="absolute inset-0">
            {milestones.map((milestone, idx) => {
              const milestonePosition = (milestone.value / max) * 100
              return (
                <div
                  key={idx}
                  className="absolute top-0 bottom-0 w-0.5 bg-greenly-charcoal/30"
                  style={{ left: `${milestonePosition}%` }}
                  title={milestone.label}
                >
                  {milestone.label && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-greenly-gray whitespace-nowrap">
                      {milestone.label}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * CircularProgress - Circular progress indicator
 * For compact displays or loading states
 */
export function CircularProgress({
  value = 0,
  max = 100,
  size = 80,
  strokeWidth = 8,
  variant = 'default',
  showLabel = true,
  className = '',
}) {
  const percentage = Math.min((value / max) * 100, 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const colorClass = {
    default: 'text-greenly-primary',
    warning: 'text-greenly-warning',
    critical: 'text-greenly-alert',
  }

  return (
    <div className={clsx('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-greenly-light"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={clsx(colorClass[variant], 'transition-all duration-[350ms]')}
        />
      </svg>
      {showLabel && (
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-greenly-charcoal">
          {percentage.toFixed(0)}%
        </span>
      )}
    </div>
  )
}
