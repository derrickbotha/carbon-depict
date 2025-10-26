# Real-Time Dashboard Integration Complete ✅

## Overview

The ESG data entry forms now save data to the database in real-time, and both the Executive Dashboard and General Dashboard display this data with automatic updates.

## Data Flow Architecture

```
┌───────────────────────────────────────────────────────┐
│  ESG Data Entry Forms                                │
│  http://localhost:3500/dashboard/esg/data-entry      │
└────────────────┬──────────────────────────────────────┘
                 │
                 │ Save via API
                 ↓
┌───────────────────────────────────────────────────────┐
│              MongoDB Database                         │
│  • esg-metrics collection                            │
│  • ghg-emissions collection                           │
│  • Real-time storage                                  │
└────────────────┬──────────────────────────────────────┘
                 │
                 │ Fetch via API
                 ↓
        ┌────────┴────────┐
        │                  │
        ▼                  ▼
┌──────────────┐    ┌──────────────────┐
│  Executive   │    │   General        │
│  Dashboard   │    │   Dashboard      │
│              │    │                  │
│  /executive  │    │  /dashboard      │
│              │    │                  │
│  Real-time   │    │  Real-time       │
│  every 30s   │    │  every 30s       │
└──────────────┘    └──────────────────┘
```

## Real-Time Updates Configuration

### General Dashboard (`http://localhost:3500/dashboard`)
- **Update Frequency**: Every 30 seconds
- **Data Sources**:
  - ESG Analytics API
  - Emissions Analytics API
  - Compliance Analytics API
  - Dashboard Data API
- **Features**:
  - Automatic refresh
  - Live KPI tracking
  - Trend indicators
  - Compliance status

### Executive Dashboard (`http://localhost:3500/dashboard/executive`)
- **Update Frequency**: Every 30 seconds (ESG metrics), Every 2 minutes (emissions)
- **Data Sources**:
  - ESG Metrics API (framework-filtered)
  - Emissions API
- **Features**:
  - Framework-specific data
  - Environmental emissions summary
  - Pillar-based grouping (E, S, G)
  - Real-time KPI tracking

## Data Entry Forms Integration

### Forms with Real-Time Save
All ESG data entry forms automatically save to the database when submitted:

#### Environmental Forms
1. **GHG Emissions Inventory** (`/dashboard/esg/data-entry/ghg-inventory`)
   - Framework: GRI, TCFD, CSRD, CDP, SBTi
   - Data: Scope 1, 2, 3 emissions

2. **Energy Management** (`/dashboard/esg/data-entry/energy-management`)
   - Framework: GRI, CSRD, SDG
   - Data: Energy consumption, renewable sources

3. **Water Management** (`/dashboard/esg/data-entry/water-management`)
   - Framework: GRI, CSRD, CDP
   - Data: Water withdrawal, consumption, discharge

4. **Waste Management** (`/dashboard/esg/data-entry/waste-management`)
   - Framework: GRI, CSRD
   - Data: Waste generation, recycling, landfill

5. **Biodiversity & Land Use** (`/dashboard/esg/data-entry/biodiversity-land-use`)
   - Framework: GRI, CSRD
   - Data: Protected areas, IUCN species

6. **Materials & Circular Economy** (`/dashboard/esg/data-entry/materials-circular-economy`)
   - Framework: GRI, CSRD
   - Data: Input materials, recycled content

#### Social Forms
7. **Employee Demographics** (`/dashboard/esg/data-entry/employee-demographics`)
   - Framework: GRI, CSRD
   - Data: Headcount, gender, age, diversity

8. **Health & Safety** (`/dashboard/esg/data-entry/health-safety`)
   - Framework: GRI, CSRD
   - Data: Injuries, fatalities, incident rates

9. **Training & Development** (`/dashboard/esg/data-entry/training-development`)
   - Framework: GRI, CSRD, SDG
   - Data: Training hours, programs, skills development

10. **Diversity & Inclusion** (`/dashboard/esg/data-entry/diversity-inclusion`)
    - Framework: GRI, CSRD, SDG
    - Data: Policies, metrics, initiatives

#### Governance Forms
11. **Board Composition** (`/dashboard/esg/data-entry/board-composition`)
    - Framework: GRI, TCFD, CSRD
    - Data: Independence, diversity, expertise

12. **Ethics & Anti-Corruption** (`/dashboard/esg/data-entry/ethics-anti-corruption`)
    - Framework: GRI, CSRD, SDG
    - Data: Policies, training, incidents

13. **Risk Management** (`/dashboard/esg/data-entry/risk-management`)
    - Framework: GRI, TCFD, CSRD
    - Data: Framework, climate risks, cyber risks

## API Endpoints

### ESG Metrics
- **POST** `/api/esg/metrics` - Create new metric
- **PUT** `/api/esg/metrics/:id` - Update metric
- **GET** `/api/esg/metrics` - Get all metrics (filtered by framework)
- **GET** `/api/esg/metrics/:id` - Get specific metric
- **DELETE** `/api/esg/metrics/:id` - Delete metric

### Emissions
- **POST** `/api/emissions` - Create new emission
- **PUT** `/api/emissions/:id` - Update emission
- **GET** `/api/emissions` - Get all emissions
- **GET** `/api/emissions/summary` - Get emissions summary
- **DELETE** `/api/emissions/:id` - Delete emission

### Analytics
- **GET** `/api/analytics/dashboard` - Dashboard analytics
- **GET** `/api/analytics/emissions` - Emissions analytics
- **GET** `/api/analytics/esg` - ESG analytics
- **GET** `/api/analytics/compliance` - Compliance analytics

## Data Structure

### ESG Metric Document
```javascript
{
  _id: ObjectId,
  companyId: ObjectId,
  framework: String, // 'GRI', 'TCFD', 'CDP', 'CSRD', 'SBTi', 'SDG'
  pillar: String, // 'Environmental', 'Social', 'Governance'
  topic: String, // e.g., 'Water Management', 'Employee Demographics'
  metricName: String,
  reportingPeriod: String, // '2024'
  value: Number,
  unit: String, // 'kWh', 'megalitres', 'number'
  target: Number,
  trend: Number, // -1, 0, or 1
  dataQuality: String, // 'high', 'medium', 'low'
  status: String, // 'draft', 'published'
  isDraft: Boolean,
  metadata: {
    formData: Object,
    completionPercentage: Number,
    submittedAt: ISOString
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Emission Document
```javascript
{
  _id: ObjectId,
  companyId: ObjectId,
  scope: String, // 'scope1', 'scope2', 'scope3'
  category: String, // e.g., 'stationary-combustion', 'purchased-electricity'
  activityType: String, // e.g., 'diesel', 'grid-electricity-kwh'
  activityValue: Number,
  activityUnit: String, // 'litres', 'kWh'
  emissionFactor: Number,
  emissionFactorUnit: String,
  emissionFactorSource: String,
  emissionFactorYear: Number,
  co2e: Number, // kg CO2e
  reportingPeriod: String, // '2024'
  metadata: {
    calculation: String,
    dataQuality: String
  },
  recordedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Real-Time Features

### Automatic Refresh
- **DashboardHome**: Refreshes every 30 seconds
- **ESGExecutiveDashboard**: Refreshes every 30 seconds (ESG), every 2 minutes (emissions)

### Manual Refresh
- Both dashboards support manual refresh buttons
- Users can trigger on-demand data reload

### Live Data Display
- KPIs update automatically
- Charts refresh with new data
- Summary cards show current values
- Compliance status updates in real-time

## Status: COMPLETE ✅

### Implemented
- ✅ ESG data entry forms save to database
- ✅ Executive Dashboard fetches real-time data
- ✅ General Dashboard fetches real-time data
- ✅ Automatic refresh every 30 seconds
- ✅ Framework-specific filtering
- ✅ Emissions data integration
- ✅ Pillar-based grouping (E, S, G)
- ✅ KPI tracking and display
- ✅ Progress indicators
- ✅ Compliance status tracking

### Data Flow Confirmed
- ✅ Forms → Database
- ✅ Database → Executive Dashboard
- ✅ Database → General Dashboard
- ✅ Real-time updates
- ✅ Multi-framework support

