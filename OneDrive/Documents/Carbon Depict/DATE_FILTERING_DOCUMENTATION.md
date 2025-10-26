# Date Filtering Feature Documentation

## Overview
The CarbonDepict application now includes comprehensive date filtering functionality for the executive dashboard, allowing users to view ESG and emissions data for specific time periods and track progress over time.

## Features

### 1. Date Filter Component (`DateFilter.jsx`)
- **Location**: `src/components/molecules/DateFilter.jsx`
- **Purpose**: Reusable date range picker component
- **Features**:
  - Predefined date ranges (Last 7 days, 30 days, 90 days, 6 months, year, YTD)
  - Custom date range selection
  - Real-time date range display
  - Responsive design with dropdown interface

### 2. Backend Date Filtering
- **Location**: `server/routes/analytics.js`
- **Supported Endpoints**:
  - `/api/analytics/dashboard` - Dashboard overview with date filtering
  - `/api/analytics/compliance` - Compliance analytics with date filtering
- **Query Parameters**:
  - `startDate` - Start date in YYYY-MM-DD format
  - `endDate` - End date in YYYY-MM-DD format
  - `reportingPeriod` - Optional reporting period filter

### 3. Data Model Timestamps
- **GHGEmission Model**: Uses `recordedAt` field for date filtering
- **ESGMetric Model**: Uses `createdAt` field for date filtering
- **Automatic Timestamps**: All models include `createdAt` and `updatedAt` via Mongoose timestamps

## Usage

### Frontend Implementation
```jsx
import DateFilter from '@molecules/DateFilter'

const [dateRange, setDateRange] = useState({
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  endDate: new Date()
})

const apiParams = {
  startDate: dateRange.startDate?.toISOString().split('T')[0],
  endDate: dateRange.endDate?.toISOString().split('T')[0]
}

const { data } = useDashboardData(apiParams)

<DateFilter 
  onDateRangeChange={setDateRange}
  className="bg-white/10 backdrop-blur-sm"
/>
```

### Backend API Usage
```javascript
// GET /api/analytics/dashboard?startDate=2024-01-01&endDate=2024-12-31
// Returns filtered dashboard data for the specified date range

// GET /api/analytics/compliance?startDate=2024-06-01&endDate=2024-06-30
// Returns compliance data for June 2024
```

## Data Filtering Logic

### Emissions Data
- Filters by `recordedAt` field
- Supports date range queries: `{ recordedAt: { $gte: startDate, $lte: endDate } }`
- Aggregates emissions by scope (Scope 1, 2, 3)

### ESG Metrics Data
- Filters by `createdAt` field
- Supports date range queries: `{ createdAt: { $gte: startDate, $lte: endDate } }`
- Groups metrics by pillar (Environmental, Social, Governance)
- Calculates compliance scores based on filtered data

## Sample Data
The application includes sample data with different timestamps for testing:
- **Today**: Natural Gas Combustion, Total GHG Emissions
- **Last Week**: Diesel Fuel, Climate Risk Assessment
- **Last Month**: Electricity Consumption, Science-Based Target
- **Last Quarter**: Employee Commuting, Employee Satisfaction

## Testing
1. **Sample Data Creation**: Run `node server/create-sample-data.cjs`
2. **Frontend Testing**: Navigate to `/dashboard` and use the date filter
3. **API Testing**: Use query parameters `startDate` and `endDate` with analytics endpoints

## Benefits
- **Progress Tracking**: View performance improvements over time
- **Period Comparisons**: Compare different reporting periods
- **Compliance Reporting**: Generate reports for specific date ranges
- **Trend Analysis**: Identify patterns and trends in ESG data
- **Audit Support**: Provide data for specific time periods during audits

## Future Enhancements
- **Date Range Presets**: Add more predefined ranges (Q1, Q2, Q3, Q4, etc.)
- **Comparative Analysis**: Side-by-side comparison of different periods
- **Export Functionality**: Export filtered data for specific date ranges
- **Visual Indicators**: Show data availability for different time periods
- **Performance Optimization**: Add database indexes for date-based queries
