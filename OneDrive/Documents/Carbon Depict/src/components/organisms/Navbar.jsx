import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from '@atoms/Icon'
import { PrimaryButton, OutlineButton } from '@atoms/Button'
import clsx from 'clsx'

/**
 * Navbar - Main navigation component
 * Sticky header with responsive mobile menu
 */
export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Handle scroll for backdrop blur effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/pricing', label: 'Pricing' },
  ]

  return (
    <nav
      className={clsx(
        'fixed top 0 left-0 right-0 z-50 transition-all duration-200',
        scrolled
          ? 'bg-white/90 shadow-cd-sm backdrop-blur-subtle'
          : 'bg-white'
      )}
    >
      <div className="container-cd">
        <div className="flex h-18 items-center justify-between py-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-cd-midnight transition-colors hover:text-cd-cedar"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-cd-midnight text-white">
              <span className="font-mono text-lg">CD</span>
            </div>
            <span className="hidden sm:inline">CarbonDepict</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={clsx(
                  'text-sm font-medium transition-colors',
                  location.pathname === link.href
                    ? 'text-cd-midnight'
                    : 'text-cd-muted hover:text-cd-midnight'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden items-center gap-4 md:flex">
            <Link to="/login">
              <OutlineButton className="px-4 py-2">Log In</OutlineButton>
            </Link>
            <Link to="/register">
              <PrimaryButton className="px-4 py-2">Get Started</PrimaryButton>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-cd-midnight"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden animate-slide-down border-t border-cd-border bg-white">
          <div className="container-cd py-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={clsx(
                    'py-2 text-base font-medium transition-colors',
                    location.pathname === link.href
                      ? 'text-cd-midnight'
                      : 'text-cd-muted hover:text-cd-midnight'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-3">
                <Link to="/login">
                  <OutlineButton className="w-full">Log In</OutlineButton>
                </Link>
                <Link to="/register">
                  <PrimaryButton className="w-full">Get Started</PrimaryButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
