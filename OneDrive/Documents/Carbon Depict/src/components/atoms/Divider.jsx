/**
 * Divider Component - Carbon Depict UI Library
 *
 * Accessible divider component following Greenly Design System
 *
 * Features:
 * - PropTypes validation
 * - Horizontal and vertical orientations
 * - Optional label/text
 * - Multiple spacing variants
 * - Accessible (role="separator")
 */
import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

/**
 * Divider - Visual separator between content sections
 */
export const Divider = ({
  orientation = 'horizontal',
  spacing = 'md',
  label,
  className = '',
  ...props
}) => {
  const spacingClasses = {
    horizontal: {
      xs: 'my-2',
      sm: 'my-4',
      md: 'my-6',
      lg: 'my-8',
      xl: 'my-12',
    },
    vertical: {
      xs: 'mx-2',
      sm: 'mx-4',
      md: 'mx-6',
      lg: 'mx-8',
      xl: 'mx-12',
    },
  }

  if (label && orientation === 'horizontal') {
    return (
      <div
        className={clsx(
          'relative flex items-center',
          spacingClasses.horizontal[spacing],
          className
        )}
        role="separator"
        {...props}
      >
        <div className="flex-grow border-t border-border-primary" />
        <span className="px-4 text-sm text-text-secondary font-medium">
          {label}
        </span>
        <div className="flex-grow border-t border-border-primary" />
      </div>
    )
  }

  if (orientation === 'vertical') {
    return (
      <div
        className={clsx(
          'inline-block h-full w-px bg-border-primary',
          spacingClasses.vertical[spacing],
          className
        )}
        role="separator"
        aria-orientation="vertical"
        {...props}
      />
    )
  }

  return (
    <hr
      className={clsx(
        'border-0 border-t border-border-primary',
        spacingClasses.horizontal[spacing],
        className
      )}
      role="separator"
      {...props}
    />
  )
}

Divider.propTypes = {
  /** Orientation of the divider */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  /** Spacing around the divider */
  spacing: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Optional label text (only for horizontal dividers) */
  label: PropTypes.string,
  /** Additional CSS classes */
  className: PropTypes.string,
}

export default Divider
