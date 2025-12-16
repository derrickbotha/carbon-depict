/**
 * Input Components - Carbon Depict UI Library
 *
 * Accessible form input components following Greenly Design System
 * Fully compatible with React Hook Form
 *
 * Features:
 * - PropTypes validation
 * - Framer Motion animations (focus, error states)
 * - Full React Hook Form compatibility (forwardRef)
 * - Comprehensive accessibility (ARIA attributes)
 * - Error handling with animations
 */
import { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { Search } from './Icon'

/**
 * Text Input - Greenly Design System
 * 40px height, greenly-light borders, greenly-primary focus rings
 */
export const Input = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-greenly-charcoal"
        >
          {label}
          {required && <span className="ml-1 text-greenly-alert">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={clsx(
          'input-base',
          error && 'border-greenly-alert focus:ring-greenly-alert'
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <motion.p
          id={`${inputId}-error`}
          className="mt-2 text-sm text-greenly-alert"
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          {error}
        </motion.p>
      )}
      {helperText && !error && (
        <p
          id={`${inputId}-helper`}
          className="mt-2 text-sm text-greenly-gray"
        >
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

Input.propTypes = {
  /** Input label */
  label: PropTypes.string,
  /** Error message (displays in red below input) */
  error: PropTypes.string,
  /** Helper text (displays below input when no error) */
  helperText: PropTypes.string,
  /** Required field indicator */
  required: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Input ID (auto-generated if not provided) */
  id: PropTypes.string,
  /** Input type */
  type: PropTypes.string,
  /** Input name (for React Hook Form) */
  name: PropTypes.string,
  /** Input placeholder */
  placeholder: PropTypes.string,
  /** Disabled state */
  disabled: PropTypes.bool,
}

/**
 * SearchInput - Input with search icon
 */
export const SearchInput = forwardRef(({
  placeholder = 'Search...',
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `search-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={clsx('relative', className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search className="h-5 w-5 text-greenly-gray" />
      </div>
      <input
        ref={ref}
        id={inputId}
        type="search"
        placeholder={placeholder}
        className="search-input"
        {...props}
      />
    </div>
  )
})

SearchInput.displayName = 'SearchInput'

SearchInput.propTypes = {
  /** Placeholder text */
  placeholder: PropTypes.string,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Input ID (auto-generated if not provided) */
  id: PropTypes.string,
  /** Input name (for React Hook Form) */
  name: PropTypes.string,
}

/**
 * Textarea - Multi-line text input
 */
export const Textarea = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  className = '',
  rows = 4,
  id,
  ...props
}, ref) => {
  const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-greenly-charcoal"
        >
          {label}
          {required && <span className="ml-1 text-greenly-alert">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={clsx(
          'input-base resize-y min-h-[80px]',
          error && 'border-greenly-alert focus:ring-greenly-alert'
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <motion.p
          id={`${inputId}-error`}
          className="mt-2 text-sm text-greenly-alert"
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          {error}
        </motion.p>
      )}
      {helperText && !error && (
        <p
          id={`${inputId}-helper`}
          className="mt-2 text-sm text-greenly-gray"
        >
          {helperText}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

Textarea.propTypes = {
  /** Textarea label */
  label: PropTypes.string,
  /** Error message (displays in red below textarea) */
  error: PropTypes.string,
  /** Helper text (displays below textarea when no error) */
  helperText: PropTypes.string,
  /** Required field indicator */
  required: PropTypes.bool,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Number of visible text rows */
  rows: PropTypes.number,
  /** Textarea ID (auto-generated if not provided) */
  id: PropTypes.string,
  /** Textarea name (for React Hook Form) */
  name: PropTypes.string,
  /** Textarea placeholder */
  placeholder: PropTypes.string,
  /** Disabled state */
  disabled: PropTypes.bool,
}

/**
 * Select - Dropdown selector
 */
export const Select = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  options = [],
  placeholder = 'Select an option',
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-greenly-charcoal"
        >
          {label}
          {required && <span className="ml-1 text-greenly-alert">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        className={clsx(
          'input-base cursor-pointer pr-10 bg-white appearance-none',
          'bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23636E72\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")]',
          'bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat',
          error && 'border-greenly-alert focus:ring-greenly-alert'
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <motion.p
          id={`${inputId}-error`}
          className="mt-2 text-sm text-greenly-alert"
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          {error}
        </motion.p>
      )}
      {helperText && !error && (
        <p
          id={`${inputId}-helper`}
          className="mt-2 text-sm text-greenly-gray"
        >
          {helperText}
        </p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

Select.propTypes = {
  /** Select label */
  label: PropTypes.string,
  /** Error message (displays in red below select) */
  error: PropTypes.string,
  /** Helper text (displays below select when no error) */
  helperText: PropTypes.string,
  /** Required field indicator */
  required: PropTypes.bool,
  /** Array of option objects with { value, label, disabled? } */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ),
  /** Placeholder option text */
  placeholder: PropTypes.string,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Select ID (auto-generated if not provided) */
  id: PropTypes.string,
  /** Select name (for React Hook Form) */
  name: PropTypes.string,
  /** Disabled state */
  disabled: PropTypes.bool,
}

/**
 * Checkbox - Single checkbox input
 */
export const Checkbox = forwardRef(({
  label,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={clsx('flex items-start', className)}>
      <input
        ref={ref}
        type="checkbox"
        id={inputId}
        className={clsx(
          'mt-0.5 h-5 w-5 rounded border-greenly-light',
          'text-greenly-primary focus:ring-2 focus:ring-greenly-primary focus:ring-offset-0',
          'cursor-pointer transition-colors duration-[150ms]',
          'disabled:cursor-not-allowed disabled:opacity-40'
        )}
        {...props}
      />
      {label && (
        <label
          htmlFor={inputId}
          className="ml-3 text-sm text-greenly-charcoal cursor-pointer select-none"
        >
          {label}
        </label>
      )}
      {error && (
        <motion.p
          className="mt-1 text-sm text-greenly-alert"
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

Checkbox.propTypes = {
  /** Checkbox label */
  label: PropTypes.string,
  /** Error message (displays in red) */
  error: PropTypes.string,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Checkbox ID (auto-generated if not provided) */
  id: PropTypes.string,
  /** Checkbox name (for React Hook Form) */
  name: PropTypes.string,
  /** Checked state */
  checked: PropTypes.bool,
  /** Default checked state (for uncontrolled) */
  defaultChecked: PropTypes.bool,
  /** Disabled state */
  disabled: PropTypes.bool,
  /** onChange handler */
  onChange: PropTypes.func,
}

/**
 * Radio - Radio button input
 */
export const Radio = forwardRef(({
  label,
  error,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `radio-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div className={clsx('flex items-start', className)}>
      <input
        ref={ref}
        type="radio"
        id={inputId}
        className={clsx(
          'mt-0.5 h-5 w-5 border-greenly-light',
          'text-greenly-primary focus:ring-2 focus:ring-greenly-primary focus:ring-offset-0',
          'cursor-pointer transition-colors duration-[150ms]',
          'disabled:cursor-not-allowed disabled:opacity-40'
        )}
        {...props}
      />
      {label && (
        <label
          htmlFor={inputId}
          className="ml-3 text-sm text-greenly-charcoal cursor-pointer select-none"
        >
          {label}
        </label>
      )}
      {error && (
        <motion.p
          className="mt-1 text-sm text-greenly-alert"
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  )
})

Radio.displayName = 'Radio'

Radio.propTypes = {
  /** Radio button label */
  label: PropTypes.string,
  /** Error message (displays in red) */
  error: PropTypes.string,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Radio ID (auto-generated if not provided) */
  id: PropTypes.string,
  /** Radio name (for React Hook Form) - required for grouping */
  name: PropTypes.string.isRequired,
  /** Radio value */
  value: PropTypes.string.isRequired,
  /** Checked state */
  checked: PropTypes.bool,
  /** Default checked state (for uncontrolled) */
  defaultChecked: PropTypes.bool,
  /** Disabled state */
  disabled: PropTypes.bool,
  /** onChange handler */
  onChange: PropTypes.func,
}

export default Input
