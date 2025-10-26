# CarbonDepict Backend - Quick Reference

## Database Connection
```javascript
const { sequelize, mongoose, connectDatabases } = require('./config/database')
await connectDatabases()
```

## Import Models
```javascript
// PostgreSQL
const {
  Company, User, Location, Facility,
  GHGEmission, EnergyConsumption, WasteManagement, WaterUsage,
  ESGMetric, ESGTarget, GRIDisclosure
} = require('./models/postgres')

// MongoDB
const {
  MLModelPrediction, DocumentEmbedding,
  EmissionFactor, ActivityLog
} = require('./models/mongodb')
```

## Common Queries

### Create Emission
```javascript
const emission = await GHGEmission.create({
  companyId: 'uuid',
  userId: 'uuid',
  locationId: 'uuid',
  scope: 'Scope 1',
  category: 'fuels',
  subcategory: 'natural-gas',
  activityData: 1000,
  activityUnit: 'm3',
  emissionFactorValue: 2.034,
  emissionFactorUnit: 'kgCO2e/m3',
  co2e: 2034,
  emissionDate: '2024-01-15',
  reportingYear: 2024,
  status: 'approved'
})
```

### Query with Filters
```javascript
const emissions = await GHGEmission.findAll({
  where: {
    companyId: 'uuid',
    reportingYear: 2024,
    scope: 'Scope 1',
    status: 'approved'
  },
  include: [
    { model: Location, as: 'location' },
    { model: Facility, as: 'facility' }
  ],
  order: [['emissionDate', 'DESC']],
  limit: 100
})
```

### Aggregate Emissions by Scope
```javascript
const summary = await GHGEmission.findAll({
  attributes: [
    'scope',
    [sequelize.fn('SUM', sequelize.col('co2e')), 'totalCO2e'],
    [sequelize.fn('COUNT', sequelize.col('id')), 'count']
  ],
  where: { companyId: 'uuid', reportingYear: 2024 },
  group: ['scope']
})
```

### Energy Time Series
```javascript
const energy = await EnergyConsumption.findAll({
  where: {
    facilityId: 'uuid',
    readingDate: {
      [Op.between]: ['2024-01-01', '2024-12-31']
    },
    energyType: 'electricity'
  },
  order: [['readingDate', 'ASC']]
})
```

### Create AI Prediction
```javascript
const prediction = await MLModelPrediction.create({
  modelName: 'emissions_forecasting',
  modelVersion: '2.0.0',
  companyId: 'uuid',
  inputData: { months: 12, scopeData: [...] },
  prediction: { next_month: 1250, confidence: 0.89 },
  confidence: 0.89,
  predictionDate: new Date(),
  targetDate: new Date('2024-02-01')
})
```

### Semantic Document Search
```javascript
const queryEmbedding = [...] // 1536-dim vector from OpenAI

const docs = await DocumentEmbedding.find({
  companyId: 'uuid',
  status: 'completed'
}).limit(50)

const results = docs
  .map(doc => ({
    doc,
    similarity: doc.cosineSimilarity(queryEmbedding)
  }))
  .sort((a, b) => b.similarity - a.similarity)
  .slice(0, 10)
```

## Relationships

### Company Hierarchy
```
Company
  ├── Users
  ├── Locations
  │     ├── Child Locations (hierarchical)
  │     └── Facilities
  │           ├── Emissions
  │           ├── Energy
  │           ├── Waste
  │           └── Water
  ├── Emissions
  ├── ESG Metrics
  └── Reports
```

### Access Patterns
```javascript
// Get company with all locations and facilities
const company = await Company.findByPk('uuid', {
  include: [{
    model: Location,
    as: 'locations',
    include: [{ model: Facility, as: 'facilities' }]
  }]
})

// Get location with parent
const location = await Location.findByPk('uuid', {
  include: [
    { model: Location, as: 'parentLocation' },
    { model: Location, as: 'childLocations' }
  ]
})

// Get emissions with all context
const emission = await GHGEmission.findByPk('uuid', {
  include: [
    { model: Company, as: 'company' },
    { model: Location, as: 'location' },
    { model: Facility, as: 'facility' },
    { model: User, as: 'creator' },
    { model: User, as: 'reviewer' }
  ]
})
```

## Validation Examples

### Before Save Hooks
```javascript
GHGEmission.beforeCreate(async (emission) => {
  // Auto-calculate if missing
  if (!emission.co2e) {
    emission.co2e = emission.activityData * emission.emissionFactorValue
  }
  
  // Validate scope/category alignment
  if (emission.scope === 'Scope 3' && !emission.scope3Category) {
    throw new Error('Scope 3 emissions require category')
  }
})
```

### Custom Validation
```javascript
const emission = new GHGEmission({
  // ... data
})

// Manual validation
await emission.validate()

// Catch validation errors
try {
  await emission.save()
} catch (error) {
  if (error.name === 'SequelizeValidationError') {
    console.log(error.errors.map(e => e.message))
  }
}
```

## Transactions
```javascript
const t = await sequelize.transaction()

try {
  const emission = await GHGEmission.create(emissionData, { transaction: t })
  
  await ActivityLog.create({
    action: 'created_emission',
    userId: 'uuid',
    resourceId: emission.id
  }, { transaction: t })
  
  await t.commit()
} catch (error) {
  await t.rollback()
  throw error
}
```

## Analytics Helpers

### Built-in Methods
```javascript
// Total emissions
const total = await GHGEmission.getTotalEmissions('companyId', {
  reportingYear: 2024,
  verified: true
})

// By scope
const byScope = await GHGEmission.getEmissionsByScope('companyId', 2024)

// Energy totals
const energy = await EnergyConsumption.getTotalConsumption('companyId', {
  reportingYear: 2024
})
```

### Raw SQL for Complex Analytics
```javascript
const results = await sequelize.query(`
  SELECT 
    l.name as location,
    e.scope,
    SUM(e.co2e) as total_emissions,
    COUNT(*) as record_count
  FROM ghg_emissions e
  JOIN locations l ON e.location_id = l.id
  WHERE e.company_id = :companyId
    AND e.reporting_year = :year
    AND e.status = 'approved'
  GROUP BY l.name, e.scope
  ORDER BY total_emissions DESC
`, {
  replacements: { companyId: 'uuid', year: 2024 },
  type: QueryTypes.SELECT
})
```

## Migration Commands
```bash
# Create migration
npx sequelize-cli migration:generate --name add-new-table

# Run migrations
npx sequelize-cli db:migrate

# Rollback
npx sequelize-cli db:migrate:undo

# Rollback all
npx sequelize-cli db:migrate:undo:all

# Seed database
npx sequelize-cli db:seed:all
```

## Environment Variables
```env
# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=carbondepict
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_SSL=false

# Read replica for analytics
POSTGRES_READ_HOST=read-replica.example.com

# Connection pool
DB_POOL_MAX=20
DB_POOL_MIN=5
DB_STATEMENT_TIMEOUT=60000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/carbondepict
MONGO_POOL_MAX=50
MONGO_POOL_MIN=10
MONGO_READ_PREFERENCE=primaryPreferred
MONGO_WRITE_CONCERN=majority
```

## Index Management
```sql
-- Check index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Find unused indexes
SELECT 
  schemaname,
  tablename,
  indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND schemaname = 'public'
  AND indexname NOT LIKE '%_pkey';

-- Table sizes
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Common Patterns

### Pagination
```javascript
const page = 1
const limit = 100
const offset = (page - 1) * limit

const { count, rows } = await GHGEmission.findAndCountAll({
  where: { companyId: 'uuid' },
  limit,
  offset,
  order: [['emissionDate', 'DESC']]
})

return {
  data: rows,
  pagination: {
    total: count,
    page,
    pages: Math.ceil(count / limit),
    hasNext: page * limit < count
  }
}
```

### Soft Delete Recovery
```javascript
// Include deleted records
const all = await GHGEmission.findAll({
  where: { companyId: 'uuid' },
  paranoid: false // Include soft-deleted
})

// Restore deleted record
const emission = await GHGEmission.findByPk('uuid', { paranoid: false })
await emission.restore()
```

### Bulk Operations
```javascript
// Bulk create with validation
const emissions = await GHGEmission.bulkCreate(emissionsArray, {
  validate: true,
  returning: true // Return created records
})

// Bulk update
await GHGEmission.update(
  { status: 'approved' },
  { where: { importBatchId: 'uuid' } }
)

// Bulk delete (soft)
await GHGEmission.destroy({
  where: { status: 'draft', createdAt: { [Op.lt]: oldDate } }
})
```

## Error Handling
```javascript
try {
  await GHGEmission.create(data)
} catch (error) {
  if (error.name === 'SequelizeValidationError') {
    // Validation failed
    const messages = error.errors.map(e => ({
      field: e.path,
      message: e.message
    }))
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    // Duplicate entry
    console.log('Already exists:', error.fields)
  } else if (error.name === 'SequelizeForeignKeyConstraintError') {
    // Invalid foreign key
    console.log('Referenced record not found')
  }
}
```

## Performance Tips

1. **Use indexes** - Check execution plans with `EXPLAIN ANALYZE`
2. **Limit results** - Always paginate large datasets
3. **Select specific fields** - `attributes: ['id', 'name']` instead of `*`
4. **Eager load wisely** - Only include necessary associations
5. **Cache frequent queries** - Use Redis for hot data
6. **Use raw queries** - For complex analytics bypassing ORM overhead
7. **Batch operations** - Use `bulkCreate` instead of individual `create`
8. **Connection pooling** - Already configured, reuse connections
9. **Read replicas** - Route analytics to replicas automatically
10. **Monitor slow queries** - Enable benchmarking in development

## Testing

### Model Tests
```javascript
const { GHGEmission } = require('../models/postgres')

describe('GHGEmission Model', () => {
  beforeEach(async () => {
    await GHGEmission.destroy({ where: {}, force: true })
  })
  
  it('calculates CO2e correctly', async () => {
    const emission = await GHGEmission.create({
      activityData: 100,
      emissionFactorValue: 2.5,
      // ... required fields
    })
    
    expect(emission.co2e).toBe(250)
  })
  
  it('requires scope', async () => {
    await expect(
      GHGEmission.create({ /* missing scope */ })
    ).rejects.toThrow()
  })
})
```

---

**For full documentation, see:** `server/docs/BACKEND_ARCHITECTURE.md`
