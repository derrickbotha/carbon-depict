import clsx from 'clsx'
import { TrendingUp, TrendingDown, Minus } from '@atoms/Icon'

/**
 * MetricCard - Display KPI with value, label, and trend
 * Used extensively in dashboard for emissions data
 */
export default function MetricCard({
  label,
  value,
  unit,
  trend, // { value: number, direction: 'up' | 'down' | 'neutral' }
  sparklineData = [], // Optional: array of numbers for mini chart
  className = '',
  loading = false,
}) {
  const TrendIcon = trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus

  const trendColor = {
    up: trend?.positive ? 'text-cd-success' : 'text-cd-error',
    down: trend?.positive ? 'text-cd-error' : 'text-cd-success',
    neutral: 'text-cd-muted',
  }

  return (
    <div
      className={clsx(
        'rounded-md bg-white p-6 shadow-cd-sm',
        'border-l-4 border-cd-midnight',
        'transition-shadow hover:shadow-cd-md',
        className
      )}
    >
      {/* Label */}
      <p className="mb-2 text-sm font-medium uppercase tracking-wide text-cd-muted">
        {label}
      </p>

      {/* Value */}
      <div className="mb-3 flex items-baseline gap-2">
        {loading ? (
          <div className="h-10 w-32 animate-pulse rounded bg-cd-surface" />
        ) : (
          <>
            <p className="text-3xl font-bold text-cd-text" aria-label={`${value} ${unit}`}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {unit && <span className="text-lg text-cd-muted">{unit}</span>}
          </>
        )}
      </div>

      {/* Trend */}
      {trend && !loading && (
        <div className="flex items-center gap-2">
          <div
            className={clsx(
              'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
              trend.direction === 'up' && (trend.positive ? 'bg-cd-mint/20' : 'bg-red-50'),
              trend.direction === 'down' && (trend.positive ? 'bg-red-50' : 'bg-cd-mint/20'),
              trend.direction === 'neutral' && 'bg-cd-surface'
            )}
          >
            <TrendIcon className={clsx('h-3 w-3', trendColor[trend.direction])} />
            <span className={trendColor[trend.direction]}>
              {Math.abs(trend.value)}%
            </span>
          </div>
          {trend.label && <span className="text-xs text-cd-muted">{trend.label}</span>}
        </div>
      )}

      {/* Optional Sparkline */}
      {sparklineData.length > 0 && (
        <div className="mt-4 h-8">
          <svg
            className="h-full w-full"
            viewBox={`0 0 ${sparklineData.length * 10} 40`}
            preserveAspectRatio="none"
          >
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-cd-teal"
              points={sparklineData
                .map((val, i) => {
                  const x = i * 10
                  const max = Math.max(...sparklineData)
                  const min = Math.min(...sparklineData)
                  const y = 35 - ((val - min) / (max - min)) * 30
                  return `${x},${y}`
                })
                .join(' ')}
            />
          </svg>
        </div>
      )}
    </div>
  )
}
