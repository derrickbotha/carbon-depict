# Dashboard Connection Status

## ✅ Dashboard IS Connected to Real Data

The dashboard at `http://localhost:3500/dashboard` is **already connected** to the database and displaying real-time information.

### How It Works:

#### 1. Frontend Component
**File**: `src/pages/dashboard/DashboardHome.jsx`

**Data Hooks Used**:
- `useDashboardData()` - Fetches dashboard summary
- `useEmissionsAnalytics()` - Fetches emissions data
- `useESGAnalytics()` - Fetches ESG metrics
- `useComplianceAnalytics()` - Fetches compliance data

#### 2. Backend API Endpoints
**File**: `server/routes/analytics.js`

The following endpoints are already implemented and connected to the database:

| Endpoint | Method | Purpose | Database Query |
|----------|--------|---------|---------------|
| `/api/analytics/dashboard` | GET | Overall dashboard data | GHGEmission + ESGMetric collections |
| `/api/analytics/emissions` | GET | Emissions analytics | GHGEmission collection |
| `/api/analytics/esg` | GET | ESG metrics analytics | ESGMetric collection |
| `/api/analytics/compliance` | GET | Compliance status | ESGMetric + targets |
| `/api/analytics/trends` | GET | Trend analysis | Calculated from time-series data |
| `/api/analytics/benchmarks` | GET | Benchmark data | Comparison data |

#### 3. Data Flow

```
DashboardHome.jsx
    ↓ (uses hooks from useEnterpriseData.js)
enterpriseAPI.js
    ↓ (calls endpoints)
/api/analytics/*
    ↓
server/routes/analytics.js
    ↓
Database Queries:
  - GHGEmission.find({ companyId })
  - ESGMetric.find({ companyId })
    ↓
Returns aggregated data:
  - Emissions by scope
  - ESG scores
  - Framework compliance
```

### Current Dashboard Displays:

#### 1. **Total Emissions Card**
- **Data Source**: `GHGEmission` collection
- **Calculation**: Sum of all `co2e` values for the company
- **Display**: `${emissionsPerformance.current.total} tCO₂e`

#### 2. **ESG Score Card**
- **Data Source**: `ESGMetric` collection
- **Calculation**: Based on number of metrics submitted
- **Display**: Overall ESG score out of 100

#### 3. **CSRD Compliance Card**
- **Data Source**: Framework compliance tracking
- **Calculation**: Based on CSRD metrics submitted
- **Display**: Compliance progress percentage

#### 4. **SBTi Progress Card**
- **Data Source**: SBTi targets in `ESGMetric`
- **Calculation**: Progress towards science-based targets
- **Display**: Progress percentage

#### 5. **Environmental/Social/Governance Cards**
- **Data Source**: `ESGMetric` collection filtered by pillar
- **Calculation**: Score based on number of metrics
- **Display**: Score out of 100 with progress bar

#### 6. **Framework Compliance Section**
- **Data Source**: `ESGMetric` filtered by framework
- **Frameworks Tracked**:
  - GRI
  - TCFD
  - SBTi
  - CSRD
  - CDP
  - SDG

### Why Dashboard Shows "0" Values:

The dashboard shows "0" values because:
1. **No emissions data** has been submitted through the Scope 1/2/3 forms
2. **No ESG metrics** have been submitted through the ESG data entry forms
3. **Database is clean** - Only user accounts exist, no emission or ESG data

### To See Real Data:

1. **Navigate to emissions data entry**:
   - Scope 1: `http://localhost:3500/dashboard/emissions/scope1`
   - Scope 2: `http://localhost:3500/dashboard/emissions/scope2`
   - Scope 3: `http://localhost:3500/dashboard/emissions/scope3`

2. **Fill out forms and click "Calculate Emissions"**

3. **Navigate to ESG data entry**:
   - Various forms under: `http://localhost:3500/dashboard/esg/data-entry/*`

4. **Return to dashboard** and see updated values

### Current Status:

✅ **Dashboard connected to database**
✅ **API endpoints functional**
✅ **Real-time data fetching**
✅ **Data aggregation working**
✅ **Displays will update when data is entered**

### What Happens When You Enter Data:

1. **Enter emissions data** in Scope 1/2/3 forms
2. **Click "Calculate Emissions"**
3. **Data is saved to `GHGEmission` collection**
4. **Dashboard fetches from database**
5. **Dashboard displays calculated emissions in real-time**

### Technical Implementation:

**Frontend**: `src/pages/dashboard/DashboardHome.jsx`
- Uses custom hooks from `src/hooks/useEnterpriseData.js`
- Hooks call `enterpriseAPI` service layer
- Service layer makes authenticated API calls

**Backend**: `server/routes/analytics.js`
- Protected by `authenticate` middleware
- Filters data by `companyId` (from authenticated user)
- Queries `GHGEmission` and `ESGMetric` collections
- Aggregates and returns structured data

**Database**: MongoDB
- Collections: `GHGEmission`, `ESGMetric`, `Company`, `User`

### Automatic Updates:

The dashboard **automatically refreshes** data:
- On mount
- When date filters change
- Every 30 seconds (in some implementations)

### Conclusion:

**The dashboard IS connected to the database and WILL display real data once it's entered through the forms.** The "0" values you're seeing are correct - they indicate that no data has been submitted yet.



