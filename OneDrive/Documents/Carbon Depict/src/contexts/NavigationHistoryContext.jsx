// Navigation History Context - Tracks user navigation with browser-like back/forward
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const NavigationHistoryContext = createContext()

export function NavigationHistoryProvider({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Navigation history state
  const [history, setHistory] = useState([])
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isNavigating, setIsNavigating] = useState(false)

  // Initialize with current location
  useEffect(() => {
    if (history.length === 0) {
      setHistory([{
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
        state: location.state,
        timestamp: Date.now()
      }])
      setCurrentIndex(0)
    }
  }, [])

  // Track location changes
  useEffect(() => {
    // Skip if we're in the middle of a programmatic navigation
    if (isNavigating) {
      setIsNavigating(false)
      return
    }

    const currentPath = location.pathname + location.search + location.hash
    const lastHistoryItem = history[currentIndex]
    const lastPath = lastHistoryItem 
      ? lastHistoryItem.pathname + lastHistoryItem.search + lastHistoryItem.hash
      : null

    // Only add to history if the path actually changed
    if (currentPath !== lastPath) {
      const newEntry = {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
        state: location.state,
        timestamp: Date.now()
      }

      // Remove any forward history when navigating to a new page
      const newHistory = history.slice(0, currentIndex + 1)
      newHistory.push(newEntry)
      
      setHistory(newHistory)
      setCurrentIndex(newHistory.length - 1)
    }
  }, [location.pathname, location.search, location.hash])

  // Navigate back
  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setIsNavigating(true)
      const previousIndex = currentIndex - 1
      const previousLocation = history[previousIndex]
      
      setCurrentIndex(previousIndex)
      navigate(previousLocation.pathname + previousLocation.search + previousLocation.hash, {
        state: previousLocation.state,
        replace: true
      })
    }
  }, [currentIndex, history, navigate])

  // Navigate forward
  const goForward = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setIsNavigating(true)
      const nextIndex = currentIndex + 1
      const nextLocation = history[nextIndex]
      
      setCurrentIndex(nextIndex)
      navigate(nextLocation.pathname + nextLocation.search + nextLocation.hash, {
        state: nextLocation.state,
        replace: true
      })
    }
  }, [currentIndex, history, navigate])

  // Check if can go back
  const canGoBack = currentIndex > 0

  // Check if can go forward
  const canGoForward = currentIndex < history.length - 1

  // Get history stats
  const getHistoryStats = useCallback(() => {
    return {
      totalSteps: history.length,
      currentStep: currentIndex + 1,
      canGoBack,
      canGoForward,
      backSteps: currentIndex,
      forwardSteps: history.length - currentIndex - 1
    }
  }, [history.length, currentIndex, canGoBack, canGoForward])

  // Clear history (useful for logout or reset)
  const clearHistory = useCallback(() => {
    setHistory([{
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state,
      timestamp: Date.now()
    }])
    setCurrentIndex(0)
  }, [location])

  // Keyboard shortcuts: Alt+Left (back), Alt+Right (forward)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + Left Arrow = Go Back
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault()
        goBack()
      }
      // Alt + Right Arrow = Go Forward
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault()
        goForward()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goBack, goForward])

  const value = {
    history,
    currentIndex,
    goBack,
    goForward,
    canGoBack,
    canGoForward,
    getHistoryStats,
    clearHistory
  }

  return (
    <NavigationHistoryContext.Provider value={value}>
      {children}
    </NavigationHistoryContext.Provider>
  )
}

export function useNavigationHistory() {
  const context = useContext(NavigationHistoryContext)
  if (!context) {
    throw new Error('useNavigationHistory must be used within NavigationHistoryProvider')
  }
  return context
}
