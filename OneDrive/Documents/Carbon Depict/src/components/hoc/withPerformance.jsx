/**
 * withPerformance HOC - Phase 3 Week 12: Component Architecture
 *
 * Higher-Order Component for performance optimization
 */
import { memo, Profiler } from 'react'

/**
 * HOC that adds performance monitoring and optimization
 *
 * @param {Component} Component - Component to wrap
 * @param {Object} options - Configuration options
 * @returns {Component} Performance-optimized component
 */
export const withPerformance = (Component, options = {}) => {
  const {
    memoize = true,
    profile = false,
    onRender = null,
    compareProps = null
  } = options

  let EnhancedComponent = Component

  // Apply memoization
  if (memoize) {
    EnhancedComponent = memo(Component, compareProps)
  }

  // Add profiling
  if (profile) {
    const ProfiledComponent = (props) => {
      const handleRender = (
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime
      ) => {
        if (onRender) {
          onRender({
            id,
            phase,
            actualDuration,
            baseDuration,
            startTime,
            commitTime
          })
        }

        // Log in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Profiler] ${id}:`, {
            phase,
            actualDuration: `${actualDuration.toFixed(2)}ms`,
            baseDuration: `${baseDuration.toFixed(2)}ms`
          })
        }
      }

      return (
        <Profiler
          id={Component.displayName || Component.name || 'Component'}
          onRender={handleRender}
        >
          <EnhancedComponent {...props} />
        </Profiler>
      )
    }

    ProfiledComponent.displayName = `withPerformance(${Component.displayName || Component.name || 'Component'})`

    return ProfiledComponent
  }

  EnhancedComponent.displayName = `withPerformance(${Component.displayName || Component.name || 'Component'})`

  return EnhancedComponent
}

/**
 * Custom comparison function for memo
 * Only re-render if specific props changed
 */
export const createPropsComparator = (propsToCompare) => {
  return (prevProps, nextProps) => {
    // If no specific props specified, use default comparison
    if (!propsToCompare || propsToCompare.length === 0) {
      return false
    }

    // Compare only specified props
    return propsToCompare.every(
      prop => prevProps[prop] === nextProps[prop]
    )
  }
}

/**
 * Shallow comparison for memo
 */
export const shallowCompare = (prevProps, nextProps) => {
  const prevKeys = Object.keys(prevProps)
  const nextKeys = Object.keys(nextProps)

  if (prevKeys.length !== nextKeys.length) {
    return false
  }

  return prevKeys.every(key => prevProps[key] === nextProps[key])
}

/**
 * Deep comparison for memo (use sparingly)
 */
export const deepCompare = (prevProps, nextProps) => {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps)
}

export default withPerformance
