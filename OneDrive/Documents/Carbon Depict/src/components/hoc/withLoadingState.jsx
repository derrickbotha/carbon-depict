/**
 * withLoadingState HOC - Phase 3 Week 12: Component Architecture
 *
 * Higher-Order Component for adding loading states to components
 */
import { memo } from 'react'

/**
 * HOC that adds loading state handling to a component
 *
 * @param {Component} Component - Component to wrap
 * @param {Object} options - Configuration options
 * @returns {Component} Enhanced component with loading state
 */
export const withLoadingState = (Component, options = {}) => {
  const {
    LoadingComponent = DefaultLoadingComponent,
    loadingProp = 'loading',
    errorProp = 'error',
    ErrorComponent = DefaultErrorComponent
  } = options

  const WithLoadingState = memo((props) => {
    const isLoading = props[loadingProp]
    const error = props[errorProp]

    // Show error state
    if (error && ErrorComponent) {
      return <ErrorComponent error={error} {...props} />
    }

    // Show loading state
    if (isLoading && LoadingComponent) {
      return <LoadingComponent {...props} />
    }

    // Render actual component
    return <Component {...props} />
  })

  WithLoadingState.displayName = `withLoadingState(${Component.displayName || Component.name || 'Component'})`

  return WithLoadingState
}

/**
 * Default Loading Component
 */
const DefaultLoadingComponent = () => (
  <div className="flex items-center justify-center p-8">
    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-greenly-primary border-r-transparent" />
  </div>
)

/**
 * Default Error Component
 */
const DefaultErrorComponent = ({ error }) => (
  <div className="p-8 text-center">
    <div className="text-greenly-alert mb-2">
      <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>
    <p className="text-sm text-greenly-gray">{error?.message || 'An error occurred'}</p>
  </div>
)

export default withLoadingState
