/**
 * Theme Toggle Component
 *
 * Accessible theme switcher that cycles through light -> dark -> system
 * Shows current theme preference and system-detected theme
 *
 * Features:
 * - Visual icons for each theme state
 * - Tooltip showing current mode
 * - Keyboard accessible
 * - Smooth transitions
 * - Respects prefers-reduced-motion
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useAppState } from '../../contexts/AppStateContext'
import clsx from 'clsx'

export const ThemeToggle = ({
  className = '',
  size = 'md',
  showLabel = false,
  variant = 'button'
}) => {
  const { themePreference, effectiveTheme, toggleTheme } = useAppState()

  const getIcon = () => {
    switch (themePreference) {
      case 'light':
        return <Sun className="w-full h-full" />
      case 'dark':
        return <Moon className="w-full h-full" />
      case 'system':
        return <Monitor className="w-full h-full" />
      default:
        return <Sun className="w-full h-full" />
    }
  }

  const getLabel = () => {
    switch (themePreference) {
      case 'light':
        return 'Light Mode'
      case 'dark':
        return 'Dark Mode'
      case 'system':
        return `System (${effectiveTheme === 'dark' ? 'Dark' : 'Light'})`
      default:
        return 'Theme'
    }
  }

  const sizes = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5',
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleTheme}
        className={clsx(
          'inline-flex items-center justify-center',
          'rounded-lg transition-all duration-200',
          'bg-bg-secondary hover:bg-bg-tertiary',
          'border border-border-primary',
          'text-text-secondary hover:text-text-primary',
          'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
          sizes[size],
          className
        )}
        aria-label={`Switch theme - Currently ${getLabel()}`}
        title={getLabel()}
      >
        {getIcon()}
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        'inline-flex items-center gap-2 px-4 py-2',
        'rounded-lg transition-all duration-200',
        'bg-bg-secondary hover:bg-bg-tertiary',
        'border border-border-primary hover:border-border-secondary',
        'text-text-secondary hover:text-text-primary',
        'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
        'font-medium text-sm',
        className
      )}
      aria-label={`Switch theme - Currently ${getLabel()}`}
    >
      <span className="w-5 h-5">
        {getIcon()}
      </span>
      {showLabel && (
        <span className="hidden sm:inline">{getLabel()}</span>
      )}
    </button>
  )
}

ThemeToggle.propTypes = {
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Size of the toggle button */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Show text label alongside icon */
  showLabel: PropTypes.bool,
  /** Visual variant of the toggle */
  variant: PropTypes.oneOf(['button', 'compact']),
}

ThemeToggle.defaultProps = {
  className: '',
  size: 'md',
  showLabel: false,
  variant: 'button',
}

export default ThemeToggle
