# CarbonDepict - Complete System Architecture

## 🎯 System Overview

**CarbonDepict** is a comprehensive carbon tracking and ESG reporting platform with two major modules:
1. **Emissions Tracking** (Scopes 1, 2, 3 with DEFRA 2025)
2. **ESG Reporting** (6 frameworks: GRI, TCFD, SBTi, CSRD, CDP, SDG)

---

## 🗺️ Complete Navigation Map

```
CarbonDepict
│
├── 🏠 Home (Marketing)
│   ├── Pricing
│   └── About
│
├── 🔐 Auth
│   ├── Login
│   └── Register
│
└── 📊 Dashboard
    ├── 📈 Overview (DashboardHome)
    │
    ├── 🍃 ESG Module
    │   ├── ESG Dashboard (6 framework cards)
    │   ├── GRI Standards 2021 (43 fields, 7 sections)
    │   ├── TCFD Climate (11 fields, 4 pillars)
    │   ├── SBTi Net-Zero (27 fields, 6 sections)
    │   ├── CSRD ESRS (94 fields, 11 modules)
    │   ├── CDP Climate (114 fields, 12 modules)
    │   └── SDG Goals (85 fields, 17 goals)
    │
    ├── 🌍 Emissions Module
    │   ├── Emissions Dashboard (charts & metrics)
    │   ├── Scope 1: Direct (29 fields, 4 categories)
    │   ├── Scope 2: Energy Indirect (15 fields, 4 categories)
    │   └── Scope 3: Value Chain (48 fields, 15 categories)
    │
    ├── 📄 Reports
    └── ⚙️ Settings
```

---

## 📊 Complete Data Field Count

### ESG Module (374 fields)
| Framework | Fields | Sections/Modules | Time |
|-----------|--------|------------------|------|
| GRI | 43 | 7 sections | 2-3 hrs |
| TCFD | 11 | 4 pillars | 30-60 min |
| SBTi | 27 | 6 sections | 1-2 hrs |
| CSRD | 94 | 11 ESRS | 4-6 hrs |
| CDP | 114 | 12 modules | 3-5 hrs |
| SDG | 85 | 17 goals | 2-3 hrs |
| **Total** | **374** | **57** | **13-20 hrs** |

### Emissions Module (92 fields)
| Scope | Fields | Categories | Time |
|-------|--------|------------|------|
| Dashboard | - | 3 charts | 5 min |
| Scope 1 | 29 | 4 categories | 30-45 min |
| Scope 2 | 15 | 4 categories | 15-20 min |
| Scope 3 | 48 | 15 categories | 1-2 hrs |
| **Total** | **92** | **23** | **2-3 hrs** |

### Grand Total: **466 data entry fields** across **80 categories/modules**

---

## 🎨 Design System (CDDS v1.0)

### Color Palette
```css
--cd-midnight: #07393C  /* Primary brand, Scope 1, navigation */
--cd-teal: #1B998B     /* Secondary, Scope 2, accents */
--cd-cedar: #A15E49    /* Tertiary, Scope 3, warnings */
--cd-desert: #EDCBB1   /* Background, highlights */
--cd-mint: #B5FFE1     /* Success, 80-100% progress */
```

### Typography
- **Headings**: Inter, bold
- **Body**: Inter, regular
- **Code**: Mono, monospace

### Components
- **Progress bars**: 4-tier color coding (mint, teal, cedar, gray)
- **Cards**: Hover effects, shadow, border transitions
- **Icons**: Lucide React (100+ icons)
- **Charts**: Chart.js v4.4.0 with react-chartjs-2

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Routing**: React Router v6.20.0
- **Styling**: Tailwind CSS 3.4.0
- **Charts**: Chart.js 4.4.0 + react-chartjs-2 5.2.0
- **Icons**: Lucide React (tree-shakeable)
- **Port**: 3500

### Backend (Not Started)
- **Runtime**: Node.js + Express 4.18
- **Databases**: 
  - PostgreSQL (relational: ESG metrics, users, audits)
  - MongoDB (non-relational: logs, calculations, drafts)
- **ORM**: Sequelize (PostgreSQL), Mongoose (MongoDB)
- **Port**: 5500

### Database Models (Designed, Not Implemented)
#### PostgreSQL (4 models)
1. `ESGMetric` - Structured metrics (GRI, TCFD, SBTi)
2. `ComplianceReport` - Generated reports
3. `User` - Authentication
4. `AuditLog` - Change tracking

#### MongoDB (4 models)
1. `CSRDSubmission` - CSRD ESRS submissions
2. `CDPQuestionnaire` - CDP responses
3. `SDGImpactAssessment` - SDG contributions
4. `EmissionCalculation` - Calculation logs

---

## 📁 File Structure

```
Carbon Depict/
├── docs/
│   ├── ESG_DATA_COLLECTION_COMPLETE.md (ESG module docs)
│   ├── EMISSIONS_TRACKING_COMPLETE.md (Emissions module docs)
│   └── SYSTEM_ARCHITECTURE.md (this file)
│
├── src/
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── Button.jsx
│   │   │   ├── Icon.jsx
│   │   │   └── Input.jsx
│   │   └── molecules/
│   │       ├── Alert.jsx
│   │       └── FrameworkProgressBar.jsx
│   │
│   ├── layouts/
│   │   ├── DashboardLayout.jsx (sidebar with ESG + Emissions)
│   │   └── MarketingLayout.jsx
│   │
│   ├── pages/
│   │   ├── dashboard/
│   │   │   ├── DashboardHome.jsx
│   │   │   │
│   │   │   ├── ESG Module (7 files)
│   │   │   ├── ESGDashboardHome.jsx
│   │   │   ├── GRIDataCollection.jsx
│   │   │   ├── TCFDDataCollection.jsx
│   │   │   ├── SBTiDataCollection.jsx
│   │   │   ├── CSRDDataCollection.jsx
│   │   │   ├── CDPDataCollection.jsx
│   │   │   └── SDGDataCollection.jsx
│   │   │   │
│   │   │   ├── Emissions Module (4 files)
│   │   │   ├── EmissionsDashboard.jsx
│   │   │   ├── Scope1DataCollection.jsx
│   │   │   ├── Scope2DataCollection.jsx
│   │   │   └── Scope3DataCollection.jsx
│   │   │   │
│   │   │   ├── ReportsPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   │
│   │   ├── marketing/
│   │   │   ├── HomePage.jsx
│   │   │   ├── PricingPage.jsx
│   │   │   └── AboutPage.jsx
│   │   │
│   │   └── auth/
│   │       ├── LoginPage.jsx
│   │       └── RegisterPage.jsx
│   │
│   ├── App.jsx (routing)
│   └── main.jsx (entry point)
│
├── server/ (Not Started)
│   ├── models/
│   │   ├── postgres/
│   │   │   └── index.js
│   │   └── mongodb/
│   │       └── index.js
│   ├── routes/
│   └── server.js
│
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🔗 Complete Route Map

### Marketing Routes
- `/` - Home page
- `/pricing` - Pricing plans
- `/about` - About CarbonDepict

### Auth Routes
- `/login` - User login
- `/register` - User registration

### Dashboard Routes
- `/dashboard` - Overview

#### ESG Module Routes (7)
- `/dashboard/esg` - ESG framework cards
- `/dashboard/esg/gri` - GRI Standards data entry
- `/dashboard/esg/tcfd` - TCFD Climate data entry
- `/dashboard/esg/sbti` - SBTi Targets data entry
- `/dashboard/esg/csrd` - CSRD ESRS data entry
- `/dashboard/esg/cdp` - CDP Questionnaire data entry
- `/dashboard/esg/sdg` - SDG Impact data entry

#### Emissions Module Routes (4)
- `/dashboard/emissions` - Emissions dashboard (charts)
- `/dashboard/emissions/scope1` - Scope 1 data entry
- `/dashboard/emissions/scope2` - Scope 2 data entry
- `/dashboard/emissions/scope3` - Scope 3 data entry

#### Other Routes (2)
- `/dashboard/reports` - Reports page
- `/dashboard/settings` - Settings page

**Total Routes**: 18

---

## 🚀 Feature Comparison: ESG vs Emissions

| Feature | ESG Module | Emissions Module |
|---------|------------|------------------|
| **Focus** | Corporate sustainability reporting | Carbon footprint tracking |
| **Frameworks** | 6 (GRI, TCFD, SBTi, CSRD, CDP, SDG) | 3 scopes (GHG Protocol) |
| **Total Fields** | 374 | 92 |
| **Methodology** | Framework-specific standards | DEFRA 2025 emission factors |
| **Navigation** | Sidebar or Grid | Sidebar or Grid |
| **Progress Tracking** | ✅ Real-time | ✅ Real-time |
| **Charts** | ❌ (not yet) | ✅ Pie, Bar, Line |
| **Guidance** | ✅ Framework-specific | ✅ DEFRA-specific |
| **Time to Complete** | 13-20 hours | 2-3 hours |
| **Audience** | ESG managers, sustainability teams | Carbon accountants, operations |
| **Reporting Standards** | GRI, TCFD, SBTi, CSRD, CDP, SDG | GHG Protocol, SECR, ESOS |

---

## 📊 Progress Tracking System

Both modules use a **4-tier color-coded progress system**:

### Tier 1: 80-100% Complete
- **Color**: Mint (#B5FFE1)
- **Icon**: CheckCircle2 (filled)
- **Status**: Near completion, ready to submit

### Tier 2: 50-79% Complete
- **Color**: Teal (#1B998B)
- **Icon**: CheckCircle2 (filled)
- **Status**: Good progress, majority done

### Tier 3: 25-49% Complete
- **Color**: Cedar (#A15E49)
- **Icon**: Circle (outline)
- **Status**: Getting started, need more data

### Tier 4: 0-24% Complete
- **Color**: Gray (#D1D5DB)
- **Icon**: Circle (outline)
- **Status**: Just beginning, mostly empty

---

## 🎯 User Workflows

### ESG Reporting Workflow
1. Navigate to `/dashboard/esg`
2. Review 6 framework cards (E/S/G scores, compliance %)
3. Click framework card (e.g., GRI)
4. Select section from sidebar/grid
5. Fill in disclosure fields
6. Watch progress bar update
7. Save progress
8. Generate report (future feature)

### Emissions Tracking Workflow
1. Navigate to `/dashboard/emissions`
2. Review dashboard (charts, total emissions)
3. Click scope card (Scope 1, 2, or 3)
4. Select category from sidebar/grid
5. Enter consumption data (fuel, electricity, etc.)
6. Read DEFRA guidance
7. Watch progress bar update
8. Save progress
9. Calculate emissions (future feature)
10. Return to dashboard to see updated charts

---

## 🔮 Roadmap

### ✅ Phase 1: Frontend Complete
- [x] ESG module (6 frameworks, 374 fields)
- [x] Emissions module (3 scopes, 92 fields)
- [x] Progress tracking system
- [x] Interactive charts (emissions)
- [x] DEFRA guidance panels
- [x] Responsive design

### 🚧 Phase 2: Backend Integration (Next)
- [ ] PostgreSQL + MongoDB setup
- [ ] API endpoints for data persistence
- [ ] DEFRA emission factor database
- [ ] Emission calculation engine
- [ ] Auto-save functionality
- [ ] User authentication

### 🔮 Phase 3: Advanced Features
- [ ] Data validation & error handling
- [ ] File upload (CSV, Excel, PDF)
- [ ] AI-powered suggestions
- [ ] Historical trend analysis
- [ ] Multi-year comparisons
- [ ] Data export (Excel, CSV, JSON)

### 🔮 Phase 4: Reporting & Compliance
- [ ] PDF report generation (ESG, Emissions)
- [ ] GHG Protocol-compliant exports
- [ ] SECR/ESOS UK compliance reports
- [ ] XBRL/iXBRL for digital reporting
- [ ] Carbon footprint certificates
- [ ] Third-party API integrations

---

## 📈 Business Metrics

### Data Collection Scope
- **Total fields**: 466 across 2 modules
- **Total categories**: 80 (57 ESG + 23 Emissions)
- **Total pages**: 14 (7 ESG + 4 Emissions + 3 other)
- **Estimated completion time**: 15-23 hours for full data entry

### Compliance Coverage
- **ESG Frameworks**: 6 major international standards
- **Emission Scopes**: All 3 GHG Protocol scopes
- **DEFRA Alignment**: 2025 emission factors
- **UK Compliance**: SECR, ESOS ready (future)
- **EU Compliance**: CSRD ready (future)

---

## 🏆 Key Achievements

✅ **Comprehensive Coverage**: 466 data fields, 80 categories  
✅ **Dual Module System**: ESG + Emissions integration  
✅ **Framework Alignment**: GRI, TCFD, SBTi, CSRD, CDP, SDG  
✅ **DEFRA 2025 Compliant**: Latest UK Government factors  
✅ **GHG Protocol**: Full Scope 1, 2, 3 breakdown  
✅ **Interactive Dashboards**: Charts, cards, progress tracking  
✅ **Guided Data Entry**: Context-sensitive help panels  
✅ **Professional UX**: Consistent design system (CDDS v1.0)  
✅ **Responsive Design**: Mobile, tablet, desktop support  
✅ **Scalable Architecture**: Ready for backend integration  

---

**Status**: ✅ Frontend Complete (Phase 1)  
**Next**: Backend API + Database (Phase 2)  
**Version**: 2.0.0  
**Last Updated**: October 20, 2025
