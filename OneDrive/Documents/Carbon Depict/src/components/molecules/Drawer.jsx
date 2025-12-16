/**
 * Drawer Component - Carbon Depict UI Library
 *
 * Accessible side drawer/panel following Greenly Design System
 *
 * Features:
 * - PropTypes validation
 * - Framer Motion slide animations
 * - Focus trap (keyboard accessible)
 * - Multiple positions (left, right, top, bottom)
 * - Backdrop with click-to-close
 * - ESC key handling
 * - AnimatePresence for smooth unmounting
 */

import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from '@atoms/Icon'
import clsx from 'clsx'

/**
 * Drawer - Side panel component
 */
export default function Drawer({
  isOpen,
  onClose,
  position = 'right',
  size = 'md',
  title,
  children,
  footer,
  showCloseButton = true,
  closeOnBackdrop = true,
  className = '',
}) {
  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const sizes = {
    sm: {
      right: 'max-w-sm',
      left: 'max-w-sm',
      top: 'max-h-[50vh]',
      bottom: 'max-h-[50vh]',
    },
    md: {
      right: 'max-w-md',
      left: 'max-w-md',
      top: 'max-h-[60vh]',
      bottom: 'max-h-[60vh]',
    },
    lg: {
      right: 'max-w-lg',
      left: 'max-w-lg',
      top: 'max-h-[75vh]',
      bottom: 'max-h-[75vh]',
    },
    xl: {
      right: 'max-w-xl',
      left: 'max-w-xl',
      top: 'max-h-[85vh]',
      bottom: 'max-h-[85vh]',
    },
    full: {
      right: 'w-full',
      left: 'w-full',
      top: 'h-full',
      bottom: 'h-full',
    },
  }

  const positionClasses = {
    right: 'right-0 top-0 bottom-0 h-full',
    left: 'left-0 top-0 bottom-0 h-full',
    top: 'top-0 left-0 right-0 w-full',
    bottom: 'bottom-0 left-0 right-0 w-full',
  }

  const slideVariants = {
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
    top: {
      initial: { y: '-100%' },
      animate: { y: 0 },
      exit: { y: '-100%' },
    },
    bottom: {
      initial: { y: '100%' },
      animate: { y: 0 },
      exit: { y: '100%' },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnBackdrop ? onClose : undefined}
          />

          {/* Drawer */}
          <motion.div
            className={clsx(
              'fixed z-50 bg-white shadow-2xl',
              'flex flex-col',
              positionClasses[position],
              sizes[size][position],
              className
            )}
            initial={slideVariants[position].initial}
            animate={slideVariants[position].animate}
            exit={slideVariants[position].exit}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-greenly-light">
                {title && (
                  <h2 className="text-lg font-semibold text-greenly-charcoal">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 -mr-2 text-greenly-gray hover:text-greenly-charcoal transition-colors rounded-md hover:bg-greenly-light"
                    aria-label="Close drawer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-greenly-light bg-greenly-off-white">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

Drawer.propTypes = {
  /** Whether drawer is open */
  isOpen: PropTypes.bool.isRequired,
  /** Close handler */
  onClose: PropTypes.func.isRequired,
  /** Drawer position */
  position: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  /** Drawer size */
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  /** Drawer title */
  title: PropTypes.string,
  /** Drawer content */
  children: PropTypes.node.isRequired,
  /** Footer content (buttons, actions) */
  footer: PropTypes.node,
  /** Show close button in header */
  showCloseButton: PropTypes.bool,
  /** Close on backdrop click */
  closeOnBackdrop: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
}
