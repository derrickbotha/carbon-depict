/**
 * Card Component - Phase 3 Week 12: Component Architecture
 *
 * Performance-optimized card component with:
 * - Compound component pattern
 * - Flexible composition
 * - Memoization
 * - Semantic structure
 * - PropTypes validation
 * - Framer Motion animations
 * - Hover effects
 */
import { memo, createContext, useContext } from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import clsx from 'clsx'

// Card Context for shared state (if needed)
const CardContext = createContext({})

/**
 * Base Card Component
 */
export const Card = memo(({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick,
  className = '',
  ...props
}) => {
  const isInteractive = !!onClick

  const variants = {
    default: 'bg-white border border-greenly-light',
    elevated: 'bg-white shadow-md',
    outlined: 'bg-transparent border-2 border-greenly-charcoal',
    ghost: 'bg-transparent'
  }

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <CardContext.Provider value={{}}>
      <motion.div
        onClick={onClick}
        className={clsx(
          'rounded-lg',
          variants[variant],
          paddings[padding],
          hover && 'transition-shadow hover:shadow-lg cursor-pointer',
          isInteractive && 'cursor-pointer',
          className
        )}
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        whileHover={hover || isInteractive ? { y: -2, scale: 1.01 } : undefined}
        whileTap={isInteractive ? { scale: 0.99 } : undefined}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        {...props}
      >
        {children}
      </motion.div>
    </CardContext.Provider>
  )
})

Card.displayName = 'Card'

Card.propTypes = {
  /** Card content */
  children: PropTypes.node.isRequired,
  /** Visual variant */
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined', 'ghost']),
  /** Padding size */
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
  /** Enable hover animation */
  hover: PropTypes.bool,
  /** Click handler (makes card interactive) */
  onClick: PropTypes.func,
  /** Additional CSS classes */
  className: PropTypes.string,
}

/**
 * Card Header
 */
export const CardHeader = memo(({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={clsx('mb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
})

CardHeader.displayName = 'CardHeader'

CardHeader.propTypes = {
  /** Header content */
  children: PropTypes.node.isRequired,
  /** Additional CSS classes */
  className: PropTypes.string,
}

/**
 * Card Title
 */
export const CardTitle = memo(({
  children,
  as: Component = 'h3',
  className = '',
  ...props
}) => {
  return (
    <Component
      className={clsx(
        'text-lg font-semibold text-greenly-charcoal',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
})

CardTitle.displayName = 'CardTitle'

CardTitle.propTypes = {
  /** Title content */
  children: PropTypes.node.isRequired,
  /** HTML element to render as (default: h3) */
  as: PropTypes.elementType,
  /** Additional CSS classes */
  className: PropTypes.string,
}

/**
 * Card Subtitle/Description
 */
export const CardSubtitle = memo(({
  children,
  className = '',
  ...props
}) => {
  return (
    <p
      className={clsx(
        'text-sm text-greenly-gray mt-1',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
})

CardSubtitle.displayName = 'CardSubtitle'

CardSubtitle.propTypes = {
  /** Subtitle content */
  children: PropTypes.node.isRequired,
  /** Additional CSS classes */
  className: PropTypes.string,
}

/**
 * Card Body/Content
 */
export const CardContent = memo(({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={clsx('text-greenly-charcoal', className)}
      {...props}
    >
      {children}
    </div>
  )
})

CardContent.displayName = 'CardContent'

CardContent.propTypes = {
  /** Content body */
  children: PropTypes.node.isRequired,
  /** Additional CSS classes */
  className: PropTypes.string,
}

/**
 * Card Footer
 */
export const CardFooter = memo(({
  children,
  className = '',
  justify = 'end',
  ...props
}) => {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  }

  return (
    <div
      className={clsx(
        'mt-4 pt-4 border-t border-greenly-light',
        'flex items-center gap-2',
        justifyClasses[justify],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

CardFooter.displayName = 'CardFooter'

CardFooter.propTypes = {
  /** Footer content */
  children: PropTypes.node.isRequired,
  /** Content justification */
  justify: PropTypes.oneOf(['start', 'center', 'end', 'between']),
  /** Additional CSS classes */
  className: PropTypes.string,
}

/**
 * Card Actions (alternative to CardFooter)
 */
export const CardActions = memo(({
  children,
  align = 'right',
  className = '',
  ...props
}) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }

  return (
    <div
      className={clsx(
        'flex items-center gap-2',
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

CardActions.displayName = 'CardActions'

CardActions.propTypes = {
  /** Action buttons/content */
  children: PropTypes.node.isRequired,
  /** Content alignment */
  align: PropTypes.oneOf(['left', 'center', 'right']),
  /** Additional CSS classes */
  className: PropTypes.string,
}

/**
 * Compound Card with all sub-components
 */
Card.Header = CardHeader
Card.Title = CardTitle
Card.Subtitle = CardSubtitle
Card.Content = CardContent
Card.Footer = CardFooter
Card.Actions = CardActions

export default Card
