# Icon System Migration - Implementation Script

## Objective
Update all icon usage across the Carbon Depict application to use consistent styling with `strokeWidth={2}` and proper sizing.

---

## Migration Pattern

### Before:
```jsx
import { Settings } from 'lucide-react'

<Settings className="h-5 w-5" />
```

### After:
```jsx
import { Settings } from '@atoms/Icon'

<Settings className="h-5 w-5" strokeWidth={2} />
```

---

## Automated Changes Needed

### 1. Import Statement Updates
**Find**: `from 'lucide-react'`
**Replace**: `from '@atoms/Icon'`

**Files to Update**: All .jsx files using lucide-react

---

### 2. Add strokeWidth Attribute
**Pattern**: Find all instances of Lucide icons and add `strokeWidth={2}`

**Example Transformations**:
```jsx
// Navigation Icons
<LayoutDashboard className="h-5 w-5" />
→ <LayoutDashboard className="h-5 w-5" strokeWidth={2} />

// Action Icons
<Plus className="h-4 w-4" />
→ <Plus className="h-4 w-4" strokeWidth={2} />

// Status Icons
<CheckCircle2 className="h-5 w-5 text-green-600" />
→ <CheckCircle2 className="h-5 w-5 text-green-600" strokeWidth={2} />
```

---

## File-by-File Checklist

### ✅ Phase 1: Core Navigation (COMPLETED)
- [x] `src/components/atoms/Icon.jsx` - Updated exports
- [x] `src/layouts/DashboardLayout.jsx` - Updated sidebar + mobile nav
- [x] `ICON_USAGE_GUIDELINES.md` - Created documentation

### 🔄 Phase 2: Dashboard Pages (IN PROGRESS)

#### ESG Dashboard
- [x] `src/pages/dashboard/ESGDashboardHome.jsx`
  - Updated import statement from 'lucide-react' to '@atoms/Icon'
  - **Needs**: Add strokeWidth={2} to ~40+ icon instances
  
- [ ] `src/pages/dashboard/ESGDataEntryHub.jsx`
  - Icons: Grid3X3, List, Search, Filter, ArrowRight, Upload, Download, ChevronRight
  - **Action**: Update import + add strokeWidth={2}
  
- [ ] `src/pages/dashboard/MaterialityAssessment.jsx`
  - Icons: AlertCircle, TrendingUp, DollarSign, Users, Grid, Download, Save, X, FileImage, FileSpreadsheet, Mail, Plus, Check
  - **Action**: Update import + add strokeWidth={2}

#### Emissions Dashboard
- [ ] `src/pages/dashboard/EmissionsDashboard.jsx`
  - Icons: ArrowLeft, TrendingUp, TrendingDown, AlertCircle, Factory, Zap, Globe
  - **Action**: Update import + add strokeWidth={2}
  
- [ ] `src/pages/dashboard/Scope1DataCollection.jsx`
  - Icons: ArrowLeft, Factory, CheckCircle2, Circle, AlertCircle, Info
  - **Action**: Update import + add strokeWidth={2}
  
- [ ] `src/pages/dashboard/Scope2DataCollection.jsx`
  - Icons: ArrowLeft, Zap, CheckCircle2, Circle, AlertCircle, Info
  - **Action**: Update import + add strokeWidth={2}
  
- [ ] `src/pages/dashboard/Scope3DataCollection.jsx`
  - Icons: ArrowLeft, Globe, CheckCircle2, Circle, AlertCircle, Info
  - **Action**: Update import + add strokeWidth={2}

#### Environmental/Social/Governance Dashboards
- [ ] `src/pages/dashboard/EnvironmentalDashboard.jsx`
  - Icons: Leaf, Droplets, Zap, Trash2, TreePine, TrendingDown
  - **Action**: Update import + add strokeWidth={2}
  
- [ ] `src/pages/dashboard/SocialDashboard.jsx`
  - Icons: Users, Heart, GraduationCap, Shield, TrendingUp
  - **Action**: Update import + add strokeWidth={2}
  
- [ ] `src/pages/dashboard/GovernanceDashboard.jsx`
  - Icons: Building2, Users2, Scale, AlertTriangle, CheckCircle2
  - **Action**: Update import + add strokeWidth={2}

### 📋 Phase 3: Framework Data Collection Pages

- [ ] `src/pages/dashboard/GRIDataCollection.jsx`
  - Multiple status and action icons
  - **Action**: Update import + add strokeWidth={2}
  
- [ ] `src/pages/dashboard/TCFDDataCollection.jsx`
  - Multiple status and action icons
  - **Action**: Update import + add strokeWidth={2}
  
- [ ] `src/pages/dashboard/CSRDDataCollection.jsx`
  - Multiple status and action icons
  - **Action**: Update import + add strokeWidth={2}
  
- [ ] `src/pages/dashboard/CDPDataCollection.jsx`
  - Multiple status and action icons
  - **Action**: Update import + add strokeWidth={2}
  
- [ ] `src/pages/dashboard/SBTiDataCollection.jsx`
  - Multiple status and action icons
  - **Action**: Update import + add strokeWidth={2}
  
- [ ] `src/pages/dashboard/SDGDataCollection.jsx`
  - Multiple status and action icons
  - **Action**: Update import + add strokeWidth={2}

### 📋 Phase 4: Target & Reports Pages

- [ ] `src/pages/dashboard/TargetManagement.jsx`
  - Icons: Plus, Target, TrendingUp, Calendar, CheckCircle2
  - **Action**: Update import + add strokeWidth={2}
  
- [ ] `src/pages/dashboard/TargetCreation.jsx`
  - Icons: ArrowLeft, Save, AlertCircle
  - **Action**: Update import + add strokeWidth={2}
  
- [ ] `src/pages/dashboard/ReportsLibrary.jsx`
  - Icons: Plus, Download, FileText, Calendar
  - **Action**: Update import + add strokeWidth={2}
  
- [ ] `src/pages/dashboard/ReportGenerator.jsx`
  - Icons: ArrowLeft, FileText, Download, Eye, X, FileDown
  - **Action**: Update import + add strokeWidth={2}

### 📋 Phase 5: ESG Framework Pages

- [ ] `src/pages/dashboard/ESGFrameworksPage.jsx`
  - Multiple framework and action icons
  - **Action**: Update import + add strokeWidth={2}

### 📋 Phase 6: Components

- [ ] `src/components/ESGDataEntryForm.jsx`
  - Icons: CheckCircle, AlertCircle, Loader, Upload, FileText, TrendingUp
  - **Action**: Update import + add strokeWidth={2}
  
- [ ] `src/components/PWAInstallPrompt.jsx`
  - Icons: Download, X
  - **Action**: Update import + add strokeWidth={2}
  
- [ ] `src/components/organisms/Navbar.jsx`
  - Icons: Menu, X
  - **Action**: Already uses @atoms/Icon - add strokeWidth={2}

---

## Priority Order

### HIGH PRIORITY (User-facing, frequently used)
1. ✅ DashboardLayout.jsx (sidebar navigation)
2. 🔄 ESGDashboardHome.jsx (main ESG dashboard)
3. ESGDataEntryHub.jsx (data entry hub)
4. MaterialityAssessment.jsx (materiality matrix)
5. EmissionsDashboard.jsx (emissions overview)

### MEDIUM PRIORITY (Important features)
6. Scope1/2/3DataCollection.jsx (emissions data entry)
7. EnvironmentalDashboard.jsx, SocialDashboard.jsx, GovernanceDashboard.jsx
8. ReportGenerator.jsx (report generation)
9. TargetManagement.jsx (target tracking)

### LOWER PRIORITY (Framework pages)
10. GRI, TCFD, CSRD, CDP, SBTi, SDG DataCollection pages
11. ESGFrameworksPage.jsx
12. TargetCreation.jsx
13. ReportsLibrary.jsx

### COMPONENTS (Reusable elements)
14. ESGDataEntryForm.jsx
15. PWAInstallPrompt.jsx
16. Other shared components

---

## Implementation Strategy

### Option A: Manual File-by-File Update
**Pros**: Careful review, catch edge cases
**Cons**: Time-consuming
**Time**: ~4-6 hours

### Option B: Automated Script + Manual Review
**Pros**: Fast bulk update
**Cons**: Need to test thoroughly
**Time**: ~1-2 hours + testing

### Option C: Gradual Migration
**Pros**: Low risk, can test incrementally
**Cons**: Inconsistency during migration
**Time**: Spread over days/weeks

### ✅ RECOMMENDED: Option B
1. Run automated find-replace for import statements
2. Run automated find-replace pattern for strokeWidth
3. Manual review of critical pages
4. Test in browser
5. Fix any issues
6. Deploy

---

## Automated Script Template

### VSCode Find & Replace (Regex)

#### Step 1: Update Imports
**Find**: `from 'lucide-react'`
**Replace**: `from '@atoms/Icon'`
**Files**: `src/**/*.jsx`

#### Step 2: Add strokeWidth (requires manual pattern matching)
This needs to be done carefully per icon usage:

**Find Pattern**: `<(\w+) className="([^"]*)"([^/>]*)/>`
**Replace Pattern**: `<$1 className="$2" strokeWidth={2}$3/>`

**Note**: This will need refinement to avoid duplicates and handle various formats

---

## Testing Checklist

After updates, verify:
- [ ] All icons render correctly
- [ ] No missing imports
- [ ] No console errors
- [ ] Visual consistency across pages
- [ ] Sidebar navigation works
- [ ] Mobile responsive still works
- [ ] Icon sizing is appropriate
- [ ] Colors apply correctly
- [ ] Hover states work
- [ ] Accessibility maintained

---

## Rollback Plan

1. Git commit before changes
2. Keep backup of modified files
3. Test thoroughly before deployment
4. Have quick rollback script ready

```bash
git stash
git checkout HEAD -- src/
```

---

## Completion Metrics

**Total Files to Update**: ~30 files
**Total Icon Instances**: ~400+ icon usages
**Estimated Icons per File**: 15-20 average

**Progress Tracking**:
- ✅ Core Navigation: 100% (DashboardLayout)
- 🔄 Dashboard Pages: 5% (ESGDashboardHome import only)
- ⏳ Data Collection: 0%
- ⏳ Components: 0%

**Overall Progress**: ~10% Complete

---

## Next Steps

### Immediate Actions:
1. ✅ Create Icon.jsx with all exports - DONE
2. ✅ Update DashboardLayout - DONE
3. ✅ Create documentation - DONE
4. 🔄 Update ESGDashboardHome - IN PROGRESS
5. ⏳ Continue with high-priority pages

### Recommended Approach:
Use VS Code multi-cursor editing:
1. Open file
2. Find all icon imports
3. Update import source
4. Use Find & Replace for strokeWidth additions
5. Manual review
6. Test in browser
7. Move to next file

---

*Last Updated: October 22, 2025*
*Status: 10% Complete*
*Next Target: Complete ESGDashboardHome.jsx and move to ESGDataEntryHub.jsx*
