/**
 * MetricCard Component - Carbon Depict UI Library
 *
 * Performance metrics card following Greenly Design System
 *
 * Features:
 * - PropTypes validation
 * - Framer Motion hover animations
 * - Loading state with skeleton
 * - Progress visualization
 * - Trend indicators
 * - Secondary metrics
 * - 280px min-height, large Roboto Mono metrics
 */
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { TrendingUp, TrendingDown, Minus } from '@atoms/Icon'

/**
 * MetricCard - Greenly Design System
 * 280px min-height, header with title/subtitle, large Roboto Mono metrics,
 * progress visualization, footer actions
 */
export default function MetricCard({
  title,
  subtitle,
  value,
  unit,
  secondaryMetrics = [],
  progress,
  trend,
  actions,
  className = '',
  loading = false,
  onClick,
}) {
  const isInteractive = !!onClick
  const TrendIcon = trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus

  const trendColor = {
    up: trend?.positive ? 'text-greenly-success' : 'text-greenly-alert',
    down: trend?.positive ? 'text-greenly-alert' : 'text-greenly-success',
    neutral: 'text-greenly-gray',
  }

  const progressPercentage = progress ? Math.min((progress.current / progress.target) * 100, 100) : 0
  
  const progressVariant = progress?.status === 'critical' ? 'progress-bar-critical' :
                         progress?.status === 'behind' ? 'progress-bar-warning' : 
                         'progress-bar'

  return (
    <motion.div
      onClick={onClick}
      className={clsx(
        'metric-card',
        isInteractive && 'cursor-pointer',
        className
      )}
      whileHover={!loading ? { y: -4, scale: 1.02 } : undefined}
      whileTap={isInteractive && !loading ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-greenly-charcoal mb-1">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-greenly-gray">
            {subtitle}
          </p>
        )}
      </div>

      {/* Primary Metric */}
      <div className="mb-6">
        {loading ? (
          <div className="h-12 w-48 animate-skeleton rounded bg-greenly-light" />
        ) : (
          <div className="flex items-baseline gap-2">
            <p className="text-metric-large font-mono text-greenly-charcoal" aria-label={`${value} ${unit}`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {unit && (
              <span className="text-lg text-greenly-gray font-medium">
                {unit}
              </span>
            )}
          </div>
        )}

        {/* Trend Indicator */}
        {trend && !loading && (
          <div className="flex items-center gap-2 mt-2">
            <div
              className={clsx(
                'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                trend.direction === 'up' && (trend.positive ? 'bg-greenly-success/10 text-greenly-success' : 'bg-greenly-alert/10 text-greenly-alert'),
                trend.direction === 'down' && (trend.positive ? 'bg-greenly-alert/10 text-greenly-alert' : 'bg-greenly-success/10 text-greenly-success'),
                trend.direction === 'neutral' && 'bg-greenly-light text-greenly-gray'
              )}
            >
              <TrendIcon className="h-3.5 w-3.5" />
              <span>
                {Math.abs(trend.value)}%
              </span>
            </div>
            {trend.label && (
              <span className="text-xs text-greenly-gray">
                {trend.label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Secondary Metrics Row */}
      {secondaryMetrics.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {secondaryMetrics.map((metric, idx) => (
            <div key={idx}>
              <p className="text-metric-label text-greenly-gray mb-1">
                {metric.label}
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-mono font-semibold text-greenly-charcoal">
                  {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                </span>
                {metric.unit && (
                  <span className="text-sm text-greenly-gray">
                    {metric.unit}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {progress && !loading && (
        <div className="mb-6">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xs text-greenly-gray">
              Progress to Target
            </span>
            <span className="text-xs font-medium text-greenly-charcoal">
              {progress.current.toLocaleString()} / {progress.target.toLocaleString()}
            </span>
          </div>
          <div className={progressVariant}>
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer Actions */}
      {actions && (
        <div className="mt-auto pt-4 border-t border-greenly-light flex gap-2">
          {actions}
        </div>
      )}
    </motion.div>
  )
}

MetricCard.propTypes = {
  /** Card title */
  title: PropTypes.string.isRequired,
  /** Card subtitle/description */
  subtitle: PropTypes.string,
  /** Primary metric value */
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /** Unit of measurement */
  unit: PropTypes.string,
  /** Array of secondary metrics { label, value, unit } */
  secondaryMetrics: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      unit: PropTypes.string,
    })
  ),
  /** Progress data { current, target, status: 'on-track' | 'behind' | 'critical' } */
  progress: PropTypes.shape({
    current: PropTypes.number.isRequired,
    target: PropTypes.number.isRequired,
    status: PropTypes.oneOf(['on-track', 'behind', 'critical']),
  }),
  /** Trend data { value, direction: 'up' | 'down' | 'neutral', positive, label? } */
  trend: PropTypes.shape({
    value: PropTypes.number.isRequired,
    direction: PropTypes.oneOf(['up', 'down', 'neutral']).isRequired,
    positive: PropTypes.bool.isRequired,
    label: PropTypes.string,
  }),
  /** Footer action buttons (JSX) */
  actions: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Loading state - shows skeleton */
  loading: PropTypes.bool,
  /** Click handler (makes card interactive) */
  onClick: PropTypes.func,
}

/**
 * MetricCardGrid - Container for metric cards with proper spacing
 */
export function MetricCardGrid({ children, columns = 3, className = '' }) {
  return (
    <div
      className={clsx(
        'grid gap-6',
        columns === 2 && 'grid-cols-1 md:grid-cols-2',
        columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {children}
    </div>
  )
}

MetricCardGrid.propTypes = {
  /** MetricCard components */
  children: PropTypes.node.isRequired,
  /** Number of columns (2, 3, or 4) */
  columns: PropTypes.oneOf([2, 3, 4]),
  /** Additional CSS classes */
  className: PropTypes.string,
}
