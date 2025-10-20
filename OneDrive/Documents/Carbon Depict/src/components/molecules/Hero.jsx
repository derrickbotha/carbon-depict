import { PrimaryButton, OutlineButton } from '@atoms/Button'
import { ArrowRight, ChevronDown } from '@atoms/Icon'
import clsx from 'clsx'

/**
 * Hero Component - Full-height hero section for marketing pages
 * Includes title, subtitle, CTA buttons, and optional scroll indicator
 */
export default function Hero({
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
  showScrollIndicator = true,
  backgroundPattern = false,
  className = '',
}) {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    })
  }

  return (
    <section
      className={clsx(
        'relative flex min-h-[calc(100vh-72px)] items-center',
        backgroundPattern && 'overflow-hidden',
        className
      )}
    >
      {/* Optional background pattern */}
      {backgroundPattern && (
        <div className="absolute inset-0 -z-10 opacity-5">
          <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-cd-mint blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cd-desert blur-3xl" />
        </div>
      )}

      <div className="container-cd">
        <div className="w-full md:w-2/3 lg:w-3/5">
          {/* Title with fade-up animation */}
          <h1 className="mb-4 animate-fade-up text-4xl font-extrabold leading-tight text-cd-text md:text-5xl lg:text-6xl">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="mb-8 animate-fade-up text-lg leading-relaxed text-cd-muted md:text-xl" style={{ animationDelay: '100ms' }}>
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row animate-fade-up" style={{ animationDelay: '200ms' }}>
            {primaryCTA && (
              <PrimaryButton
                onClick={primaryCTA.onClick}
                className="inline-flex items-center gap-2"
              >
                {primaryCTA.text}
                {primaryCTA.showArrow !== false && <ArrowRight className="h-5 w-5" />}
              </PrimaryButton>
            )}
            {secondaryCTA && (
              <OutlineButton onClick={secondaryCTA.onClick}>
                {secondaryCTA.text}
              </OutlineButton>
            )}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <button
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer text-cd-muted transition-colors hover:text-cd-midnight"
          aria-label="Scroll to content"
        >
          <ChevronDown className="h-8 w-8" />
        </button>
      )}
    </section>
  )
}
