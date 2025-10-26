# Icon Usage Guidelines - Carbon Depict Application

## Overview
This document defines the standardized icon system used throughout the Carbon Depict application to ensure visual consistency and professional appearance.

---

## Icon Library
**Library**: Lucide React (https://lucide.dev/)
**Why**: Clean, consistent, modern open-source icons with excellent React support

---

## Standard Configuration

### Default Stroke Width
```jsx
strokeWidth={2}
```
All icons should use `strokeWidth={2}` for consistent line weight across the application.

### Default Sizing
- **Small**: `h-4 w-4` (16px) - For inline text, small buttons
- **Default**: `h-5 w-5` (20px) - For navigation, standard buttons, cards
- **Medium**: `h-6 w-6` (24px) - For page headers, prominent features
- **Large**: `h-8 w-8` (32px) - For dashboard metrics, feature highlights

### Usage Example
```jsx
import { Settings } from '@atoms/Icon'

<Settings className="h-5 w-5" strokeWidth={2} />
```

---

## Icon Mapping by Context

### Navigation (Sidebar/Header)
| Context | Icon | Size | Notes |
|---------|------|------|-------|
| Dashboard Home | `LayoutDashboard` | h-5 w-5 | Grid layout icon |
| ESG Module | `Leaf` | h-5 w-5 | Sustainability symbol |
| Emissions | `BarChart3` | h-5 w-5 | Analytics/charts |
| Reports | `FileText` | h-5 w-5 | Document icon |
| Settings | `Settings` | h-5 w-5 | Gear icon |

### Actions
| Context | Icon | Notes |
|---------|------|-------|
| Add/Create | `Plus` | Primary action |
| Edit | `Edit2` or `Edit3` | Pencil icon |
| Delete | `Trash2` | Trash bin |
| Save | `Save` | Floppy disk |
| Download | `Download` | Down arrow |
| Upload | `Upload` | Up arrow |
| Search | `Search` | Magnifying glass |
| Filter | `Filter` | Funnel icon |
| More Options | `MoreVertical` | Three dots vertical |
| Menu | `MoreHorizontal` | Three dots horizontal |

### Status Indicators
| Context | Icon | Color |
|---------|------|-------|
| Success | `CheckCircle2` | text-green-600 |
| Warning | `AlertTriangle` | text-yellow-600 |
| Error | `AlertCircle` | text-red-600 |
| Info | `Info` | text-blue-600 |
| Loading | `RefreshCw` | with animate-spin |

### Environmental/Emissions
| Context | Icon | Notes |
|---------|------|-------|
| Scope 1 (Direct) | `Factory` | Manufacturing |
| Scope 2 (Energy) | `Zap` | Electricity bolt |
| Scope 3 (Indirect) | `Globe` | Supply chain |
| Water | `Droplets` | Water drops |
| Waste | `Trash2` | Waste bin |
| Energy | `Zap` | Lightning bolt |
| Trees/Forest | `TreePine` | Reforestation |
| Recycling | `Recycle` | Circular arrows |
| Climate | `Leaf` | Nature/sustainability |

### ESG Categories
| Category | Icon | Notes |
|----------|------|-------|
| Environmental | `Leaf` | Green/nature |
| Social | `Heart` or `Users` | People/community |
| Governance | `Building2` or `Scale` | Corporate/justice |
| Health & Safety | `Shield` | Protection |
| Education | `GraduationCap` | Learning |
| Diversity | `Users2` | Multiple people |

### Data & Analytics
| Context | Icon | Notes |
|---------|------|-------|
| Bar Chart | `BarChart3` | Vertical bars |
| Line Chart | `LineChart` | Trend lines |
| Pie Chart | `PieChart` | Circular chart |
| Trending Up | `TrendingUp` | Positive trend |
| Trending Down | `TrendingDown` | Negative trend |
| Target/Goal | `Target` | Bullseye |
| Metrics | `Activity` | Pulse/activity |

### Files & Documents
| Context | Icon | Notes |
|---------|------|-------|
| Generic File | `File` | Blank document |
| Text Document | `FileText` | Document with lines |
| Spreadsheet | `FileSpreadsheet` | Excel/data |
| Image | `FileImage` | Picture file |
| Download File | `FileDown` | File with down arrow |
| New File | `FilePlus` | File with plus |
| Folder | `Folder` or `FolderOpen` | Directory |

### User & Account
| Context | Icon | Notes |
|---------|------|-------|
| User Profile | `User` | Single person |
| Users/Team | `Users` or `Users2` | Multiple people |
| Add User | `UserPlus` | Person with plus |
| Login | `LogIn` | Enter arrow |
| Logout | `LogOut` | Exit arrow |
| Notifications | `Bell` | Bell icon |
| Messages | `Mail` | Envelope |

### View Controls
| Context | Icon | Notes |
|---------|------|-------|
| Grid View | `Grid3X3` | 3x3 grid |
| List View | `List` | Lines/list |
| Filter | `Sliders` | Adjustment sliders |
| Eye/View | `Eye` | View/visibility |
| Hide | `EyeOff` | Hidden/private |

---

## Implementation Checklist

### ✅ Completed
- [x] Icon component wrapper (`src/components/atoms/Icon.jsx`)
- [x] Dashboard layout sidebar icons
- [x] Navigation icons with consistent stroke width

### 🔄 In Progress
- [ ] All page-level components
- [ ] Form components
- [ ] Card components
- [ ] Button components with icons

### 📋 Pages to Update

#### Dashboard Pages
- [ ] `DashboardHome.jsx`
- [ ] `ESGDashboardHome.jsx`
- [ ] `EmissionsDashboard.jsx`
- [ ] `EnvironmentalDashboard.jsx`
- [ ] `SocialDashboard.jsx`
- [ ] `GovernanceDashboard.jsx`

#### Data Collection Pages
- [ ] `Scope1DataCollection.jsx`
- [ ] `Scope2DataCollection.jsx`
- [ ] `Scope3DataCollection.jsx`
- [ ] `GRIDataCollection.jsx`
- [ ] `TCFDDataCollection.jsx`
- [ ] `CSRDDataCollection.jsx`
- [ ] `CDPDataCollection.jsx`
- [ ] `SBTiDataCollection.jsx`
- [ ] `SDGDataCollection.jsx`

#### ESG Pages
- [ ] `ESGDataEntryHub.jsx`
- [ ] `ESGFrameworksPage.jsx`
- [ ] `MaterialityAssessment.jsx`
- [ ] `TargetManagement.jsx`
- [ ] `TargetCreation.jsx`
- [ ] `ReportsLibrary.jsx`
- [ ] `ReportGenerator.jsx`

#### Components
- [ ] `ESGDataEntryForm.jsx`
- [ ] `PWAInstallPrompt.jsx`
- [ ] `Navbar.jsx`

---

## Code Examples

### Basic Icon Usage
```jsx
import { Settings, Download, Plus } from '@atoms/Icon'

// Standard button with icon
<button className="flex items-center gap-2">
  <Plus className="h-5 w-5" strokeWidth={2} />
  <span>Add New</span>
</button>

// Icon-only button
<button className="p-2">
  <Settings className="h-5 w-5" strokeWidth={2} />
</button>

// Status indicator
<div className="flex items-center gap-2">
  <CheckCircle2 className="h-5 w-5 text-green-600" strokeWidth={2} />
  <span>Completed</span>
</div>
```

### Navigation Item
```jsx
import { LayoutDashboard } from '@atoms/Icon'

<Link
  to="/dashboard"
  className="flex items-center gap-3 px-3 py-2"
>
  <LayoutDashboard className="h-5 w-5" strokeWidth={2} />
  <span>Dashboard</span>
</Link>
```

### Metric Card
```jsx
import { TrendingUp, Factory } from '@atoms/Icon'

<div className="card">
  <div className="flex items-center justify-between">
    <Factory className="h-8 w-8 text-gray-400" strokeWidth={2} />
    <TrendingUp className="h-5 w-5 text-green-600" strokeWidth={2} />
  </div>
  <h3>Scope 1 Emissions</h3>
  <p className="text-2xl font-bold">1,250 tCO2e</p>
</div>
```

### Loading State
```jsx
import { RefreshCw } from '@atoms/Icon'

<button disabled className="flex items-center gap-2">
  <RefreshCw className="h-5 w-5 animate-spin" strokeWidth={2} />
  <span>Loading...</span>
</button>
```

---

## Color Guidelines

### Status Colors
- **Success**: `text-green-600` or `text-emerald-600`
- **Warning**: `text-yellow-600` or `text-amber-600`
- **Error**: `text-red-600` or `text-rose-600`
- **Info**: `text-blue-600` or `text-sky-600`
- **Neutral**: `text-gray-600` or `text-slate-600`

### Brand Colors
- **Primary (Teal)**: `text-cd-teal` (#14b8a6)
- **Midnight**: `text-cd-midnight` (#0f172a)
- **Cedar**: `text-cd-cedar` (#9d4edd)
- **Muted**: `text-cd-muted` (#64748b)

---

## Best Practices

### DO ✅
- Always use `strokeWidth={2}` for consistency
- Use semantic icon names that match context
- Maintain consistent sizing within similar UI elements
- Use appropriate colors for status indicators
- Add `aria-label` for icon-only buttons
- Use `title` attribute for tooltips when needed

### DON'T ❌
- Mix different stroke widths without reason
- Use mismatched icon styles from different libraries
- Forget accessibility attributes for icon buttons
- Use colors that don't convey meaning
- Make icons too large or too small
- Use too many different icon sizes on one page

---

## Migration Strategy

### Phase 1: Core Navigation ✅
- Sidebar icons
- Header navigation
- User menu

### Phase 2: Dashboard Pages 🔄
- Dashboard home
- ESG dashboard
- Emissions dashboard
- Environmental, Social, Governance dashboards

### Phase 3: Forms & Data Entry
- All data collection pages
- Form inputs with icons
- Validation indicators

### Phase 4: Components
- Buttons
- Cards
- Modals
- Alerts

### Phase 5: Polish
- Hover states
- Animations
- Transitions
- Accessibility

---

## Testing Checklist

- [ ] All icons render correctly
- [ ] Consistent stroke width across all pages
- [ ] Appropriate sizing for context
- [ ] Color contrast meets WCAG AA standards
- [ ] Icons scale properly on different screen sizes
- [ ] No missing icon imports
- [ ] Tooltips display for icon-only buttons
- [ ] Keyboard navigation works with icon buttons

---

## Maintenance

### Adding New Icons
1. Check if icon exists in Lucide React library
2. Add to `src/components/atoms/Icon.jsx` exports
3. Document in this guideline
4. Use consistent naming (PascalCase)
5. Apply standard `strokeWidth={2}`

### Updating Icons
1. Search codebase for old icon usage
2. Update import statements
3. Apply new icon with proper attributes
4. Test in all contexts
5. Update documentation

---

*Last Updated: October 22, 2025*
*Maintained by: Development Team*
