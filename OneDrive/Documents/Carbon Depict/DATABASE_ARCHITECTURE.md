# CarbonDepict - Hybrid Database Architecture

## 🏗️ Architecture Overview

CarbonDepict uses a **hybrid database architecture** combining:
- **PostgreSQL** for structured, relational data
- **MongoDB** for flexible, non-relational data

This approach leverages the strengths of both databases:
- PostgreSQL: ACID compliance, complex queries, data integrity
- MongoDB: Flexibility, versioning, document storage

## 📊 PostgreSQL (Relational Data)

**Host:** localhost:5432  
**Database:** carbondepict  
**ORM:** Sequelize

### Tables

#### 1. **Users**
Stores user accounts and authentication data.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  role ENUM('admin', 'manager', 'user'),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  email_verified BOOLEAN DEFAULT false,
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Relationships:**
- Many-to-One: User → Company
- One-to-Many: User → Emissions
- One-to-Many: User → Reports

#### 2. **Companies**
Stores organization/company information.

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  industry ENUM(...),
  region VARCHAR DEFAULT 'uk',
  address TEXT,
  country VARCHAR,
  size ENUM('small', 'medium', 'large', 'enterprise'),
  subscription ENUM('free', 'professional', 'enterprise'),
  subscription_valid_until TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  settings JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Relationships:**
- One-to-Many: Company → Users
- One-to-Many: Company → Emissions
- One-to-Many: Company → Reports

#### 3. **Emissions**
Stores individual emission entries with calculations.

```sql
CREATE TABLE emissions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  category VARCHAR NOT NULL,
  subcategory VARCHAR,
  scope ENUM('Scope 1', 'Scope 2', 'Scope 3'),
  activity_data DECIMAL(15,4),
  activity_unit VARCHAR,
  emission_factor DECIMAL(10,6),
  emission_factor_unit VARCHAR,
  calculated_emissions DECIMAL(15,4),
  emissions_unit VARCHAR DEFAULT 'kgCO2e',
  description TEXT,
  date DATE,
  metadata JSONB,
  source VARCHAR DEFAULT 'manual',
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Indexes:**
- userId
- companyId
- date
- category
- scope

#### 4. **Reports**
Stores generated emission reports.

```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  title VARCHAR,
  type ENUM('monthly', 'quarterly', 'annual', 'custom'),
  start_date DATE,
  end_date DATE,
  total_emissions DECIMAL(15,4),
  scope1 DECIMAL(15,4),
  scope2 DECIMAL(15,4),
  scope3 DECIMAL(15,4),
  category_breakdown JSONB,
  format ENUM('pdf', 'csv', 'json'),
  status ENUM('generating', 'ready', 'archived', 'failed'),
  file_path VARCHAR,
  file_size INTEGER,
  methodology TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 📦 MongoDB (Non-Relational Data)

**Host:** localhost:27017  
**Database:** carbondepict  
**ODM:** Mongoose

### Collections

#### 1. **emission_factors**
Stores DEFRA 2025 emission factors with versioning.

```javascript
{
  _id: ObjectId,
  category: String,           // fuels, electricity, transport, etc.
  subcategory: String,        // diesel, petrol, van-class-1, etc.
  name: String,               // Display name
  description: String,
  factor: Number,             // Emission factor value
  unit: String,               // kgCO2e/litre, kgCO2e/kWh, etc.
  scope: String,              // Scope 1, 2, or 3
  breakdown: {
    co2: Number,
    ch4: Number,
    n2o: Number,
    hfc: Number,
    pfc: Number,
    sf6: Number,
    nf3: Number
  },
  source: String,             // DEFRA 2025, IEA, custom
  sourceUrl: String,
  gwpVersion: String,         // AR5, AR6
  region: String,             // UK, US, EU, Asia, Africa
  country: String,
  version: String,            // 2024, 2025, 2026
  validFrom: Date,
  validTo: Date,
  isActive: Boolean,
  metadata: Mixed,            // Flexible additional data
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

**Why MongoDB?**
- Flexible schema for diverse emission factors
- Easy versioning (keep historical factors)
- Fast lookups by category/region
- Can store complex nested data

**Indexes:**
- { category, subcategory, isActive }
- { region, isActive }
- { version, isActive }
- { validFrom, validTo }

#### 2. **ai_inferences**
Stores AI inference history and results.

```javascript
{
  _id: ObjectId,
  userId: String,             // UUID from PostgreSQL
  companyId: String,
  inferenceType: String,      // vehicle, equipment, regional-factor
  query: String,              // User input
  context: Mixed,
  response: Mixed,            // AI response (flexible structure)
  confidence: Number,
  suggestions: [{
    value: String,
    label: String,
    confidence: Number
  }],
  aiProvider: String,         // grok, openai
  model: String,
  processingTime: Number,
  tokensUsed: Number,
  userFeedback: {
    helpful: Boolean,
    selectedSuggestion: String,
    comment: String
  },
  status: String,
  error: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Why MongoDB?**
- Flexible AI response structure (varies by model)
- Fast writes for logging
- Easy to query recent inferences
- Can store complex nested responses

#### 3. **activity_logs**
Audit trail and user activity logs.

```javascript
{
  _id: ObjectId,
  userId: String,
  companyId: String,
  action: String,             // emission.created, report.generated
  resource: String,           // emission, report, user
  resourceId: String,
  details: Mixed,
  previousState: Mixed,
  newState: Mixed,
  ipAddress: String,
  userAgent: String,
  status: String,
  error: String,
  createdAt: Date,
  updatedAt: Date
}
```

**TTL:** Logs auto-delete after 2 years

**Why MongoDB?**
- High write throughput for logs
- Flexible structure for different actions
- TTL indexes for automatic cleanup
- Easy to query by time range

---

## 🔗 Data Flow

### Emission Entry Flow
```
1. User submits emission data → Frontend (React)
2. POST /api/calculate → Backend (Express)
3. Query emission factor → MongoDB (emission_factors)
4. Calculate emissions → Business Logic
5. Store result → PostgreSQL (emissions table)
6. Log action → MongoDB (activity_logs)
7. Return response → Frontend
```

### AI Inference Flow
```
1. User enters vehicle description → Frontend
2. POST /api/ai/infer → Backend
3. Call AI service (Grok/OpenAI) → External API
4. Store inference → MongoDB (ai_inferences)
5. Query emission factor → MongoDB (emission_factors)
6. Return suggestion → Frontend
```

### Report Generation Flow
```
1. User requests report → Frontend
2. POST /api/reports/generate → Backend
3. Query emissions → PostgreSQL (emissions table)
4. Aggregate by scope/category → SQL queries
5. Generate PDF/CSV → jsPDF/csv-writer
6. Store report metadata → PostgreSQL (reports table)
7. Return download link → Frontend
```

---

## 🛠️ Setup Instructions

### 1. Install Databases

**PostgreSQL:**
```bash
# Windows (using Chocolatey)
choco install postgresql

# Or download from: https://www.postgresql.org/download/

# Create database
psql -U postgres
CREATE DATABASE carbondepict;
```

**MongoDB:**
```bash
# Windows (using Chocolatey)
choco install mongodb

# Or download from: https://www.mongodb.com/try/download/community

# Start MongoDB
mongod
```

### 2. Configure Environment

Create `server/.env`:
```env
PORT=5500

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=carbondepict
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password

# MongoDB
MONGODB_URI=mongodb://localhost:27017/carbondepict

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```

### 3. Install Dependencies

```bash
cd server
npm install
```

### 4. Seed Databases

```bash
# Seed DEFRA 2025 emission factors to MongoDB
node server/scripts/seed.js
```

### 5. Start Server

```bash
cd server
npm run dev
```

The server will:
- Connect to PostgreSQL (creates tables automatically)
- Connect to MongoDB
- Start on port 5500

---

## 📈 Data Models Summary

| Data Type | Database | Reason |
|-----------|----------|---------|
| Users | PostgreSQL | Relational, ACID, auth |
| Companies | PostgreSQL | Relational, integrity |
| Emissions | PostgreSQL | Structured, complex queries |
| Reports | PostgreSQL | Relational, aggregations |
| Emission Factors | MongoDB | Flexible, versioning |
| AI Inferences | MongoDB | Flexible responses |
| Activity Logs | MongoDB | High write, TTL |

---

## 🔒 Data Integrity

### PostgreSQL
- Foreign key constraints
- UUID primary keys
- Transactions for consistency
- Indexes for performance

### MongoDB
- Schema validation (Mongoose)
- Compound indexes
- TTL indexes for logs
- Versioning for factors

---

## 🚀 Scaling Considerations

### PostgreSQL
- Connection pooling (Sequelize)
- Read replicas for reporting
- Partitioning by date (future)

### MongoDB
- Sharding by companyId (future)
- Replica sets for HA
- Caching frequently accessed factors

---

## 📊 Query Examples

### PostgreSQL (Sequelize)
```javascript
// Get user's emissions for the month
const emissions = await Emission.findAll({
  where: {
    userId: '...',
    date: {
      [Op.gte]: startOfMonth,
      [Op.lte]: endOfMonth,
    },
  },
  include: [{ model: User }, { model: Company }],
})

// Aggregate emissions by scope
const totals = await Emission.findAll({
  where: { companyId: '...' },
  attributes: [
    'scope',
    [sequelize.fn('SUM', sequelize.col('calculatedEmissions')), 'total'],
  ],
  group: ['scope'],
})
```

### MongoDB (Mongoose)
```javascript
// Get current emission factor
const factor = await EmissionFactor.getCurrentFactor('fuels', 'diesel', 'UK')

// Get all factors for a category
const factors = await EmissionFactor.find({
  category: 'passenger-transport',
  isActive: true,
  region: 'UK',
})

// Log AI inference
await AIInference.create({
  userId: '...',
  inferenceType: 'vehicle',
  query: 'Toyota Hilux',
  response: {...},
})
```

---

## ✅ Migration Path

If you need to migrate existing data:

1. **Users/Companies**: Import CSV → PostgreSQL
2. **Emission Factors**: Run seed script
3. **Historical Emissions**: Bulk import with CSV parser

---

## 🔧 Maintenance

### Daily
- Monitor connection pools
- Check log volumes

### Weekly
- Review slow queries
- Update emission factors (if needed)

### Monthly
- Archive old reports
- Optimize indexes
- Review database sizes

---

**Status:** ✅ Database architecture designed and implemented  
**Next:** Start server and verify connections
