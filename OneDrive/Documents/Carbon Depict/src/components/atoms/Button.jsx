// Cache bust 2025-10-23
import clsx from 'clsx'

/**
 * Primary Button - Main CTAs
 * Greenly Design System: Earth Green background, 40px height, prominent actions
 */
export const PrimaryButton = ({ 
  children, 
  onClick, 
  disabled = false,
  type = 'button',
  className = '',
  icon,
  iconPosition = 'left',
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'btn-base btn-primary',
        'inline-flex items-center justify-center gap-2',
        className
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="w-5 h-5">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="w-5 h-5">{icon}</span>}
    </button>
  )
}

/**
 * Secondary Button - Lower priority actions
 * Greenly Design System: Charcoal border, transparent background
 */
export const SecondaryButton = ({ 
  children, 
  onClick, 
  disabled = false,
  type = 'button',
  className = '',
  icon,
  iconPosition = 'left',
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'btn-base btn-secondary',
        'inline-flex items-center justify-center gap-2',
        className
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="w-5 h-5">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="w-5 h-5">{icon}</span>}
    </button>
  )
}

/**
 * Outline Button / Ghost Button - Tertiary actions
 * Greenly Design System: Minimal styling, hover state only
 */
export const OutlineButton = ({ 
  children, 
  onClick, 
  disabled = false,
  type = 'button',
  className = '',
  icon,
  iconPosition = 'left',
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'btn-base btn-ghost',
        'inline-flex items-center justify-center gap-2',
        className
      )}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="w-5 h-5">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="w-5 h-5">{icon}</span>}
    </button>
  )
}

/**
 * Ghost Button - Alias for OutlineButton (design system naming)
 */
export const GhostButton = OutlineButton

/**
 * Icon Button - For icon-only actions
 * Greenly Design System: Compact, square 40px, minimal styling
 */
export const IconButton = ({ 
  children, 
  onClick, 
  disabled = false,
  type = 'button',
  className = '',
  ariaLabel,
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={clsx(
        'inline-flex items-center justify-center',
        'w-10 h-10 rounded-md',
        'bg-transparent hover:bg-greenly-light',
        'text-greenly-charcoal',
        'transition-all duration-[250ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]',
        'focus:outline-none focus:ring-2 focus:ring-greenly-primary focus:ring-offset-2',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent',
        className
      )}
      {...props}
    >
      <span className="w-5 h-5">{children}</span>
    </button>
  )
}

/**
 * Loading Button - Button with loading state
 * Shows spinner when loading
 */
export const LoadingButton = ({ 
  children, 
  onClick, 
  loading = false,
  disabled = false,
  type = 'button',
  variant = 'primary',
  className = '',
  icon,
  iconPosition = 'left',
  ...props 
}) => {
  const ButtonComponent = 
    variant === 'primary' ? PrimaryButton : 
    variant === 'secondary' ? SecondaryButton : 
    GhostButton

  return (
    <ButtonComponent
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx('relative', className)}
      icon={!loading && icon}
      iconPosition={iconPosition}
      {...props}
    >
      {loading && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg
            className="h-5 w-5 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
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
          </svg>
        </span>
      )}
      <span className={loading ? 'invisible' : ''}>{children}</span>
    </ButtonComponent>
  )
}

// Default export for convenience
export default PrimaryButton
