/**
 * Media Query Hook - Phase 3 Week 12: Component Architecture
 *
 * Hook for responsive design with media queries
 */
import { useState, useEffect } from 'react'

/**
 * Hook for matching media queries
 *
 * @param {string} query - Media query string
 * @returns {boolean} Whether the media query matches
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)

    // Initial check
    setMatches(mediaQuery.matches)

    // Create event listener
    const handler = (event) => setMatches(event.matches)

    // Add listener
    mediaQuery.addEventListener('change', handler)

    // Cleanup
    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}

/**
 * Predefined breakpoint hooks
 */
export const useIsMobile = () => useMediaQuery('(max-width: 768px)')
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)')
export const useIsLargeScreen = () => useMediaQuery('(min-width: 1440px)')

/**
 * Hook for checking if screen is at least a certain size
 */
export const useBreakpoint = (breakpoint = 'md') => {
  const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }

  return useMediaQuery(`(min-width: ${breakpoints[breakpoint]})`)
}

export default useMediaQuery
