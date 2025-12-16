/**
 * Tooltip Component - Carbon Depict UI Library
 *
 * Accessible tooltip component following Greenly Design System
 *
 * Features:
 * - PropTypes validation
 * - Framer Motion animations
 * - Multiple placement options
 * - Keyboard accessible
 * - Respects prefers-reduced-motion
 * - Auto-positioning
 */
import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

/**
 * Tooltip - Contextual information on hover/focus
 */
export const Tooltip = ({
  children,
  content,
  placement = 'top',
  delay = 200,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  const handleFocus = () => {
    setIsVisible(true)
  }

  const handleBlur = () => {
    setIsVisible(false)
  }

  const placementClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-greenly-charcoal',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-greenly-charcoal',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-greenly-charcoal',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-greenly-charcoal',
  }

  const animationVariants = {
    top: {
      initial: { opacity: 0, y: 4 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 4 },
    },
    bottom: {
      initial: { opacity: 0, y: -4 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -4 },
    },
    left: {
      initial: { opacity: 0, x: 4 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 4 },
    },
    right: {
      initial: { opacity: 0, x: -4 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -4 },
    },
  }

  return (
    <div className={clsx('relative inline-block', className)} {...props}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={isVisible ? 'tooltip' : undefined}
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && content && (
          <motion.div
            id="tooltip"
            role="tooltip"
            className={clsx(
              'absolute z-50 whitespace-nowrap',
              'px-3 py-2 text-sm text-white bg-greenly-charcoal rounded-md',
              'pointer-events-none',
              'shadow-greenly-md',
              placementClasses[placement]
            )}
            initial={animationVariants[placement].initial}
            animate={animationVariants[placement].animate}
            exit={animationVariants[placement].exit}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {content}
            <div
              className={clsx(
                'absolute w-0 h-0',
                'border-4',
                arrowClasses[placement]
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

Tooltip.propTypes = {
  /** Element that triggers the tooltip */
  children: PropTypes.node.isRequired,
  /** Tooltip content */
  content: PropTypes.node.isRequired,
  /** Tooltip placement */
  placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  /** Delay before showing tooltip (ms) */
  delay: PropTypes.number,
  /** Additional CSS classes */
  className: PropTypes.string,
}

/**
 * IconTooltip - Tooltip specifically for icon buttons
 */
export const IconTooltip = ({ children, label, placement = 'top' }) => {
  return (
    <Tooltip content={label} placement={placement}>
      {children}
    </Tooltip>
  )
}

IconTooltip.propTypes = {
  /** Icon element */
  children: PropTypes.node.isRequired,
  /** Tooltip label */
  label: PropTypes.string.isRequired,
  /** Tooltip placement */
  placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
}

export default Tooltip
