# Navigation History System

## Overview
Browser-like back/forward navigation with persistent memory throughout the application session. This system tracks all user navigation steps and allows seamless back/forward traversal.

## Features

### ✅ Complete Navigation Memory
- **Persistent History**: Tracks every navigation step from app start
- **Step Counter**: Shows current step / total steps (e.g., "5 / 12")
- **Bidirectional Navigation**: Go back and forward through your navigation history
- **Smart State Management**: Removes forward history when navigating to a new page (like browsers)

### ✅ Keyboard Shortcuts
- **Alt + ← (Left Arrow)**: Navigate back
- **Alt + → (Right Arrow)**: Navigate forward

### ✅ Visual Feedback
- **Disabled States**: Buttons are disabled when no back/forward history available
- **Hover Effects**: Interactive hover states with Greenly design system
- **Step Counter**: Optional display showing navigation position (1/5, 2/5, etc.)
- **Tooltips**: Helpful tooltips showing available steps

### ✅ Multiple UI Variants
- **Standard Controls**: Default back/forward buttons with step counter
- **Compact Controls**: Minimal inline version for tight spaces
- **Integrated**: Available in DashboardLayout header and page-level headers

## Usage

### 1. Basic Implementation (Already Done)
The navigation system is already integrated into:
- ✅ App.jsx (NavigationHistoryProvider wraps all routes)
- ✅ DashboardLayout.jsx (Header navigation controls)
- ✅ MaterialityAssessmentEnhanced.jsx (Page-level controls)

### 2. Using in New Components

```jsx
import { useNavigationHistory } from '@/contexts/NavigationHistoryContext'

function MyComponent() {
  const { 
    goBack, 
    goForward, 
    canGoBack, 
    canGoForward,
    getHistoryStats 
  } = useNavigationHistory()

  const stats = getHistoryStats()
  
  return (
    <div>
      <button onClick={goBack} disabled={!canGoBack}>
        Back ({stats.backSteps} steps)
      </button>
      
      <span>{stats.currentStep} / {stats.totalSteps}</span>
      
      <button onClick={goForward} disabled={!canGoForward}>
        Forward ({stats.forwardSteps} steps)
      </button>
    </div>
  )
}
```

### 3. Using Pre-built Navigation Controls

```jsx
import NavigationControls from '@molecules/NavigationControls'

// Standard with stats
<NavigationControls showStats={true} />

// Compact version
import { NavigationControlsCompact } from '@molecules/NavigationControls'
<NavigationControlsCompact />
```

## API Reference

### NavigationHistoryContext

#### Methods

**`goBack()`**
- Navigates to the previous page in history
- Only works if `canGoBack === true`

**`goForward()`**
- Navigates to the next page in history
- Only works if `canGoForward === true`

**`getHistoryStats()`**
- Returns object with navigation statistics:
  ```js
  {
    totalSteps: 12,        // Total number of pages visited
    currentStep: 5,        // Current position (1-indexed)
    canGoBack: true,       // Can navigate backward
    canGoForward: true,    // Can navigate forward
    backSteps: 4,          // Number of steps available backward
    forwardSteps: 7        // Number of steps available forward
  }
  ```

**`clearHistory()`**
- Resets navigation history (useful for logout)
- Keeps current page as the only history entry

#### Properties

**`history`** - Array of visited locations
```js
[
  {
    pathname: '/dashboard/esg/materiality',
    search: '',
    hash: '',
    state: null,
    timestamp: 1699123456789
  },
  // ... more entries
]
```

**`currentIndex`** - Current position in history (0-indexed)

**`canGoBack`** - Boolean indicating if back navigation is possible

**`canGoForward`** - Boolean indicating if forward navigation is possible

## Component Props

### NavigationControls

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | `''` | Additional CSS classes |
| `showStats` | boolean | `false` | Show step counter (e.g., "5 / 12") |

### NavigationControlsCompact

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | string | `''` | Additional CSS classes |

## Styling

All navigation controls use the Greenly design system:

```css
/* Active State */
- Background: white
- Border: greenly-light
- Text: greenly-charcoal
- Hover: greenly-off-white background, greenly-primary border/text

/* Disabled State */
- Background: greenly-off-white/50
- Border: greenly-light/50
- Text: greenly-gray/40
- Cursor: not-allowed
```

## Browser Compatibility

Works in all modern browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

## Performance Notes

- **Lightweight**: Minimal overhead, only tracks pathname/search/hash
- **Memory Efficient**: History is cleared on logout/session end
- **No Persistence**: History is session-only (resets on page refresh)
- **Smart Updates**: Only adds to history when path actually changes

## Future Enhancements

Potential improvements:
- [ ] LocalStorage persistence (survive page refresh)
- [ ] History limit (max 100 entries to prevent memory issues)
- [ ] Visual history timeline/breadcrumbs
- [ ] History search/filter functionality
- [ ] Analytics tracking for navigation patterns

## Examples

### Example 1: Navigation Flow
```
1. User visits: /dashboard
2. User navigates to: /dashboard/esg
3. User navigates to: /dashboard/esg/materiality
4. User clicks Back → Returns to /dashboard/esg (Step 2/3)
5. User clicks Back → Returns to /dashboard (Step 1/3)
6. User clicks Forward → Returns to /dashboard/esg (Step 2/3)
7. User navigates to: /dashboard/reports
   → History becomes: [/dashboard, /dashboard/esg, /dashboard/reports]
   → Forward history to /materiality is removed (like browser behavior)
```

### Example 2: Keyboard Navigation
```
Alt + ← → Go back one step
Alt + ← → Go back another step
Alt + → → Go forward one step
```

## Troubleshooting

**Q: Navigation not working?**
- Ensure NavigationHistoryProvider wraps your Router in App.jsx
- Check that you're using the hook inside a component within the provider

**Q: History resets unexpectedly?**
- This is intentional on logout (via clearHistory)
- History is session-only and doesn't persist across page refreshes

**Q: Keyboard shortcuts conflicting?**
- Alt+Arrow keys are standard browser shortcuts
- They're disabled when navigation isn't possible

## Support

For issues or questions:
1. Check this documentation
2. Review the context implementation in `src/contexts/NavigationHistoryContext.jsx`
3. Review component implementation in `src/components/molecules/NavigationControls.jsx`
