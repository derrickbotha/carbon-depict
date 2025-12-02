// Cache bust 2025-10-23
import { forwardRef } from 'react'
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
        <p 
          id={`${inputId}-error`}
          className="mt-2 text-sm text-greenly-alert"
          role="alert"
        >
          {error}
        </p>
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
        <p 
          id={`${inputId}-error`}
          className="mt-2 text-sm text-greenly-alert"
          role="alert"
        >
          {error}
        </p>
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
        <p 
          id={`${inputId}-error`}
          className="mt-2 text-sm text-greenly-alert"
          role="alert"
        >
          {error}
        </p>
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
        <p className="mt-1 text-sm text-greenly-alert" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

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
        <p className="mt-1 text-sm text-greenly-alert" role="alert">
          {error}
        </p>
      )}
    </div>
  )
})

Radio.displayName = 'Radio'

export default Input
