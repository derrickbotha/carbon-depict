import clsx from 'clsx'

/**
 * Primary Button - Main CTAs
 * Follows CDDS design system with cd-midnight background
 */
export const PrimaryButton = ({ 
  children, 
  onClick, 
  disabled = false,
  type = 'button',
  className = '',
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'bg-cd-midnight hover:bg-cd-cedar text-white',
        'px-6 py-3 rounded-lg shadow-cd-md',
        'transition-all duration-150 ease-cd-ease',
        'focus:outline-none focus:ring-2 focus:ring-cd-desert focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cd-midnight',
        'font-medium text-base',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * Secondary Button - Lower priority actions
 * Uses cd-desert with border
 */
export const SecondaryButton = ({ 
  children, 
  onClick, 
  disabled = false,
  type = 'button',
  className = '',
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'bg-cd-desert hover:bg-cd-cedar text-cd-midnight',
        'px-6 py-3 rounded-lg border border-cd-border',
        'transition-all duration-150 ease-cd-ease',
        'focus:outline-none focus:ring-2 focus:ring-cd-desert focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'font-medium text-base',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * Outline Button - Tertiary actions
 * Transparent with border
 */
export const OutlineButton = ({ 
  children, 
  onClick, 
  disabled = false,
  type = 'button',
  className = '',
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        'bg-transparent hover:bg-cd-surface text-cd-midnight',
        'px-6 py-3 rounded-lg border border-cd-border',
        'transition-all duration-150 ease-cd-ease',
        'focus:outline-none focus:ring-2 focus:ring-cd-desert focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'font-medium text-base',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

/**
 * Icon Button - For icon-only actions
 * Compact, square shape
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
        'bg-transparent hover:bg-cd-surface text-cd-midnight',
        'p-2 rounded-md',
        'transition-all duration-150 ease-cd-ease',
        'focus:outline-none focus:ring-2 focus:ring-cd-desert focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
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
  ...props 
}) => {
  const ButtonComponent = variant === 'primary' ? PrimaryButton : SecondaryButton

  return (
    <ButtonComponent
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx('relative', className)}
      {...props}
    >
      {loading && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg
            className="h-5 w-5 animate-spin text-white"
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
