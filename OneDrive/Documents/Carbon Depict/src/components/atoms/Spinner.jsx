/**
 * Spinner Component - Carbon Depict UI Library
 *
 * Accessible loading spinner component following Greenly Design System
 *
 * Features:
 * - PropTypes validation
 * - Multiple size variants
 * - Color customization
 * - Accessible (aria-label, role)
 * - Respects prefers-reduced-motion
 */
import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

/**
 * Spinner - Loading indicator
 * Shows a rotating circular spinner for loading states
 */
export const Spinner = ({
  size = 'md',
  color = 'primary',
  label = 'Loading...',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  }

  const colorClasses = {
    primary: 'text-greenly-primary',
    secondary: 'text-greenly-charcoal',
    white: 'text-white',
    current: 'text-current',
  }

  return (
    <svg
      className={clsx(
        'animate-spin',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label={label}
      aria-live="polite"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
      <title>{label}</title>
    </svg>
  )
}

Spinner.propTypes = {
  /** Size of the spinner */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Color variant */
  color: PropTypes.oneOf(['primary', 'secondary', 'white', 'current']),
  /** Accessible label for screen readers */
  label: PropTypes.string,
  /** Additional CSS classes */
  className: PropTypes.string,
}

/**
 * FullPageSpinner - Centered spinner for full-page loading states
 */
export const FullPageSpinner = ({
  size = 'lg',
  color = 'primary',
  label = 'Loading...',
  message,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
      <Spinner size={size} color={color} label={label} />
      {message && (
        <p className="mt-4 text-sm text-greenly-gray">{message}</p>
      )}
    </div>
  )
}

FullPageSpinner.propTypes = {
  /** Size of the spinner */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Color variant */
  color: PropTypes.oneOf(['primary', 'secondary', 'white', 'current']),
  /** Accessible label for screen readers */
  label: PropTypes.string,
  /** Optional loading message to display below spinner */
  message: PropTypes.string,
}

export default Spinner
