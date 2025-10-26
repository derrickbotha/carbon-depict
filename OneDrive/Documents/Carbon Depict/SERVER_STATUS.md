# Carbon Depict Server - Status Report

**Last Updated:** January 2025
**Status:** ✅ OPERATIONAL

## Server Information

- **Server URL:** http://localhost:5500
- **Health Check:** http://localhost:5500/api/health
- **WebSocket:** ws://localhost:5500
- **Environment:** development

## Database Connections

### ✅ PostgreSQL (Primary Relational Database)
- **Status:** Connected
- **Host:** localhost:5432
- **Database:** carbondepict
- **User:** carbonuser
- **Purpose:** User management, company data, ESG metrics, reports

### ✅ MongoDB (Document Database)
- **Status:** Connected
- **Host:** localhost:27017
- **Database:** carbondepict
- **Purpose:** AI data, emission factors, activity logs, flexible schemas
- **Note:** Running without authentication for development

### ✅ Redis (Cache & Job Queues)
- **Status:** Connected
- **Host:** localhost:6379
- **Purpose:** Bull job queues, caching, session storage
- **Active Queues:**
  - email
  - reports
  - dataProcessing
  - aiPredictions
  - notifications
  - exports
  - scheduled

## Services Status

### ✅ WebSocket Server
- **Status:** Initialized and running
- **Purpose:** Real-time updates for compliance checking, notifications

### ✅ Job Queues
- **Status:** All 7 queues initialized
- **Workers:** Email worker running

### ⚠️ Email Service
- **Status:** Not configured (using placeholder credentials)
- **Note:** Email functionality disabled until valid SMTP credentials are provided
- **To Enable:** Update `SMTP_USER` and `SMTP_PASSWORD` in `.env` file

## API Endpoints

### Core Endpoints
- `GET /api/health` - Server health check
- `GET /api/health/detailed` - Detailed health with database status

### Authentication & Users
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/users/*` - User management

### ESG Data
- `/api/esg/metrics/*` - ESG metrics management
- `/api/esg/reports/*` - ESG reports generation

### AI Compliance System 🆕
- `POST /api/compliance/analyze` - Analyze single ESG data entry
- `POST /api/compliance/batch-analyze` - Batch analyze multiple entries
- `PUT /api/compliance/reanalyze/:id` - Re-analyze after changes
- `POST /api/compliance/upload-proof` - Upload proof documents
- `GET /api/compliance/frameworks` - List supported frameworks
- `GET /api/compliance/framework/:framework` - Get framework details
- `GET /api/compliance/metrics/drafts` - Get draft metrics
- `PUT /api/compliance/metrics/:id/publish` - Publish draft metric
- `GET /api/compliance/stats` - Compliance statistics

### Other Services
- `/api/factors/*` - Emission factors
- `/api/calculate/*` - Carbon calculations
- `/api/reports/*` - Report generation
- `/api/ai/*` - AI predictions
- `/api/admin/*` - Admin functions

## Known Issues

### ⚠️ Minor Issues (Non-Critical)

1. **Mongoose Schema Index Warnings**
   - Duplicate indexes on `approvalStatus`, `status`, and `pillar` fields
   - **Impact:** None - just warnings
   - **Fix:** Remove duplicate index definitions in MongoDB schemas

2. **Email Service Not Configured**
   - Using placeholder credentials
   - **Impact:** Email features disabled (verification, password reset, notifications)
   - **Fix:** Update `.env` with valid SMTP credentials

## Recent Changes

### ✅ Completed Fixes

1. **PostgreSQL Model Loading Order**
   - Fixed foreign key dependency issue
   - Company model now loads before User model

2. **MongoDB Connection Stability**
   - Removed problematic SIGINT handler from database.js
   - Simplified connection options for better stability
   - Centralized shutdown handling in index.js

3. **Email Service Configuration**
   - Made email verification non-blocking
   - Added check for placeholder credentials
   - Server no longer fails to start due to invalid email config

## Docker Containers

All database containers are running via Docker Compose:

```bash
# Check container status
docker ps --filter "name=carbon-depict"

# View logs
docker logs carbon-depict-postgres
docker logs carbon-depict-mongodb
docker logs carbon-depict-redis

# Restart containers
docker-compose restart
```

## Next Steps

### Priority 1: Configure AI API Key 🔴
The AI compliance system requires a valid API key to function:

```bash
# In .env file, add:
AI_API_KEY=your-grok-api-key-here
AI_API_URL=https://api.x.ai/v1
```

Get your API key from:
- Grok API: https://console.x.ai
- Or OpenAI: https://platform.openai.com

### Priority 2: Test Compliance Features
Once AI API key is configured, test the compliance system:

1. **Analyze ESG Data:**
   ```json
   POST /api/compliance/analyze
   {
     "framework": "GRI",
     "category": "Environmental",
     "pillar": "Climate Change",
     "data": {
       "disclosure": "305-1",
       "value": 15000,
       "unit": "tCO2e",
       "period": "2024-Q1"
     }
   }
   ```

2. **Upload Proof:**
   ```
   POST /api/compliance/upload-proof
   - metricId: <metric_id>
   - file: <proof_document.pdf>
   - documentType: "calculation_methodology"
   ```

3. **Get Draft Metrics:**
   ```
   GET /api/compliance/metrics/drafts
   ```

4. **Publish Approved Metrics:**
   ```
   PUT /api/compliance/metrics/:id/publish
   ```

### Priority 3: Frontend Integration
Integrate the compliance checker component with your data entry forms:

```javascript
import ComplianceChecker from './components/ComplianceChecker'

// In your ESG data form component:
<ComplianceChecker
  framework="GRI"
  data={formData}
  onSave={(analysisResult) => {
    // Save metric with compliance data
  }}
/>
```

### Optional: Configure Email (Low Priority)
For email notifications:

1. **For Gmail:**
   - Enable 2FA on your Google account
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Update `.env`:
     ```
     SMTP_USER=your-email@gmail.com
     SMTP_PASSWORD=your-app-password
     ```

2. **For Corporate Email:**
   - Get SMTP settings from your IT department
   - Update all SMTP_* variables in `.env`

## Testing the Server

### Health Check
Visit http://localhost:5500/api/health in your browser or:

```powershell
# Open browser
start http://localhost:5500/api/health

# Or use detailed health check
start http://localhost:5500/api/health/detailed
```

### Test Frameworks Endpoint
```powershell
start http://localhost:5500/api/compliance/frameworks
```

## Troubleshooting

### Server Won't Start
```bash
# Check if ports are in use
netstat -ano | findstr ":5500"
netstat -ano | findstr ":5432"
netstat -ano | findstr ":27017"
netstat -ano | findstr ":6379"

# Restart Docker containers
docker-compose down
docker-compose up -d
```

### Database Connection Issues
```bash
# Test PostgreSQL
docker exec -it carbon-depict-postgres psql -U carbonuser -d carbondepict -c "SELECT 1"

# Test MongoDB
docker exec -it carbon-depict-mongodb mongosh carbondepict --eval "db.runCommand({ping: 1})"

# Test Redis
docker exec -it carbon-depict-redis redis-cli ping
```

### View Server Logs
The server is running in your terminal. To view logs, check the terminal where you ran `npm run dev`.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Carbon Depict Server                      │
│                      Port 5500                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  WebSocket  │  │     Bull    │  │     API     │         │
│  │   Server    │  │  Job Queues │  │  Endpoints  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                      Services Layer                          │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          AI Compliance Service (NEW)                 │   │
│  │  • Framework Analysis (GRI, TCFD, CDP, SASB, SDG)   │   │
│  │  • Real-time Validation                              │   │
│  │  • Compliance Scoring                                │   │
│  │  • Proof Management                                  │   │
│  │  • Draft/Published Workflow                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                      Data Layer                              │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │   MongoDB    │  │    Redis     │      │
│  │   (5432)     │  │   (27017)    │  │   (6379)     │      │
│  │              │  │              │  │              │      │
│  │ • Users      │  │ • AI Data    │  │ • Cache      │      │
│  │ • Companies  │  │ • Factors    │  │ • Queues     │      │
│  │ • Metrics    │  │ • Logs       │  │ • Sessions   │      │
│  │ • Reports    │  │ • Templates  │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
server/
├── config/
│   └── database.js          # Database connections (FIXED)
├── models/
│   ├── postgres/
│   │   ├── index.js         # Model loader (FIXED - loading order)
│   │   ├── Company.js
│   │   ├── User.js
│   │   └── ESGMetric.js     # (UPDATED - added compliance fields)
│   └── mongodb/
│       └── ...
├── routes/
│   ├── compliance.js        # (NEW) Compliance API endpoints
│   └── ...
├── services/
│   ├── aiComplianceService.js  # (NEW) Core AI compliance logic
│   └── ...
├── workers/
│   └── emailWorker.js       # (FIXED - non-blocking verification)
├── .env                     # (UPDATED - DB credentials)
└── index.js                 # Main server file

client/
└── src/
    └── components/
        └── ComplianceChecker.jsx  # (NEW) React compliance UI
```

## Summary

✅ **Server is running successfully on port 5500**
✅ **All databases connected (PostgreSQL, MongoDB, Redis)**
✅ **AI Compliance System fully implemented**
✅ **8 API endpoints for compliance checking**
✅ **Real-time WebSocket for instant feedback**
✅ **Proof upload and management system**
✅ **Draft/Published workflow for metrics**

**Next Action:** Configure `AI_API_KEY` in `.env` to enable AI compliance analysis.
