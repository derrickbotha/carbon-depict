// Cache bust 2025-10-23
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
  secondaryMetrics = [], // Array of { label, value, unit }
  progress, // { current: number, target: number, status: 'on-track' | 'behind' | 'critical' }
  trend, // { value: number, direction: 'up' | 'down' | 'neutral', positive: boolean }
  actions, // Optional JSX for footer buttons
  className = '',
  loading = false,
}) {
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
    <div
      className={clsx(
        'metric-card',
        className
      )}
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
    </div>
  )
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
