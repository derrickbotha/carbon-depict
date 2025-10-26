// Cache bust 2025-10-23
import { PrimaryButton, SecondaryButton } from '@atoms/Button'
import clsx from 'clsx'

/**
 * CTAGroup - Group of call-to-action buttons
 * Used in various sections throughout the app
 */
export default function CTAGroup({
  primary,
  secondary,
  tertiary,
  align = 'left', // left, center, right
  vertical = false,
  className = '',
}) {
  return (
    <div
      className={clsx(
        'flex gap-4',
        vertical ? 'flex-col' : 'flex-col sm:flex-row',
        align === 'center' && 'justify-center',
        align === 'right' && 'justify-end',
        className
      )}
    >
      {primary && (
        <PrimaryButton
          onClick={primary.onClick}
          disabled={primary.disabled}
          type={primary.type}
        >
          {primary.text}
        </PrimaryButton>
      )}
      {secondary && (
        <SecondaryButton
          onClick={secondary.onClick}
          disabled={secondary.disabled}
          type={secondary.type}
        >
          {secondary.text}
        </SecondaryButton>
      )}
      {tertiary && (
        <button
          onClick={tertiary.onClick}
          disabled={tertiary.disabled}
          className="text-cd-midnight underline-offset-4 hover:underline transition-all duration-150"
        >
          {tertiary.text}
        </button>
      )}
    </div>
  )
}

