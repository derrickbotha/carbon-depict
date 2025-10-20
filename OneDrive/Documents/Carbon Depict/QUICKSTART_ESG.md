# 🚀 ESG Module Quick Start Guide

This guide will get you up and running with the ESG reporting module in under 10 minutes.

## Prerequisites

- ✅ Node.js 18+ installed
- ✅ PostgreSQL 14+ installed
- ✅ MongoDB 6+ installed

## Step 1: Install and Configure Databases

### PostgreSQL

```powershell
# Install PostgreSQL (if not already installed)
choco install postgresql

# Create database
psql -U postgres
CREATE DATABASE carbondepict;
\q
```

### MongoDB

```powershell
# Install MongoDB (if not already installed)
choco install mongodb

# Start MongoDB service
net start MongoDB
```

## Step 2: Configure Environment

Create `server/.env`:

```env
# Server
PORT=5500

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=carbondepict
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password-here

# MongoDB
MONGODB_URI=mongodb://localhost:27017/carbondepict

# JWT
JWT_SECRET=change-this-in-production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3500
```

## Step 3: Install Dependencies

```powershell
# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
```

## Step 4: Seed Databases

```powershell
cd server
node scripts/seed.js
```

Expected output:
```
🌱 Starting database seeding...
🐘 PostgreSQL connected successfully
📊 PostgreSQL tables synchronized
📦 MongoDB connected successfully
🧹 Cleared existing emission factors
✅ Seeded 15 emission factors
✅ Database seeding completed successfully
```

## Step 5: Start Servers

### Terminal 1 - Backend (Port 5500)

```powershell
cd server
npm run dev
```

Expected output:
```
🐘 PostgreSQL connected successfully
📊 PostgreSQL tables synchronized (8 tables created):
   - Users, Companies, Emissions, Reports
   - ESGMetrics, ESGTargets, ESGReports, MaterialityAssessments
📦 MongoDB connected successfully (7 collections):
   - EmissionFactors, AIInferences, ActivityLogs
   - FrameworkTemplates, StakeholderEngagements, SupplierAssessments, IncidentLogs
🚀 CarbonDepict API server running on port 5500
```

### Terminal 2 - Frontend (Port 3500)

```powershell
npm run dev
```

Expected output:
```
VITE v5.4.21  ready in 1716 ms
➜  Local:   http://localhost:3500/
```

## Step 6: Access the ESG Dashboard

1. **Open your browser**: http://localhost:3500

2. **Navigate to ESG Dashboard**: 
   - Click "Dashboard" in the navigation
   - Click "ESG Reporting" in the sidebar
   - Or go directly to: http://localhost:3500/dashboard/esg

3. **Explore ESG Features**:
   - **Overview Dashboard**: E/S/G scores, framework compliance
   - **Data Entry**: Enter ESG metrics (10 Environmental, 15 Social, 10 Governance forms)
   - **Materiality**: Conduct double materiality assessments
   - **Targets**: Set and track ESG targets (including SBTi)
   - **Reports**: Generate framework-specific reports (GRI, TCFD, CSRD, etc.)

## What You'll See

### ESG Dashboard Home

- **ESG Scores**: Overall (72), Environmental (78), Social (68), Governance (70)
- **Framework Compliance**: 
  - GRI: 85% ✅
  - TCFD: 70% ✅
  - SBTi: 45% 🔄
  - CSRD: 30% 🔄
  - CDP: 65% ✅
- **Key Metrics by Pillar**:
  - Environmental: GHG emissions -12%, Energy consumption -8%
  - Social: Employee turnover -2%, Women in leadership +5%
  - Governance: Board independence +5%, Ethics violations 0%
- **Active Targets**: Net Zero 2050 (32%), Gender Parity (68%), 100% Renewable (55%)
- **Quick Actions**: Enter Data, Materiality Assessment, Set Target, Generate Report

## API Testing

### Test ESG Metrics Endpoint

```powershell
# Get ESG metrics summary
curl http://localhost:5500/api/esg/metrics/summary

# Get metrics by framework
curl http://localhost:5500/api/esg/metrics/framework/GRI

# Get metrics by pillar (Environmental)
curl http://localhost:5500/api/esg/metrics/pillar/Environmental
```

### Test ESG Reports Endpoint

```powershell
# List available frameworks
curl http://localhost:5500/api/esg/reports/frameworks

# Get GRI report template
curl http://localhost:5500/api/esg/reports/templates/GRI

# Generate a report (POST request)
curl -X POST http://localhost:5500/api/esg/reports/generate -H "Content-Type: application/json" -d "{\"framework\": \"GRI\", \"reportingYear\": 2024}"
```

## Database Schema

### PostgreSQL Tables (Relational Data)

1. **esg_metrics** - 1,200+ data points across all frameworks
   - Framework (GRI, TCFD, SBTi, CSRD, SDG, CDP, etc.)
   - Pillar (Environmental, Social, Governance)
   - Topic and Sub-Topic
   - Metric Name and Code
   - Value (numeric or text)
   - Unit of measurement
   - Reporting period
   - Double materiality scores
   - Verification status

2. **esg_targets** - ESG goals and progress tracking
   - Target type (absolute, intensity, SBTi, SDG)
   - Baseline year and value
   - Target year and value
   - Current progress percentage
   - SBTi status (committed, targets-set, approved)
   - Milestones with deadlines
   - Responsible person/department

3. **esg_reports** - Generated reports metadata
   - Framework (GRI, TCFD, CSRD, CDP, SBTi, SDG, etc.)
   - Reporting year/period
   - Status (draft, review, approved, published)
   - File path and download URL
   - External assurance details
   - Publication workflow

4. **materiality_assessments** - Double materiality assessments
   - Impact materiality (scale, scope, severity, likelihood)
   - Financial materiality (magnitude, likelihood, time horizon)
   - Stakeholder input
   - Topic prioritization
   - Actions planned

### MongoDB Collections (Flexible Data)

5. **framework_templates** - Dynamic form schemas
   - Framework and version
   - Disclosure IDs and names
   - Field definitions (type, validation, conditional logic)
   - Guidance text and examples
   - Interoperability mappings

6. **stakeholder_engagements** - Consultation records
   - Engagement type (survey, interview, workshop)
   - Stakeholder groups
   - Topics discussed with priority rankings
   - Key findings and concerns
   - Actions taken

7. **supplier_assessments** - Supplier ESG scorecards
   - Environmental score (0-100)
   - Social score (0-100)
   - Governance score (0-100)
   - Risk rating (Low, Medium, High, Critical)
   - Corrective action plans
   - Certifications

8. **incident_logs** - ESG incident tracking
   - Incident type (spill, injury, discrimination, corruption, etc.)
   - Severity (minor, moderate, major, critical, catastrophic)
   - Impact (environmental, social, financial, reputational)
   - Investigation findings
   - Remediation status

## Next Steps

### 1. Create Your First ESG Metric

Navigate to: http://localhost:3500/dashboard/esg/data-entry

Enter a sample metric:
- Framework: GRI
- Standard: GRI 305-1 (Direct GHG Emissions)
- Metric: Scope 1 Emissions
- Value: 12,450
- Unit: tCO2e
- Reporting Period: 2024

### 2. Conduct a Materiality Assessment

Navigate to: http://localhost:3500/dashboard/esg/materiality

Add topics:
- Climate Change (E): Impact 5, Financial 5
- Employee Health & Safety (S): Impact 4, Financial 3
- Board Independence (G): Impact 3, Financial 3

### 3. Set Your First Target

Navigate to: http://localhost:3500/dashboard/esg/targets

Create a target:
- Type: SBTi Near-term
- Target: Reduce Scope 1+2 emissions by 50% by 2030
- Baseline: 2020, 100,000 tCO2e
- Target Year: 2030

### 4. Generate Your First Report

Navigate to: http://localhost:3500/dashboard/esg/reports/generate

Select:
- Framework: GRI
- Reporting Year: 2024
- Language: English
- Click "Generate Report"

## Troubleshooting

### PostgreSQL Connection Issues

```powershell
# Check PostgreSQL is running
Get-Service -Name postgresql*

# Start PostgreSQL if not running
Start-Service postgresql-x64-14
```

### MongoDB Connection Issues

```powershell
# Check MongoDB is running
Get-Service -Name MongoDB

# Start MongoDB if not running
net start MongoDB
```

### Port Already in Use

```powershell
# Check what's using port 5500
netstat -ano | findstr :5500

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Database Tables Not Created

```powershell
cd server
node -e "const {sequelize} = require('./config/database'); sequelize.sync({force: true}).then(() => process.exit());"
```

## Resources

- **Full Documentation**: See `docs/ESG_FRAMEWORKS_TECHNICAL_SPEC.md`
- **Implementation Plan**: See `docs/ESG_IMPLEMENTATION_SUMMARY.md`
- **Database Architecture**: See `docs/DATABASE_ARCHITECTURE.md`
- **Main README**: See `README.md`

## Support

If you encounter any issues:
1. Check the console output for error messages
2. Verify all environment variables in `server/.env`
3. Ensure both PostgreSQL and MongoDB are running
4. Check the logs in the terminal windows
5. Create a GitHub issue with error details

---

**Happy ESG Reporting!** 🌍📊✅
