// Navigation Controls - Back/Forward buttons with history tracking
import { ChevronLeft, ChevronRight } from '@atoms/Icon'
import { useNavigationHistory } from '@/contexts/NavigationHistoryContext'

export default function NavigationControls({ className = '', showStats = false }) {
  const { 
    goBack, 
    goForward, 
    canGoBack, 
    canGoForward,
    getHistoryStats 
  } = useNavigationHistory()

  const stats = getHistoryStats()

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Back Button */}
      <button
        onClick={goBack}
        disabled={!canGoBack}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 ${
          canGoBack
            ? 'border-greenly-light bg-white text-greenly-charcoal hover:bg-greenly-off-white hover:border-greenly-primary hover:text-greenly-primary active:scale-95'
            : 'border-greenly-light/50 bg-greenly-off-white/50 text-greenly-gray/40 cursor-not-allowed'
        }`}
        title={canGoBack ? `Go back (${stats.backSteps} steps available)` : 'No previous page'}
        aria-label="Navigate back"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Forward Button */}
      <button
        onClick  ={goForward}
        disabled={!canGoForward}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200 ${
          canGoForward
            ? 'border-greenly-light bg-white text-greenly-charcoal hover:bg-greenly-off-white hover:border-greenly-primary hover:text-greenly-primary active:scale-95'
            : 'border-greenly-light/50 bg-greenly-off-white/50 text-greenly-gray/40 cursor-not-allowed'
        }`}
        title={canGoForward ? `Go forward (${stats.forwardSteps} steps available)` : 'No next page'}
        aria-label="Navigate forward"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Optional Stats Display */}
      {showStats && (
        <div className="ml-2 text-xs text-greenly-gray font-mono">
          <span className="font-semibold">{stats.currentStep}</span>
          <span className="mx-1">/</span>
          <span>{stats.totalSteps}</span>
        </div>
      )}
    </div>
  )
}

// Compact version for tight spaces
export function NavigationControlsCompact({ className = '' }) {
  const { goBack, goForward, canGoBack, canGoForward } = useNavigationHistory()

  return (
    <div className={`inline-flex items-center rounded-lg border border-greenly-light bg-white ${className}`}>
      <button
        onClick={goBack}
        disabled={!canGoBack}
        className={`p-1.5 transition-colors ${
          canGoBack
            ? 'text-greenly-charcoal hover:text-greenly-primary hover:bg-greenly-off-white'
            : 'text-greenly-gray/40 cursor-not-allowed'
        }`}
        title="Go back"
        aria-label="Navigate back"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      
      <div className="w-px h-5 bg-greenly-light"></div>
      
      <button
        onClick={goForward}
        disabled={!canGoForward}
        className={`p-1.5 transition-colors ${
          canGoForward
            ? 'text-greenly-charcoal hover:text-greenly-primary hover:bg-greenly-off-white'
            : 'text-greenly-gray/40 cursor-not-allowed'
        }`}
        title="Go forward"
        aria-label="Navigate forward"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
