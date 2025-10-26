// Cache bust 2025-10-23
import { forwardRef } from 'react'
import clsx from 'clsx'

/**
 * Text Input - Standard text input field
 * Follows CDDS design with proper focus states
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
          className="mb-2 block text-sm font-medium text-cd-text"
        >
          {label}
          {required && <span className="ml-1 text-cd-error">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={clsx(
          'w-full px-4 py-2 border rounded-md',
          'placeholder:text-cd-muted',
          'transition-all duration-150 ease-cd-ease',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          error
            ? 'border-cd-error focus:ring-cd-error'
            : 'border-cd-border focus:ring-cd-desert focus:border-transparent',
          'disabled:bg-cd-surface disabled:cursor-not-allowed disabled:opacity-60'
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p 
          id={`${inputId}-error`}
          className="mt-2 text-sm text-cd-error"
          role="alert"
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p 
          id={`${inputId}-helper`}
          className="mt-2 text-sm text-cd-muted"
        >
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

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
          className="mb-2 block text-sm font-medium text-cd-text"
        >
          {label}
          {required && <span className="ml-1 text-cd-error">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={clsx(
          'w-full px-4 py-2 border rounded-md',
          'placeholder:text-cd-muted resize-y',
          'transition-all duration-150 ease-cd-ease',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          error
            ? 'border-cd-error focus:ring-cd-error'
            : 'border-cd-border focus:ring-cd-desert focus:border-transparent',
          'disabled:bg-cd-surface disabled:cursor-not-allowed disabled:opacity-60'
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p 
          id={`${inputId}-error`}
          className="mt-2 text-sm text-cd-error"
          role="alert"
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p 
          id={`${inputId}-helper`}
          className="mt-2 text-sm text-cd-muted"
        >
          {helperText}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

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
          className="mb-2 block text-sm font-medium text-cd-text"
        >
          {label}
          {required && <span className="ml-1 text-cd-error">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={inputId}
        className={clsx(
          'w-full px-4 py-2 border rounded-md',
          'bg-white cursor-pointer',
          'transition-all duration-150 ease-cd-ease',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          error
            ? 'border-cd-error focus:ring-cd-error'
            : 'border-cd-border focus:ring-cd-desert focus:border-transparent',
          'disabled:bg-cd-surface disabled:cursor-not-allowed disabled:opacity-60'
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
        <p 
          id={`${inputId}-error`}
          className="mt-2 text-sm text-cd-error"
          role="alert"
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p 
          id={`${inputId}-helper`}
          className="mt-2 text-sm text-cd-muted"
        >
          {helperText}
        </p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

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
          'mt-1 h-4 w-4 rounded border-cd-border',
          'text-cd-midnight focus:ring-2 focus:ring-cd-desert',
          'cursor-pointer',
          'disabled:cursor-not-allowed disabled:opacity-60'
        )}
        {...props}
      />
      {label && (
        <label 
          htmlFor={inputId}
          className="ml-2 text-sm text-cd-text cursor-pointer select-none"
        >
          {label}
        </label>
      )}
      {error && (
        <p className="mt-1 text-sm text-cd-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

export default Input

