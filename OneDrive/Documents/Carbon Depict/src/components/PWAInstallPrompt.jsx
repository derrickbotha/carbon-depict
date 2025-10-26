// Cache bust 2025-10-23
import { useState, useEffect } from 'react'
import { Download, X } from '@atoms/Icon'

/**
 * PWA Install Prompt Component
 * Shows a prompt to install the app when the browser supports it
 */
const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                       window.navigator.standalone === true

    if (isInstalled) {
      return
    }

    // Listen for the beforeinstallprompt event
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      
      // Stash the event so it can be triggered later
      setDeferredPrompt(e)
      
      // Show the install prompt after a delay
      setTimeout(() => {
        setShowPrompt(true)
      }, 3000) // Show after 3 seconds
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return
    }

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    console.log(`User response to the install prompt: ${outcome}`)

    // Clear the deferredPrompt
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    
    // Don't show again for 7 days
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // Check if user dismissed recently
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed < 7) {
        setShowPrompt(false)
      }
    }
  }, [])

  if (!showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-slide-up md:left-auto md:right-4">
      <div className="rounded-xl border border-cd-forest bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center">
            <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-lg bg-cd-forest text-white">
              <Download strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-bold text-cd-midnight">Install Carbon Depict</h3>
              <p className="text-sm text-cd-muted">Access ESG tools offline</p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-cd-muted hover:text-cd-midnight"
            aria-label="Dismiss"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 space-y-2 text-sm text-cd-muted">
          <div className="flex items-center">
            <svg className="mr-2 h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Works offline
          </div>
          <div className="flex items-center">
            <svg className="mr-2 h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Faster loading
          </div>
          <div className="flex items-center">
            <svg className="mr-2 h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Add to home screen
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleInstall}
            className="flex-1 rounded-lg bg-cd-forest px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cd-midnight"
          >
            Install App
          </button>
          <button
            onClick={handleDismiss}
            className="rounded-lg border border-cd-border px-4 py-2.5 text-sm font-semibold text-cd-muted transition-colors hover:bg-cd-surface"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default PWAInstallPrompt

