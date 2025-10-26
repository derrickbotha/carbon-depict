# Executive Dashboard Database Connection Complete ✅

## Overview

The Executive ESG Dashboard is now fully connected to the database with real-time updates and multi-framework support.

## Database Integration

### Data Sources

1. **ESG Metrics API** (`/api/esg/metrics`)
   - Fetches ESG metrics filtered by selected framework
   - Real-time updates every 30 seconds
   - Supports all 6 frameworks (GRI, TCFD, CDP, CSRD, SBTi, SDG)

2. **Emissions API** (`/api/emissions`)
   - Fetches GHG emission data
   - Real-time updates every 2 minutes
   - Automatically converted to ESG Environmental metrics

### Data Flow

```
┌─────────────────────────────────────────────────────────┐
│              Executive Dashboard                        │
│  http://localhost:3500/dashboard/executive             │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
        ┌──────────────────────────┐
        │  Framework Selector      │
        │  (GRI, TCFD, CDP, etc.)  │
        └───────────┬───────────────┘
                    │
        ┌───────────┴───────────────┐
        ↓                           ↓
┌───────────────┐          ┌───────────────┐
│ ESG Metrics   │          │  Emissions    │
│ API           │          │  API          │
│               │          │               │
│ • Framework   │          │ • Scope 1     │
│ • Pillar      │          │ • Scope 2     │
│ • Topic       │          │ • Scope 3     │
│ • Value       │          │               │
│ • Target      │          │               │
│ • Quality     │          │ • CO2e        │
└───────┬───────┘          └───────┬───────┘
        │                           │
        └───────────┬───────────────┘
                    ↓
        ┌───────────────────────────┐
        │   Grouped by Pillar       │
        │  • Environmental (E)      │
        │  • Social (S)              │
        │  • Governance (G)          │
        └───────────────────────────┘
```

## Features

### 1. Framework-Specific Data
- **GRI**: Comprehensive ESG metrics
- **TCFD**: Climate-related metrics
- **CDP**: Environmental disclosures
- **CSRD**: EU compliance metrics
- **SBTi**: Climate targets
- **SDG**: UN goals progress

### 2. Real-Time Updates
- ESG metrics refresh every 30 seconds
- Emissions data refresh every 2 minutes
- Automatic reload on framework change
- Loading states during refresh

### 3. Data Integration
- ESG metrics from `esg-metrics` collection
- Emissions data from `ghg-emissions` collection
- Combined Environmental metrics
- Framework filtering

### 4. Dashboard Components

#### Summary Cards
- Total KPIs tracked
- On Track targets (green)
- At Risk targets (red)
- Last updated timestamp

#### Emissions Summary
- Total GHG emissions
- Scope 1, 2, 3 breakdown
- Progress tracking
- Visual indicators

#### Metric Cards (by Pillar)

**Environmental (E)**
- GHG emissions
- Energy consumption
- Water usage
- Waste management
- Biodiversity

**Social (S)**
- Employee metrics
- Diversity & inclusion
- Health & safety
- Training hours
- Community impact

**Governance (G)**
- Board composition
- Risk management
- Compliance status
- Ethics metrics
- Transparency

### 5. Data Quality Indicators
Each metric shows:
- **Data Quality**: high/medium/low
- **Trend**: Up/Down arrows
- **Status**: On Track/At Risk/Critical
- **Progress**: Visual progress bars

## API Integration

### ESG Metrics Endpoint
```javascript
const response = await enterpriseAPI.esgMetrics.getAll({
  framework: selectedFramework, // GRI, TCFD, etc.
  sort: '-createdAt',
  limit: 100
})
```

### Emissions Endpoint
```javascript
const response = await enterpriseAPI.emissions.getAll({ 
  limit: 50 
})
```

## Real-Time Updates

### Auto-Refresh
- Every 30 seconds for ESG metrics
- Every 2 minutes for emissions
- Automatic cleanup on unmount

### Manual Refresh
- Refresh button with loading state
- On-demand data reload

## Framework-Specific Features

### GRI View
- Comprehensive ESG metrics
- Materiality indicators
- Stakeholder engagement

### TCFD View
- Climate governance
- Strategy assessment
- Risk management
- Metrics & targets

### CDP View
- Carbon disclosure
- Emissions inventory
- Climate strategy
- Water security

### CSRD View
- ESRS compliance
- Double materiality
- EU regulatory alignment

### SBTi View
- Science-based targets
- Scope 1/2/3 baseline
- Target verification
- Progress tracking

### SDG View
- 17 SDG goals
- Impact mapping
- Target alignment
- Progress indicators

## Status: COMPLETE ✅

The Executive Dashboard is now:
- ✅ Connected to database
- ✅ Real-time data updates
- ✅ Multi-framework support
- ✅ Automatic refresh
- ✅ Data quality indicators
- ✅ Progress tracking
- ✅ Pushed to GitHub

