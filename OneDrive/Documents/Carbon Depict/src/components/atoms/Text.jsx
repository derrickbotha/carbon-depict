/**
 * Text Component - Phase 3 Week 12: Component Architecture
 *
 * Performance-optimized text component with:
 * - Memoization for static content
 * - Polymorphic as prop
 * - Type-safe variants
 * - Semantic HTML support
 */
import { memo } from 'react'
import clsx from 'clsx'

const TEXT_VARIANTS = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-semibold',
  h5: 'text-lg font-semibold',
  h6: 'text-base font-semibold',
  body: 'text-base',
  bodyLarge: 'text-lg',
  bodySmall: 'text-sm',
  caption: 'text-xs',
  label: 'text-sm font-medium',
  metric: 'text-3xl font-mono font-bold',
  metricLarge: 'text-4xl font-mono font-bold'
}

const TEXT_COLORS = {
  primary: 'text-greenly-charcoal',
  secondary: 'text-greenly-gray',
  success: 'text-greenly-success',
  warning: 'text-greenly-warning',
  error: 'text-greenly-alert',
  muted: 'text-greenly-gray/70',
  white: 'text-white'
}

const TEXT_WEIGHTS = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold'
}

/**
 * Text Component
 */
export const Text = memo(({
  as: Component = 'p',
  variant = 'body',
  color = 'primary',
  weight,
  align,
  truncate = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <Component
      className={clsx(
        TEXT_VARIANTS[variant],
        TEXT_COLORS[color],
        weight && TEXT_WEIGHTS[weight],
        align && `text-${align}`,
        truncate && 'truncate',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
})

Text.displayName = 'Text'

/**
 * Heading Components (Memoized)
 */
export const H1 = memo(({ children, ...props }) => (
  <Text as="h1" variant="h1" {...props}>{children}</Text>
))
H1.displayName = 'H1'

export const H2 = memo(({ children, ...props }) => (
  <Text as="h2" variant="h2" {...props}>{children}</Text>
))
H2.displayName = 'H2'

export const H3 = memo(({ children, ...props }) => (
  <Text as="h3" variant="h3" {...props}>{children}</Text>
))
H3.displayName = 'H3'

export const H4 = memo(({ children, ...props }) => (
  <Text as="h4" variant="h4" {...props}>{children}</Text>
))
H4.displayName = 'H4'

/**
 * Body Text Components
 */
export const Body = memo(({ children, ...props }) => (
  <Text variant="body" {...props}>{children}</Text>
))
Body.displayName = 'Body'

export const BodyLarge = memo(({ children, ...props }) => (
  <Text variant="bodyLarge" {...props}>{children}</Text>
))
BodyLarge.displayName = 'BodyLarge'

export const BodySmall = memo(({ children, ...props }) => (
  <Text variant="bodySmall" {...props}>{children}</Text>
))
BodySmall.displayName = 'BodySmall'

export const Caption = memo(({ children, ...props }) => (
  <Text variant="caption" {...props}>{children}</Text>
))
Caption.displayName = 'Caption'

export const Label = memo(({ children, ...props }) => (
  <Text as="label" variant="label" {...props}>{children}</Text>
))
Label.displayName = 'Label'

/**
 * Metric Text (for large numbers)
 */
export const Metric = memo(({ children, ...props }) => (
  <Text variant="metric" {...props}>{children}</Text>
))
Metric.displayName = 'Metric'

export const MetricLarge = memo(({ children, ...props }) => (
  <Text variant="metricLarge" {...props}>{children}</Text>
))
MetricLarge.displayName = 'MetricLarge'

export default Text
