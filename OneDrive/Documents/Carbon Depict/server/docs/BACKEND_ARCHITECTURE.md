# Backend Architecture Documentation

## Overview

CarbonDepict backend is an enterprise-grade, scalable system built with:
- **PostgreSQL** for relational data (emissions, ESG metrics, organizational structure)
- **MongoDB** for document storage and AI/ML data (embeddings, predictions, flexible schemas)
- **Node.js** with Express for API layer
- **Sequelize** ORM for PostgreSQL
- **Mongoose** ODM for MongoDB

## Architecture Principles

### 1. Data Separation by Concern
- **PostgreSQL**: Structured, relational data requiring ACID compliance, complex joins, and strict schemas
- **MongoDB**: Unstructured/semi-structured data, AI/ML outputs, logs, documents requiring flexibility

### 2. Optimization for Analytics & Reporting
- Comprehensive indexing strategy
- Materialized views for common queries
- Read replicas support for analytics workloads
- Time-series partitioning for historical data

### 3. AI/ML Integration
- Vector embeddings for semantic search
- ML model prediction tracking
- Document processing and NLP
- Anomaly detection pipelines

### 4. Data Quality & Governance
- Audit trails for all critical data
- Data lineage tracking
- Verification and assurance workflows
- Multi-level approval processes

### 5. Prevent Data Duplication
- Unique constraints on natural keys
- Composite unique indexes
- Idempotent API operations
- Database-level constraints

---

## Database Schema

### PostgreSQL Models (Relational)

#### **Core Models**

##### Company
Root of organizational hierarchy. All data belongs to a company.
```javascript
{
  id: UUID (PK),
  name: STRING,
  industry: ENUM,
  region: STRING,
  subscription: ENUM,
  settings: JSONB
}
```

**Relationships:**
- Has many: Users, Locations, Facilities, Emissions, ESG data
- Cascade: DELETE cascades to all child records

##### User
User accounts with role-based access control.
```javascript
{
  id: UUID (PK),
  email: STRING UNIQUE,
  password: STRING (bcrypt hashed),
  role: ENUM (admin, manager, user),
  companyId: UUID (FK)
}
```

**Relationships:**
- Belongs to: Company
- Has many: Emissions, Reports, ESG metrics (as creator)
- RESTRICT: Cannot delete user with associated data

#### **Organizational Structure**

##### Location
Physical locations with hierarchical structure (HQ → Regional → Branch).
```javascript
{
  id: UUID (PK),
  companyId: UUID (FK),
  parentLocationId: UUID (FK, self-reference),
  name: STRING,
  locationType: ENUM,
  country: STRING,
  latitude/longitude: DECIMAL,
  floorArea: DECIMAL,
  reportingBoundary: ENUM,
  includeInReporting: BOOLEAN
}
```

**Key Features:**
- Hierarchical tree structure
- Geolocation support (PostGIS compatible)
- GHG Protocol boundary tracking
- Soft delete (paranoid)

**Indexes:**
- companyId, parentLocationId
- country, city
- includeInReporting
- Composite: (companyId, parentLocationId, status)

##### Facility
Buildings or assets at a location (more granular than Location).
```javascript
{
  id: UUID (PK),
  companyId: UUID (FK),
  locationId: UUID (FK),
  name: STRING,
  facilityType: ENUM,
  floorArea: DECIMAL,
  primaryHeatingSource: ENUM,
  energyCertificate: STRING,
  hasRenewableEnergy: BOOLEAN
}
```

**Use Case:** Track individual buildings, warehouses, production lines at a location.

#### **Environmental Data Models**

##### GHGEmission (Recommended)
Comprehensive GHG emissions tracking aligned with GHG Protocol.
```javascript
{
  id: UUID (PK),
  companyId, userId, locationId, facilityId: UUID (FK),
  
  // GHG Protocol categorization
  scope: ENUM (Scope 1/2/3),
  scope2Method: ENUM (location/market-based),
  scope3Category: ENUM (1-15),
  
  // Activity data
  activityData: DECIMAL,
  activityUnit: STRING,
  
  // Emission factors
  emissionFactorValue: DECIMAL,
  emissionFactorSource: STRING,
  
  // Calculated emissions (kgCO2e)
  co2e: DECIMAL,
  co2, ch4, n2o, hfcs, pfcs, sf6, nf3: DECIMAL,
  
  // Biogenic carbon (separate reporting)
  biogenicCo2e: DECIMAL,
  
  // Data quality
  dataQuality: ENUM,
  uncertaintyPercentage: DECIMAL,
  verified: BOOLEAN,
  verifiedBy: STRING,
  
  // Status and workflow
  status: ENUM (draft/submitted/approved/rejected),
  reviewedBy: UUID (FK),
  
  metadata: JSONB
}
```

**Indexes (22 total):**
- Time-series: (companyId, emissionDate), (companyId, reportingYear)
- Categorization: (scope), (category, subcategory), (scope3Category)
- Data quality: (dataQuality), (verified), (status)
- Composite: (companyId, scope, emissionDate), (companyId, locationId, reportingYear)
- JSONB GIN: (metadata), (calculationMetadata)
- Partial: Verified emissions, Approved emissions (performance optimization)

**Key Features:**
- All 7 GHGs tracked separately
- Scope 2 dual reporting (location + market-based)
- Scope 3 category 1-15 classification
- Biogenic carbon separate tracking
- Verification workflow
- Soft delete (audit trail)

##### EnergyConsumption
Time-series energy data with grid factors and renewable tracking.
```javascript
{
  id: UUID (PK),
  companyId, locationId, facilityId: UUID (FK),
  
  energyType: ENUM (electricity, gas, solar, etc.),
  consumption: DECIMAL,
  unit: ENUM,
  consumptionKwh: DECIMAL (normalized),
  
  // Temporal
  readingDate: DATEONLY,
  granularity: ENUM (hourly/daily/monthly/annual),
  reportingYear: INTEGER,
  
  // Metering
  meterNumber: STRING,
  meterType: ENUM,
  
  // Renewable tracking
  isRenewable: BOOLEAN,
  renewablePercentage: DECIMAL,
  hasCertificate: BOOLEAN,
  certificateType: STRING,
  
  // Scope 2 emissions
  gridEmissionFactor: DECIMAL,
  emissionsLocationBased: DECIMAL,
  emissionsMarketBased: DECIMAL,
  
  // Intensity metrics
  intensityPerArea: DECIMAL,
  intensityPerOccupant: DECIMAL,
  
  // Anomaly detection (AI/ML)
  isAnomaly: BOOLEAN,
  anomalyScore: DECIMAL,
  
  // Weather normalization
  heatingDegreeDays: DECIMAL,
  weatherNormalizedConsumption: DECIMAL
}
```

**Analytics Methods:**
- `getTotalConsumption(companyId, filters)`
- `getConsumptionByType(companyId, reportingYear)`

##### WasteManagement
Waste tracking with circular economy metrics.
```javascript
{
  wasteType: ENUM (general, recycling, hazardous, etc.),
  disposalMethod: ENUM (landfill, recycling, composting, etc.),
  diversionRate: DECIMAL,
  isCircular: BOOLEAN,
  recyclabilityScore: DECIMAL,
  calculatedEmissions: DECIMAL
}
```

##### WaterUsage
Water withdrawal, consumption, and discharge tracking (CDP Water).
```javascript
{
  waterType: ENUM (municipal, groundwater, rainwater, etc.),
  usageCategory: ENUM (withdrawal/consumption/discharge),
  volumeM3: DECIMAL (normalized),
  isWaterStressed: BOOLEAN,
  waterStressLevel: ENUM,
  treatmentLevel: ENUM,
  intensityPerArea: DECIMAL
}
```

#### **ESG Framework Models**

##### ESGMetric
Quantitative ESG metrics with framework alignment.
```javascript
{
  framework: ENUM (GRI, TCFD, CSRD, CDP, SDG, etc.),
  pillar: ENUM (Environmental/Social/Governance),
  topic: STRING,
  metricName: STRING,
  metricCode: STRING UNIQUE,
  
  value: DECIMAL,
  unit: STRING,
  textValue: TEXT,
  dataType: ENUM,
  
  // Temporal
  reportingPeriod: STRING,
  startDate/endDate: DATEONLY,
  
  // Methodology
  methodology: TEXT,
  dataSource: STRING,
  dataQuality: ENUM,
  
  // Materiality
  isMaterial: BOOLEAN,
  impactMateriality: ENUM,
  financialMateriality: ENUM,
  
  // Assurance
  verified: BOOLEAN,
  assuranceLevel: ENUM,
  
  metadata: JSONB
}
```

##### GRIDisclosure
GRI-specific disclosures (Universal Standards 2021).
```javascript
{
  griStandard: STRING, // GRI 2, GRI 305, etc.
  disclosureNumber: STRING, // 2-1, 305-1, etc.
  disclosureTitle: STRING,
  
  responseType: ENUM,
  quantitativeValue: DECIMAL,
  qualitativeResponse: TEXT,
  
  isOmitted: BOOLEAN,
  omissionReason: ENUM,
  
  isAssured: BOOLEAN,
  assuranceLevel: ENUM
}
```

**Unique Constraint:** (companyId, griStandard, disclosureNumber, reportingYear)

---

### MongoDB Schemas (Document Store)

#### **AI/ML Models**

##### MLModelPrediction
ML model inference tracking and performance monitoring.
```javascript
{
  modelName: ENUM (emissions_forecasting, anomaly_detection, etc.),
  modelVersion: STRING,
  modelType: ENUM,
  
  companyId: STRING (UUID),
  
  inputData: MIXED,
  inputFeatures: [STRING],
  
  prediction: MIXED,
  confidence: NUMBER (0-1),
  probabilityDistribution: MAP,
  
  metrics: {
    accuracy, precision, recall, f1Score, rmse, mae
  },
  
  // Explainability
  featureImportance: MAP,
  shapValues: MAP,
  
  // Validation
  isValidated: BOOLEAN,
  actualValue: MIXED,
  error: NUMBER,
  isPredictionAccurate: BOOLEAN,
  
  userFeedback: {
    rating: NUMBER (1-5),
    comment: STRING
  },
  
  relatedEmissionIds: [STRING]
}
```

**Indexes:**
- (companyId, predictionDate DESC)
- (modelName, modelVersion, predictionDate DESC)
- (isValidated, isPredictionAccurate)
- TTL: 2 years

**Methods:**
- `calculateAccuracy()` - Compare prediction vs actual
- `getModelPerformance(modelName, version, companyId)` - Aggregate metrics

##### DocumentEmbedding
Vector embeddings for semantic search and RAG.
```javascript
{
  documentId: STRING UNIQUE,
  documentType: ENUM,
  
  companyId: STRING,
  
  filename: STRING,
  fullText: STRING,
  textChunks: [{
    chunkId, content, embedding: [NUMBER]
  }],
  
  // Vector representation
  embedding: [NUMBER], // e.g., 1536 dimensions
  embeddingModel: STRING, // text-embedding-ada-002
  embeddingDimensions: NUMBER,
  
  // AI-extracted data
  extractedData: {
    emissionsData, energyData, dates, locations,
    frameworks: [STRING],
    topics: [STRING],
    sdgs: [NUMBER]
  },
  
  // NLP analysis
  nlpAnalysis: {
    language: STRING,
    sentiment: { score, label },
    keyPhrases: [STRING],
    entities: [{ text, type, confidence }],
    topics: [{ topic, confidence }]
  },
  
  classification: {
    category, subcategory, confidence, tags
  },
  
  queryCount: NUMBER,
  lastAccessed: DATE,
  
  relatedDocuments: [{
    documentId, similarityScore
  }]
}
```

**Indexes:**
- (companyId, uploadedAt DESC)
- (documentType, status)
- Text index: (fullText, extractedData)
- TTL: 5 years if archived

**Methods:**
- `cosineSimilarity(otherEmbedding)` - Calculate similarity
- `semanticSearch(queryEmbedding, companyId, limit)` - Vector search
- `recordAccess()` - Increment query count

---

## Relationship Strategy

### Cascading Rules

#### CASCADE (Delete children)
- Company deletion → All company data
- Location deletion → Facilities at location
- Facility deletion → Data associated with facility

#### RESTRICT (Prevent deletion)
- User deletion → If user created emissions/reports
- Prevents data loss from accidental user deletion

#### SET NULL (Keep record, remove reference)
- Location deletion → Emissions keep data, location becomes NULL
- Maintains historical data integrity

### Unique Constraints

#### Natural Keys
```sql
-- Prevent duplicate GRI disclosures per company/year
UNIQUE (companyId, griStandard, disclosureNumber, reportingYear)

-- Prevent duplicate location codes
UNIQUE (code) WHERE code IS NOT NULL

-- Prevent duplicate metric codes
UNIQUE (metricCode)
```

#### Composite Keys
```sql
-- Time-series data (one record per entity/period)
UNIQUE (facilityId, meterNumber, readingDate)
UNIQUE (companyId, reportingPeriod, framework, metricCode)
```

---

## Indexing Strategy

### 1. Primary Lookups
All foreign keys indexed automatically

### 2. Time-Series Queries
```sql
INDEX (companyId, emissionDate DESC)
INDEX (companyId, reportingYear, reportingMonth)
```

### 3. Categorization
```sql
INDEX (scope, category, subcategory)
INDEX (framework, pillar, topic)
```

### 4. Status and Workflow
```sql
INDEX (status)
INDEX (verified)
INDEX (dataQuality)
```

### 5. Composite for Common Queries
```sql
INDEX (companyId, scope, emissionDate)
INDEX (companyId, locationId, reportingYear)
INDEX (companyId, energyType, reportingYear, status)
```

### 6. Partial Indexes (Performance)
```sql
-- Only index recent verified data (90% of queries)
INDEX (companyId, emissionDate, co2e)
WHERE verified = true
  AND status = 'approved'
  AND emissionDate >= NOW() - INTERVAL '2 years'
```

### 7. JSONB Indexes
```sql
CREATE INDEX idx_metadata_gin ON ghg_emissions USING GIN (metadata)
-- Enables fast queries: WHERE metadata @> '{"vehicle_type": "van"}'
```

### 8. Full-Text Search (PostgreSQL)
```sql
CREATE INDEX idx_emission_search ON ghg_emissions
USING GIN (to_tsvector('english', description))
```

---

## Performance Optimization

### Database Connection Pooling

#### PostgreSQL (Sequelize)
```javascript
pool: {
  max: 20,        // Max connections for concurrent analytics
  min: 5,         // Keep warm connections
  acquire: 60000, // 60s timeout
  idle: 10000,    // 10s before release
  evict: 1000     // Check every 1s
}
```

#### MongoDB (Mongoose)
```javascript
maxPoolSize: 50,
minPoolSize: 10,
serverSelectionTimeoutMS: 30000,
readPreference: 'primaryPreferred', // Use secondaries for reads
```

### Read Replicas
```javascript
replication: {
  read: [{ host: 'read-replica-1' }],
  write: { host: 'master' }
}
```

Heavy analytics queries route to replicas automatically.

### Query Optimization

#### Sequelize Scopes
```javascript
// Pre-defined efficient queries
GHGEmission.scope('verified', 'currentYear').findAll()
```

#### Eager Loading
```javascript
// Single query with JOIN instead of N+1
await Company.findAll({
  include: [{
    model: Location,
    include: [Facility]
  }]
})
```

#### Raw Queries for Analytics
```javascript
sequelize.query(`
  SELECT 
    scope,
    SUM(co2e) as total,
    COUNT(*) as count
  FROM ghg_emissions
  WHERE company_id = ? AND reporting_year = ?
  GROUP BY scope
`, {
  replacements: [companyId, year],
  type: QueryTypes.SELECT
})
```

---

## Data Quality & Governance

### Audit Trails
All critical models have:
```javascript
{
  timestamps: true,     // createdAt, updatedAt
  paranoid: true,       // deletedAt (soft delete)
  version: true,        // Optimistic locking
}
```

### Verification Workflow
```
draft → submitted → (reviewed) → approved/rejected
```

Fields:
- `status: ENUM`
- `reviewedBy: UUID`
- `reviewedAt: DATE`
- `verified: BOOLEAN`

### Data Lineage
```javascript
{
  dataSource: ENUM,
  sourceDocumentId: STRING,
  importBatchId: UUID,
  calculationMetadata: JSONB
}
```

Track origin and transformations of every data point.

### Validation Rules
```javascript
validate: {
  min: 0,
  max: 100,
  isEmail: true,
  custom: function(value) {
    if (value < 0) throw new Error('Must be positive')
  }
}
```

---

## AI/ML Integration Patterns

### 1. Anomaly Detection Pipeline
```
Energy Data → ML Model → Anomaly Score → Flag in DB
```

Fields in `EnergyConsumption`:
- `isAnomaly: BOOLEAN`
- `anomalyScore: DECIMAL`
- `anomalyReason: TEXT`

### 2. Emissions Forecasting
```
Historical Emissions → Time Series Model → Future Predictions → MongoDB
```

Stored in `MLModelPrediction`:
- Input: Past 12 months of emissions
- Output: Next 3/6/12 months forecast
- Validation: Compare prediction to actual when available

### 3. Document Intelligence
```
Upload PDF → Extract Text → Generate Embedding → Store in MongoDB
Query → Generate Query Embedding → Cosine Similarity Search → Return Relevant Docs
```

Flow:
1. User uploads sustainability report
2. OCR extracts text
3. OpenAI generates embedding (1536 dimensions)
4. Store in `DocumentEmbedding`
5. Extract ESG data using NLP
6. Link to `ESGMetric` records

### 4. Semantic Search
```javascript
// Query: "What are our Scope 3 emissions from business travel?"
const queryEmbedding = await openai.embeddings.create({
  input: query,
  model: 'text-embedding-ada-002'
})

const docs = await DocumentEmbedding.semanticSearch(
  queryEmbedding.data[0].embedding,
  companyId,
  limit: 10
)
```

---

## API Layer Design

### RESTful Principles
```
GET    /api/emissions              // List
GET    /api/emissions/:id          // Read
POST   /api/emissions              // Create
PUT    /api/emissions/:id          // Update
DELETE /api/emissions/:id          // Delete
```

### Nested Resources
```
GET /api/companies/:companyId/emissions
GET /api/locations/:locationId/facilities
GET /api/facilities/:facilityId/energy
```

### Query Parameters
```
GET /api/emissions?
  scope=Scope+1&
  reportingYear=2024&
  status=approved&
  limit=100&
  offset=0&
  sortBy=emissionDate&
  order=desc
```

### Bulk Operations
```
POST /api/emissions/bulk
{
  "emissions": [...],
  "batchId": "uuid"
}
```

### Analytics Endpoints
```
GET /api/analytics/emissions/summary?year=2024
GET /api/analytics/energy/trends?
  startDate=2024-01-01&
  endDate=2024-12-31&
  groupBy=month
```

---

## Migration Strategy

### Sequelize Migrations
```bash
# Generate migration
npx sequelize-cli migration:generate --name add-ghg-emissions

# Run migrations
npx sequelize-cli db:migrate

# Rollback
npx sequelize-cli db:migrate:undo
```

### Version Control
Each migration file:
```javascript
'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ghg_emissions', {
      // Schema definition
    })
    
    // Add indexes
    await queryInterface.addIndex('ghg_emissions', ['company_id', 'emission_date'])
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ghg_emissions')
  }
}
```

### Data Migration
```javascript
// Migrate from old Emission to new GHGEmission
up: async (queryInterface, Sequelize) => {
  const emissions = await queryInterface.sequelize.query(
    'SELECT * FROM emissions',
    { type: Sequelize.QueryTypes.SELECT }
  )
  
  const ghgEmissions = emissions.map(e => ({
    // Map old schema to new
    co2e: e.calculatedEmissions,
    activityData: e.activityData,
    // ...
  }))
  
  await queryInterface.bulkInsert('ghg_emissions', ghgEmissions)
}
```

---

## Best Practices

### 1. Never Store Calculated Data
❌ Bad:
```javascript
{
  consumption: 1000,
  cost: 150, // Could become out of sync
  unitCost: 0.15
}
```

✅ Good:
```javascript
{
  consumption: 1000,
  unitCost: 0.15
  // Calculate cost on read: consumption * unitCost
}

// Or use virtual field:
EnergyConsumption.virtual('cost').get(function() {
  return this.consumption * this.unitCost
})
```

### 2. Use Transactions
```javascript
const t = await sequelize.transaction()

try {
  await GHGEmission.create(emission, { transaction: t })
  await ActivityLog.create(log, { transaction: t })
  
  await t.commit()
} catch (error) {
  await t.rollback()
  throw error
}
```

### 3. Validate Before Save
```javascript
GHGEmission.beforeValidate((emission) => {
  // Normalize units
  if (emission.activityUnit === 'MWh') {
    emission.activityData *= 1000
    emission.activityUnit = 'kWh'
  }
})
```

### 4. Use Hooks for Automation
```javascript
GHGEmission.beforeCreate((emission) => {
  // Auto-calculate emissions
  emission.co2e = emission.activityData * emission.emissionFactorValue
})

User.beforeSave((user) => {
  // Auto-hash password
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 10)
  }
})
```

### 5. Paginate Large Result Sets
```javascript
const { count, rows } = await GHGEmission.findAndCountAll({
  where: { companyId },
  limit: 100,
  offset: (page - 1) * 100,
  order: [['emissionDate', 'DESC']]
})

return {
  data: rows,
  pagination: {
    total: count,
    page,
    pages: Math.ceil(count / 100)
  }
}
```

---

## Security Considerations

### 1. Input Validation
```javascript
const { body } = require('express-validator')

router.post('/emissions', [
  body('co2e').isFloat({ min: 0 }).withMessage('Must be positive'),
  body('scope').isIn(['Scope 1', 'Scope 2', 'Scope 3']),
  body('emissionDate').isISO8601().toDate()
], async (req, res) => {
  // ...
})
```

### 2. SQL Injection Prevention
Sequelize parameterizes queries automatically:
```javascript
// Safe - uses parameterized query
await GHGEmission.findAll({
  where: { companyId: req.params.id }
})

// Also safe - manual parameterization
await sequelize.query(
  'SELECT * FROM emissions WHERE company_id = ?',
  {
    replacements: [req.params.id],
    type: QueryTypes.SELECT
  }
)
```

### 3. Row-Level Security
```javascript
// Middleware to scope queries to user's company
const scopeToCompany = (req, res, next) => {
  req.companyId = req.user.companyId
  next()
}

// Apply to all emissions queries
router.use('/emissions', scopeToCompany)

router.get('/emissions', async (req, res) => {
  const emissions = await GHGEmission.findAll({
    where: { companyId: req.companyId } // Enforced at middleware level
  })
})
```

### 4. Sensitive Data
```javascript
// Exclude password from all queries
User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get())
  delete values.password
  return values
}
```

---

## Monitoring & Observability

### Query Performance Logging
```javascript
// Enable in development
sequelize: {
  logging: console.log,
  benchmark: true
}

// Output:
// Executing: SELECT * FROM emissions WHERE company_id = ?
// Elapsed time: 23ms
```

### Slow Query Alerting
```javascript
const { QueryTypes } = require('sequelize')

sequelize.addHook('beforeQuery', (options) => {
  options.startTime = Date.now()
})

sequelize.addHook('afterQuery', (options) => {
  const duration = Date.now() - options.startTime
  
  if (duration > 1000) {
    logger.warn('Slow query detected', {
      sql: options.sql,
      duration,
      type: options.type
    })
  }
})
```

### Database Health Checks
```javascript
app.get('/health/database', async (req, res) => {
  try {
    await sequelize.authenticate()
    await mongoose.connection.db.admin().ping()
    
    res.json({
      postgres: 'healthy',
      mongodb: 'healthy',
      uptime: process.uptime()
    })
  } catch (error) {
    res.status(503).json({ error: 'Database unhealthy' })
  }
})
```

---

## Testing Strategy

### Unit Tests
```javascript
describe('GHGEmission Model', () => {
  it('calculates total emissions correctly', () => {
    const emission = GHGEmission.build({
      activityData: 100,
      emissionFactorValue: 2.5
    })
    
    expect(emission.calculateEmissions()).toBe(250)
  })
})
```

### Integration Tests
```javascript
describe('Emissions API', () => {
  it('creates emission with cascade to audit log', async () => {
    const response = await request(app)
      .post('/api/emissions')
      .send(validEmission)
      .expect(201)
    
    const log = await ActivityLog.findOne({
      relatedId: response.body.id
    })
    
    expect(log).toBeDefined()
  })
})
```

---

## Future Enhancements

### 1. TimescaleDB for Time-Series
Migrate time-series tables (energy, emissions) to TimescaleDB for:
- Automatic partitioning by time
- Continuous aggregates
- Compression (90% storage savings)

### 2. pgvector for Semantic Search
Add PostgreSQL extension for vector similarity:
```sql
CREATE EXTENSION vector;
ALTER TABLE documents ADD COLUMN embedding vector(1536);
CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops);
```

### 3. GraphQL API
Add GraphQL layer for flexible querying:
```graphql
query {
  company(id: "uuid") {
    name
    locations {
      name
      emissions(year: 2024) {
        scope
        co2e
      }
    }
  }
}
```

### 4. Event Sourcing
Track all state changes for full audit trail:
```javascript
{
  eventType: 'EmissionCreated',
  aggregateId: 'emission-uuid',
  data: { /* snapshot */ },
  metadata: { userId, timestamp }
}
```

---

## Summary

CarbonDepict backend provides:

✅ **Enterprise-grade** relational + document databases
✅ **Optimized for analytics** with comprehensive indexing
✅ **AI/ML ready** with vector embeddings and prediction tracking
✅ **Data quality** through verification workflows
✅ **Prevent duplication** via unique constraints
✅ **Audit trail** with soft deletes and versioning
✅ **Scalable** with connection pooling and read replicas
✅ **Industry standards** aligned with GHG Protocol, GRI, TCFD

This architecture supports current needs and scales to enterprise requirements.
