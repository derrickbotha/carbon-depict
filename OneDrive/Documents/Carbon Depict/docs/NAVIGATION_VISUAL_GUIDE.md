# Navigation History - Visual Guide

## 🎯 Where You'll See Navigation Controls

### 1. **Dashboard Header (Global Navigation)**
```
┌─────────────────────────────────────────────────────────────┐
│ [☰] [←] [→] 5/12              [🔔] [👤 User ▼]              │
│      ↑    ↑   ↑                                              │
│      │    │   └─ Forward button                              │
│      │    └───── Back button                                 │
│      └────────── Step counter (current/total)                │
└─────────────────────────────────────────────────────────────┘
```

**Location**: Top of every dashboard page  
**Features**: 
- Always visible
- Shows current step / total steps
- Keyboard shortcuts: Alt+← and Alt+→

---

### 2. **Page-Level Navigation (Materiality Assessment)**
```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  [⬅] [←] [→]  ESG Materiality Assessment                    │
│   ↑    ↑   ↑                                                 │
│   │    │   └─ Forward in history                             │
│   │    └───── Back in history                                │
│   └────────── Back to ESG Dashboard                          │
│                                                               │
│  Double materiality analysis • 73% data complete             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Location**: Materiality Assessment page header  
**Features**:
- Context-specific back button (returns to ESG Dashboard)
- History navigation controls
- No step counter (cleaner look)

---

## 🎨 Button States

### Enabled (Can Navigate)
```
┌──────┐
│  ←   │  ← Green border on hover
└──────┘     Green text on hover
   ↑         White background
   └── Clickable cursor
```

### Disabled (Cannot Navigate)
```
┌──────┐
│  ←   │  ← Gray/faded appearance
└──────┘     Not-allowed cursor
   ↑         Tooltip: "No previous page"
   └── Cannot click
```

---

## 📊 Step Counter Display

Shows your position in navigation history:

```
Current Step / Total Steps

Examples:
  1 / 1   → First page, no history yet
  3 / 8   → On step 3 of 8 total pages visited
  5 / 5   → At the end of history (newest page)
```

---

## ⌨️ Keyboard Shortcuts

```
┌─────────────────────┬──────────────────────┐
│ Shortcut            │ Action               │
├─────────────────────┼──────────────────────┤
│ Alt + ← (Left)      │ Navigate Back        │
│ Alt + → (Right)     │ Navigate Forward     │
└─────────────────────┴──────────────────────┘

💡 Tip: Same shortcuts as Chrome, Firefox, Edge!
```

---

## 🔄 How History Works

### Example Navigation Flow:

```
Step 1: Dashboard
   ↓ (click ESG)
Step 2: ESG Dashboard
   ↓ (click Materiality)
Step 3: Materiality Assessment
   ↓ (click Data Gaps tab)
Step 3: Materiality Assessment (same page, no new history)
   ↓ (click Complete Data → Energy Form)
Step 4: Energy Management Form

At Step 4:
- Back button: Active (can go to Step 3, 2, 1)
- Forward button: Disabled (you're at the newest page)
- Counter shows: 4 / 4

Click Back:
Now at Step 3:
- Back button: Active (can go to Step 2, 1)
- Forward button: Active (can go to Step 4)
- Counter shows: 3 / 4

Click a new page (e.g., Reports):
Step 4 is removed, new Step 4 is Reports:
History: [Dashboard → ESG → Materiality → Reports]
- Back button: Active
- Forward button: Disabled (forward history was cleared)
- Counter shows: 4 / 4
```

---

## 🎯 Use Cases

### Use Case 1: Data Entry Workflow
```
1. Start at ESG Dashboard
2. Open Materiality Assessment
3. See Climate Change needs data
4. Click "Complete Data" → GHG Inventory Form
5. Fill out form
6. Click Back (history) → Return to Materiality
7. Click Back (history) → Return to ESG Dashboard
```

### Use Case 2: Report Review
```
1. Dashboard
2. ESG Dashboard
3. Materiality Assessment
4. Reports Library
5. Click Back 3 times → Return to Dashboard
```

### Use Case 3: Exploring Data
```
1. Start exploring different pages
2. Get 10 pages deep
3. Use Back/Forward to navigate through your exploration path
4. Step counter shows where you are (e.g., "6 / 10")
```

---

## 🎨 Design Integration

All controls follow **Greenly Design System**:

- **Primary Color**: Earth Green (#34A56F)
- **Typography**: Inter for UI text
- **Spacing**: Consistent 8px grid
- **Transitions**: Smooth 200ms duration
- **Shadows**: Subtle greenly-sm shadows
- **Border Radius**: 8px (rounded-lg)

---

## 📱 Responsive Behavior

### Desktop (≥1024px)
- Full navigation controls in header
- Step counter visible
- Large hover targets

### Tablet (768px - 1023px)
- Compact navigation controls
- Step counter hidden
- Medium hover targets

### Mobile (<768px)
- Minimal navigation controls
- Icons only, no text
- Touch-friendly 44px targets

---

## ✨ Advanced Features

### Auto-clear on Logout
When user logs out, history is automatically cleared to:
- Protect privacy
- Prevent navigation to protected routes
- Fresh start for next session

### Smart State Management
- URL changes tracked (pathname + search + hash)
- Duplicate navigation ignored
- State preserved for each history entry

### Performance Optimized
- Minimal re-renders
- Efficient history storage
- No server requests (client-side only)

---

## 🐛 Debugging Tips

### Check Navigation State
```jsx
const { getHistoryStats } = useNavigationHistory()
console.log(getHistoryStats())

// Output:
// {
//   totalSteps: 5,
//   currentStep: 3,
//   canGoBack: true,
//   canGoForward: true,
//   backSteps: 2,
//   forwardSteps: 2
// }
```

### View Full History
```jsx
const { history, currentIndex } = useNavigationHistory()
console.log('History:', history)
console.log('Current Index:', currentIndex)
```

---

## 🚀 Quick Start

The navigation system is **already active** in your app!

1. **Navigate**: Click around your dashboard
2. **Go Back**: Click ← button or press Alt+←
3. **Go Forward**: Click → button or press Alt+→
4. **Check Progress**: Look at step counter (e.g., "3 / 7")

That's it! The system tracks everything automatically. 🎉
