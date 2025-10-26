# AI Compliance System - Complete Documentation

## Overview

The AI Compliance System provides real-time framework compliance checking for ESG data entries. It analyzes data against GRI, TCFD, CDP, SASB, and SDG frameworks, provides scores, feedback, and manages draft/published states.

## Architecture

```
┌─────────────┐
│   Frontend  │ (React Component)
│  Compliance │
│   Checker   │
└──────┬──────┘
       │ HTTP/WebSocket
       ▼
┌─────────────────────────────────────┐
│     Express API Layer               │
│  /api/compliance/*                  │
└──────┬──────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  AI Compliance Service               │
│  - Builds prompts                    │
│  - Calls AI API (Grok/OpenAI)        │
│  - Calculates scores                 │
│  - Generates feedback                │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  Database Layer                      │
│  - ESGMetric (PostgreSQL)            │
│  - FrameworkTemplate (MongoDB)       │
│  - ActivityLog (MongoDB)             │
└──────────────────────────────────────┘
```

## Key Features

### 1. Real-Time Compliance Checking
- ✅ Automatic analysis as user types (2-second debounce)
- ✅ Immediate feedback without blocking
- ✅ WebSocket notifications for score updates

### 2. Draft/Save State Management
- ✅ **Draft State**: Save incomplete data with compliance notes
- ✅ **Published State**: Only compliant data (score >= 75) can be published
- ✅ Drafts visible on dashboard with warning indicators
- ✅ Published metrics reflect across all reports

### 3. AI-Powered Analysis
- ✅ Framework-specific requirements checking
- ✅ Missing element identification
- ✅ Evidence requirement suggestions
- ✅ Actionable recommendations
- ✅ Regulatory notes and warnings

### 4. Scoring System
- ✅ Overall score (0-100)
- ✅ Grade assignment (A+ to F)
- ✅ Field-by-field analysis
- ✅ Completeness percentage
- ✅ Compliance threshold enforcement

### 5. Proof Management
- ✅ Upload supporting documentation
- ✅ Link external evidence
- ✅ Track proof status
- ✅ Mandatory vs optional proof

### 6. Redundancy & Reliability
- ✅ Exponential backoff retry (3 attempts)
- ✅ 30-second timeout per request
- ✅ Graceful fallback on AI failure
- ✅ Error logging and recovery
- ✅ Database connection pooling
- ✅ Always-on service design

## API Endpoints

### 1. Analyze Compliance

**Endpoint:** `POST /api/compliance/analyze`

**Purpose:** Analyze data entry against framework requirements

**Request:**
```json
{
  "framework": "GRI",
  "data": {
    "disclosure": "305-1",
    "indicator": "Direct GHG emissions",
    "value": 15000,
    "unit": "tCO2e",
    "reportingPeriod": "2024",
    "verification": "third-party-verified"
  },
  "saveAs": "draft", // or "published" or null
  "metricId": "optional-existing-metric-id"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "framework": "GRI",
    "score": {
      "overall": 85,
      "aiScore": 88,
      "fieldScore": 82,
      "completeness": 90,
      "isCompliant": true,
      "grade": "B+",
      "minScoreRequired": 80
    },
    "feedback": {
      "summary": "✅ Compliant with GRI framework (Score: 85/100)",
      "status": "compliant",
      "missingElements": [
        {
          "field": "methodologyDescription",
          "requirement": "Detailed calculation methodology",
          "severity": "medium",
          "guidance": "Explain how emissions were calculated"
        }
      ],
      "recommendations": [
        {
          "priority": "high",
          "action": "Add emission factors used",
          "impact": "Improves transparency and auditability"
        }
      ],
      "proofRequired": [
        {
          "type": "verification-report",
          "description": "Third-party verification certificate",
          "purpose": "Validate emissions data accuracy",
          "mandatory": true
        }
      ],
      "regulatoryNotes": [
        "GRI 305-1 requires Scope 1 emissions to include all direct emissions from sources owned or controlled by the organization"
      ],
      "strengths": [
        "Clear emission value provided",
        "Appropriate unit used",
        "Verification status indicated"
      ]
    }
  },
  "metric": {
    "id": "uuid-here",
    "status": "draft",
    "complianceScore": 85,
    "complianceStatus": "compliant"
  },
  "message": "Saved as draft. Review compliance feedback before publishing."
}
```

### 2. Batch Analyze

**Endpoint:** `POST /api/compliance/batch-analyze`

**Purpose:** Analyze multiple entries at once (max 50)

**Request:**
```json
{
  "framework": "TCFD",
  "entries": [
    { "id": "1", "data": {...} },
    { "id": "2", "data": {...} },
    ...
  ]
}
```

**Response:**
```json
{
  "success": true,
  "total": 10,
  "results": [
    {
      "entryId": "1",
      "success": true,
      "score": {...},
      "feedback": {...}
    },
    ...
  ],
  "summary": {
    "compliant": 7,
    "nonCompliant": 2,
    "errors": 1
  }
}
```

### 3. Re-analyze After Updates

**Endpoint:** `PUT /api/compliance/reanalyze/:id`

**Purpose:** Re-check compliance after user makes changes

**Request:**
```json
{
  "data": {
    // Updated data
  },
  "framework": "GRI"
}
```

### 4. Upload Proof

**Endpoint:** `POST /api/compliance/upload-proof`

**Purpose:** Upload supporting documentation

**Request:**
```json
{
  "metricId": "uuid",
  "proofType": "verification-report",
  "fileUrl": "https://storage.../file.pdf",
  "fileName": "verification_cert.pdf",
  "description": "Third-party verification certificate"
}
```

### 5. Get Frameworks

**Endpoint:** `GET /api/compliance/frameworks`

**Purpose:** List available frameworks and requirements

**Response:**
```json
{
  "success": true,
  "frameworks": [
    {
      "framework": "GRI",
      "name": "Global Reporting Initiative",
      "version": "2021",
      "requiredFields": ["disclosure", "indicator", "value", "unit"]
    },
    ...
  ]
}
```

### 6. Get Framework Details

**Endpoint:** `GET /api/compliance/framework/:framework`

**Purpose:** Get specific framework structure

### 7. Get Drafts

**Endpoint:** `GET /api/compliance/metrics/drafts`

**Purpose:** Retrieve all draft metrics for review

### 8. Publish Metric

**Endpoint:** `PUT /api/compliance/metrics/:id/publish`

**Purpose:** Publish a draft (only if compliant)

**Response (if score < 75):**
```json
{
  "error": "Cannot publish non-compliant metric",
  "message": "Compliance score (65) is below threshold (75). Please address compliance feedback.",
  "complianceAnalysis": {...}
}
```

### 9. Compliance Stats

**Endpoint:** `GET /api/compliance/stats`

**Purpose:** Get company-wide compliance statistics

## Database Schema

### ESGMetric (PostgreSQL)

```sql
CREATE TABLE esg_metrics (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL,
  user_id UUID NOT NULL,
  framework VARCHAR(50) NOT NULL,
  
  -- Data fields
  metric_name VARCHAR(255),
  value DECIMAL(20,4),
  unit VARCHAR(50),
  
  -- Compliance fields (NEW)
  is_draft BOOLEAN DEFAULT true,
  compliance_score INTEGER CHECK (compliance_score BETWEEN 0 AND 100),
  compliance_status VARCHAR(50) CHECK (compliance_status IN ('compliant', 'non_compliant', 'pending_review', 'needs_improvement')),
  compliance_analysis JSONB DEFAULT '{}',
  
  -- Publishing
  published_by UUID,
  published_at TIMESTAMP,
  status VARCHAR(20) CHECK (status IN ('draft', 'submitted', 'published', 'archived')),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_compliance_score ON esg_metrics(compliance_score);
CREATE INDEX idx_compliance_status ON esg_metrics(compliance_status);
CREATE INDEX idx_is_draft ON esg_metrics(is_draft);
CREATE INDEX idx_framework_company ON esg_metrics(framework, company_id);
```

### ComplianceAnalysis JSONB Structure

```json
{
  "score": {
    "overall": 85,
    "aiScore": 88,
    "fieldScore": 82,
    "completeness": 90,
    "isCompliant": true,
    "grade": "B+"
  },
  "feedback": {
    "summary": "Compliant with GRI",
    "missingElements": [...],
    "recommendations": [...],
    "proofRequired": [...]
  },
  "proofs": [
    {
      "type": "verification-report",
      "fileUrl": "...",
      "fileName": "cert.pdf",
      "uploadedAt": "2024-01-01T00:00:00Z",
      "status": "pending_review"
    }
  ],
  "analyzedAt": "2024-01-01T00:00:00Z"
}
```

## Framework Standards

### Minimum Compliance Scores

| Framework | Min Score | Categories |
|-----------|-----------|------------|
| GRI | 80% | Governance, Environment, Social, Economic |
| TCFD | 75% | Governance, Strategy, Risk Management, Metrics |
| CDP | 85% | Climate Change, Water Security, Forests |
| SASB | 80% | Environment, Social Capital, Human Capital |
| SDG | 70% | All 17 Goals |

### Required Fields by Framework

**GRI:**
- disclosure
- indicator
- value
- unit
- reportingPeriod
- verification

**TCFD:**
- pillar
- recommendation
- disclosure
- evidence
- climateRisk

**CDP:**
- module
- question
- response
- evidence
- verification

## AI Integration

### AI Prompt Structure

```javascript
const prompt = `
You are an ESG compliance expert analyzing data against ${framework} framework.

FRAMEWORK: ${framework}
MINIMUM COMPLIANCE SCORE: ${minScore}%

FRAMEWORK REQUIREMENTS:
${JSON.stringify(template.structure, null, 2)}

USER SUBMITTED DATA:
${JSON.stringify(data, null, 2)}

Provide compliance analysis with:
1. COMPLIANCE SCORE (0-100)
2. FIELD ANALYSIS
3. MISSING ELEMENTS
4. EVIDENCE REQUIREMENTS
5. RECOMMENDATIONS
6. REGULATORY NOTES
`
```

### AI Configuration

```env
# .env
AI_API_URL=https://api.x.ai/v1/chat/completions
AI_API_KEY=your-grok-api-key
AI_MODEL=grok-beta
```

### Retry Logic

```javascript
// Exponential backoff: 2s, 4s, 8s
for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    const response = await callAI(prompt, timeout: 30000)
    return response
  } catch (error) {
    if (attempt < 3) {
      await sleep(Math.pow(2, attempt) * 1000)
    }
  }
}
// Fallback: Return default response
```

## Redundancy & Reliability

### 1. Always-On Design

- **Database Connection Pooling:**
  - PostgreSQL: min 5, max 20 connections
  - MongoDB: min 10, max 50 connections
  - Auto-reconnect on failure

- **AI API Resilience:**
  - 3 retry attempts with exponential backoff
  - 30-second timeout per request
  - Graceful degradation on failure
  - Fallback to cached/default responses

- **WebSocket Failover:**
  - Automatic reconnection
  - Message queuing during disconnection
  - Heartbeat monitoring

### 2. Error Handling

```javascript
try {
  const analysis = await analyzeCompliance(data, framework, userId, companyId)
  return analysis
} catch (error) {
  // Log error
  await ActivityLog.create({
    action: 'ai_compliance_error',
    error: error.message
  })
  
  // Return degraded but functional response
  return {
    success: false,
    score: { overall: 0, isCompliant: false },
    feedback: {
      summary: 'Unable to complete analysis. You can still save as draft.',
      recommendations: ['Check data format', 'Try again later']
    }
  }
}
```

### 3. Service Health Monitoring

```javascript
// Health check endpoint
GET /api/health/detailed

Response:
{
  "status": "ok",
  "services": {
    "postgres": "connected",
    "mongodb": "connected",
    "redis": "connected",
    "ai_api": "available"
  },
  "compliance_system": {
    "status": "operational",
    "last_analysis": "2024-01-01T12:00:00Z",
    "total_checks_today": 1523,
    "success_rate": 99.2
  }
}
```

### 4. Load Balancing

- Multiple AI API keys (round-robin)
- Database read replicas for analytics
- Redis clustering for job queues
- Horizontal scaling of Express servers

## User Workflow

### Draft State Workflow

```
1. User enters data → Auto-analyze (debounced)
2. AI returns feedback with missing elements
3. User sees compliance score and recommendations
4. User clicks "Save as Draft"
5. Saved with isDraft=true, visible on dashboard with warning icon
6. User can continue editing and re-analyzing
7. When compliant (score >= 75), "Publish" button enables
```

### Publish Workflow

```
1. Draft metric has score >= 75
2. User clicks "Publish"
3. Server validates compliance one more time
4. If still compliant:
   - status = 'published'
   - isDraft = false
   - publishedAt = NOW()
   - Reflects across all dashboards and reports
5. If no longer compliant:
   - Show error
   - Stays as draft
```

### Re-analysis Workflow

```
1. User updates data
2. Auto-analyze after 2 seconds (debounce)
3. New score calculated
4. If score improved: Show success notification
5. User can manually click "Re-analyze" anytime
```

## Frontend Integration

### React Component Usage

```jsx
import ComplianceChecker from './components/ComplianceChecker'

function MetricForm() {
  const [formData, setFormData] = useState({})
  
  return (
    <ComplianceChecker
      initialData={formData}
      metricId={existingMetricId}
      framework="GRI"
      onSave={(metric) => {
        console.log('Saved as draft:', metric)
        // Redirect or show success
      }}
      onPublish={(metric) => {
        console.log('Published:', metric)
        // Redirect to dashboard
      }}
    />
  )
}
```

### WebSocket Events

```javascript
// Listen for compliance updates
socket.on('compliance_update', (data) => {
  console.log('Score:', data.score)
  console.log('Compliant:', data.isCompliant)
  // Update UI
})

// Listen for batch completion
socket.on('batch_compliance_complete', (data) => {
  console.log(`Analyzed ${data.total} entries`)
  console.log(`Successful: ${data.successful}`)
  // Show summary
})

// Listen for score improvements
socket.on('compliance_improved', (data) => {
  console.log(`New score: ${data.newScore}`)
  // Show celebration animation
})
```

## Production Checklist

- [ ] Set strong `AI_API_KEY`
- [ ] Configure database connection pooling
- [ ] Enable Redis for caching
- [ ] Setup monitoring (Datadog, New Relic)
- [ ] Configure log aggregation
- [ ] Setup backup strategy for database
- [ ] Enable SSL/TLS for all connections
- [ ] Configure rate limiting (100 req/15min per user)
- [ ] Setup CDN for file uploads
- [ ] Configure environment-specific AI endpoints
- [ ] Enable database replication
- [ ] Setup automated health checks
- [ ] Configure alerting for failures
- [ ] Document escalation procedures

## Testing

### Unit Tests

```javascript
describe('AI Compliance Service', () => {
  test('calculates score correctly', async () => {
    const result = await analyzeCompliance(mockData, 'GRI', userId, companyId)
    expect(result.score.overall).toBeGreaterThan(0)
    expect(result.score.overall).toBeLessThanOrEqual(100)
  })
  
  test('handles AI API failure gracefully', async () => {
    mockAIFailure()
    const result = await analyzeCompliance(mockData, 'GRI', userId, companyId)
    expect(result.success).toBe(false)
    expect(result.feedback).toBeDefined()
  })
})
```

### Integration Tests

```bash
# Test full workflow
curl -X POST http://localhost:5500/api/compliance/analyze \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "framework": "GRI",
    "data": {
      "disclosure": "305-1",
      "value": 15000,
      "unit": "tCO2e"
    },
    "saveAs": "draft"
  }'
```

## Support

For issues:
- Check logs: `server/logs/compliance-*.log`
- Monitor health: `GET /api/health/detailed`
- View AI logs: Check Activity dashboard
- Retry failed analyses from admin panel

---

**Last Updated:** October 21, 2025
**Version:** 1.0.0
**Maintainer:** Carbon Depict Engineering Team
