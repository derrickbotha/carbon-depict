/**
 * EmptyState Component - Carbon Depict UI Library
 *
 * Placeholder for empty data states following Greenly Design System
 *
 * Features:
 * - PropTypes validation
 * - Framer Motion animations (fade-in, scale)
 * - Customizable icon, title, and message
 * - Action buttons support
 * - Accessible and responsive
 */
import React from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import { Info } from '@atoms/Icon'

const EmptyState = ({
  icon: Icon = Info,
  title = "No Data Available",
  message = "There is no data to display at the moment.",
  actions,
  className = '',
}) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-greenly-light rounded-lg bg-greenly-off-white ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <motion.div
        className="bg-greenly-light p-4 rounded-full mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
      >
        <Icon className="h-10 w-10 text-greenly-sage-700" />
      </motion.div>
      <motion.h3
        className="text-xl font-semibold text-greenly-charcoal-700 mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {title}
      </motion.h3>
      <motion.p
        className="text-greenly-charcoal-500 max-w-sm mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        {message}
      </motion.p>
      {actions && (
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          {actions}
        </motion.div>
      )}
    </motion.div>
  )
}

EmptyState.propTypes = {
  /** Icon component to display */
  icon: PropTypes.elementType,
  /** Empty state title */
  title: PropTypes.string,
  /** Empty state message */
  message: PropTypes.string,
  /** Action buttons (JSX) */
  actions: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
}

export default EmptyState
