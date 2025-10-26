// Cache bust 2025-10-23
import clsx from 'clsx'

/**
 * FeatureCard - Display feature with icon, title, and description
 * Used in marketing pages to showcase features
 */
export default function FeatureCard({ 
  icon: Icon, 
  title, 
  children,
  className = '' 
}) {
  return (
    <article 
      className={clsx(
        'bg-white p-6 rounded-md shadow-cd-sm',
        'hover:shadow-cd-md hover:-translate-y-1',
        'transform transition-all duration-200 ease-cd-ease',
        className
      )}
    >
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-cd-surface">
          <Icon className="h-6 w-6 text-cd-midnight" aria-hidden="true" />
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-cd-text">{title}</h3>
      <p className="text-sm leading-relaxed text-cd-muted">{children}</p>
    </article>
  )
}

