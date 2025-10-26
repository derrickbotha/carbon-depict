# CarbonDepict Backend Server

Enterprise-grade backend for carbon emissions tracking, ESG reporting, and AI-powered sustainability analytics.

## 🏗️ Architecture

**MongoDB-First Strategy:**
- **MongoDB**: Primary database for all application data (users, companies, emissions, ESG metrics, AI/ML data)
- Flexible schema design for rapid feature development
- Built-in support for complex nested structures and arrays

**Technology Stack:**
- Node.js 18+ with Express 4.18
- Mongoose 8.0 (MongoDB ODM)
- JWT authentication with bcrypt
- Express validation & rate limiting
- Docker & Docker Compose ready

## 📊 Database Models

### MongoDB Models

#### Core Organization
- **Company** - Root organizational entity
- **User** - User accounts with RBAC
- **Location** - Physical locations (hierarchical: HQ → Regional → Branch)
- **Facility** - Buildings/assets at locations

#### Environmental Data
- **GHGEmission** - Comprehensive GHG tracking (Scope 1/2/3, all 7 GHGs)
- **ESGMetric** - Multi-framework metrics (GRI, TCFD, CSRD, CDP, SDG)
- **GRIDisclosure** - GRI-specific disclosures

#### AI/ML
- **MLModelPrediction** - ML inference tracking and monitoring
- **DocumentEmbedding** - Vector embeddings for semantic search
- **AIInference** - Legacy AI inference data

#### Supporting
- **EmissionFactor** - Emission factor database
- **ActivityLog** - Audit logging with TTL
- **FrameworkTemplate** - Framework questionnaires
- **StakeholderEngagement** - Stakeholder data
- **SupplierAssessment** - Supply chain assessments
- **IncidentLog** - Incident tracking

## 🔑 Key Features

### Data Quality & Governance
✅ **Verification Workflows** - Draft → Submitted → Approved
✅ **Audit Trails** - Timestamps, soft deletes, versioning
✅ **Data Lineage** - Track origin and transformations
✅ **Multi-level Assurance** - Limited/Reasonable assurance tracking

### Performance Optimization
✅ **Comprehensive Indexes** - Optimized for common query patterns
✅ **Connection Pooling** - Configurable MongoDB connection pool (default 10 max)
✅ **Partial Indexes** - Index only recent/verified data
✅ **Compound Indexes** - Multi-field indexes for complex queries
✅ **TTL Indexes** - Auto-expire old logs (ActivityLog: 2 years)

### Prevent Data Duplication
✅ **Unique Constraints** - MongoDB unique indexes on natural keys
✅ **Compound Unique Indexes** - Prevent duplicate time-series data
✅ **Schema Validation** - Mongoose schema enforcement

### AI/ML Integration
✅ **Semantic Search** - Vector similarity with cosine distance
✅ **Document Intelligence** - NLP, OCR, entity extraction
✅ **Anomaly Detection** - Flag unusual energy consumption
✅ **Emissions Forecasting** - Time-series predictions
✅ **Explainable AI** - SHAP values, feature importance

### Relationships & References
✅ **ObjectId References** - Proper foreign key relationships
✅ **Population** - Mongoose virtual population for joins
✅ **Hierarchical Structures** - Self-referencing documents
✅ **Embedded Documents** - For one-to-many child data

## 📁 Project Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   └── mongodb/             # Mongoose schemas
│       ├── index.js         # Model exports
│       ├── Company.js
│       ├── User.js
│       ├── Location.js
│       ├── Facility.js
│       ├── GHGEmission.js   # ⭐ Primary emissions model
│       ├── ESGMetric.js
│       ├── GRIDisclosure.js
│       ├── MLModelPrediction.js
│       ├── DocumentEmbedding.js
│       ├── EmissionFactor.js
│       ├── ActivityLog.js
│       └── ... (others)
├── routes/                  # Express routes
├── services/                # Business logic layer
├── middleware/              # Auth, validation, etc.
├── seeders/                 # Seed data
├── scripts/                 # Utility scripts
│   ├── createTestUser.js    # Create test user
│   └── seed.js              # Seed emission factors
├── docs/                    # Documentation
├── index.js                 # Server entry point
├── package.json
└── Dockerfile               # Docker configuration
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Start Database (Docker)
```bash
docker-compose up -d mongodb
```

### 4. Seed Data (Optional)
```bash
node scripts/seed.js
```

### 5. Create Admin User
```bash
node setup-database.js
# Or customize:
# CARBON_ADMIN_EMAIL=admin@company.com CARBON_ADMIN_PASSWORD=secure123 node create-db-user.js
```

### 6. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

## 🔧 Environment Variables

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/carbondepict

# Connection Pooling
MONGO_POOL_MAX=10
MONGO_POOL_MIN=2

# App
NODE_ENV=development
PORT=5500
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Redis (for queues)
REDIS_HOST=localhost
REDIS_PORT=6379

# Email
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password

# API Keys (for AI/ML)
OPENAI_API_KEY=sk-...
```

## 📚 API Examples

### Create Emission
```javascript
POST /api/emissions
{
  "companyId": "ObjectId",
  "scope": "Scope 1",
  "category": "fuels",
  "subcategory": "natural-gas",
  "activityData": 1000,
  "activityUnit": "m3",
  "emissionFactorValue": 2.034,
  "emissionFactorUnit": "kgCO2e/m3",
  "emissionDate": "2024-01-15",
  "reportingYear": 2024
}
```

### Query Emissions
```javascript
GET /api/emissions?
  companyId=ObjectId&
  reportingYear=2024&
  scope=Scope+1&
  status=approved&
  limit=100&
  offset=0
```

### Analytics Endpoint
```javascript
GET /api/analytics/emissions/summary?
  companyId=ObjectId&
  year=2024&
  groupBy=scope
```

### Semantic Document Search
```javascript
POST /api/documents/search
{
  "query": "What are our Scope 3 emissions from business travel?",
  "companyId": "ObjectId",
  "limit": 10
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- models/GHGEmission.test.js
```

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [BACKEND_ARCHITECTURE.md](./docs/BACKEND_ARCHITECTURE.md) | Complete architecture guide (29,000 words) |
| [QUICK_REFERENCE.md](./docs/QUICK_REFERENCE.md) | Code examples and common queries |
| [DATA_MODEL_VISUAL.md](./docs/DATA_MODEL_VISUAL.md) | Visual ERD and relationship diagrams |

## 🔍 Database Management

### Database Utilities
```bash
# Test MongoDB connection
node test-db.js

# Check user
node check-user.js user@example.com

# Verify email
node verify-email.js user@example.com

# Create/update user
node create-user.js --email=user@example.com --password=pass123 --company=MyCompany

# Backup MongoDB
mongodump --db carbondepict --out ./backup

# Restore MongoDB
mongorestore --db carbondepict ./backup/carbondepict
```

### Performance Monitoring
```javascript
// Check collection stats
db.ghgemissions.stats()

// Check index usage
db.ghgemissions.aggregate([
  { $indexStats: {} }
])

// Explain query plan
db.ghgemissions.find({ companyId: "..." }).explain("executionStats")
```

## 🔐 Security Best Practices

✅ **Input Validation** - Express-validator on all endpoints
✅ **NoSQL Injection Prevention** - Mongoose schema validation
✅ **Password Hashing** - bcrypt with salt rounds 10
✅ **JWT Authentication** - Secure token-based auth
✅ **Rate Limiting** - 100 requests per 15 minutes
✅ **Helmet.js** - Security headers
✅ **CORS** - Configured for frontend domains
✅ **Row-Level Security** - Scope queries to user's company

## 🚀 Performance Tips

1. **Use Indexes** - All foreign keys and common filters indexed
2. **Paginate Results** - Never fetch all records (use limit/skip)
3. **Select Specific Fields** - Use `.select()` to pick fields
4. **Eager Load Wisely** - Only `.populate()` necessary refs
5. **Cache Hot Data** - Use Redis for frequently accessed data
6. **Lean Queries** - Use `.lean()` for read-only data
7. **Batch Operations** - Use `insertMany` for bulk inserts
8. **Monitor Slow Queries** - Enable profiling in development

## 🐳 Docker Deployment

```bash
# Build image
docker build -t carbondepict-server .

# Run with docker-compose (includes MongoDB + Redis)
docker-compose up -d

# View logs
docker-compose logs -f server

# Run setup in container
docker-compose exec server node setup-database.js
```

## 📊 Analytics Examples

### Emissions by Scope
```javascript
const summary = await GHGEmission.aggregate([
  { $match: { companyId: mongoose.Types.ObjectId(companyId), reportingYear: 2024 } },
  {
    $group: {
      _id: '$scope',
      total: { $sum: '$co2e' },
      count: { $sum: 1 }
    }
  }
])
```

### Energy Trends (if using time-series energy data)
```javascript
const trends = await EnergyConsumption.aggregate([
  {
    $match: {
      companyId: mongoose.Types.ObjectId(companyId),
      reportingYear: 2024,
      energyType: 'electricity'
    }
  },
  {
    $group: {
      _id: '$reportingMonth',
      total: { $sum: '$consumptionKwh' }
    }
  },
  { $sort: { _id: 1 } }
])
```

## 🤖 AI/ML Features

### Anomaly Detection
Automatically flags unusual energy consumption patterns.

### Emissions Forecasting
Time-series predictions for next 3/6/12 months.

### Document Intelligence
- Extract emissions data from PDFs
- NLP for sustainability reports
- Semantic search across documents

### Explainable AI
- SHAP values for model transparency
- Feature importance tracking
- Confidence scores

## 🛠️ Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-model
   ```

2. **Create Mongoose Schema**
   ```javascript
   // server/models/mongodb/NewModel.js
   const mongoose = require('mongoose')
   
   const newModelSchema = new mongoose.Schema({
     // fields
   }, { timestamps: true })
   
   module.exports = mongoose.model('NewModel', newModelSchema)
   ```

3. **Export Model**
   ```javascript
   // server/models/mongodb/index.js
   const NewModel = require('./NewModel')
   module.exports = { ...existing, NewModel }
   ```

4. **Write Tests**
   ```javascript
   // server/tests/models/NewModel.test.js
   ```

5. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: Add NewModel schema"
   git push origin feature/new-model
   ```

## 📞 Support & Contributing

- **Issues**: GitHub Issues
- **Documentation**: `/server/docs/`
- **Code Style**: ESLint + Prettier
- **Commit Convention**: Conventional Commits

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for enterprise sustainability reporting**

🌍 Track emissions | 📊 ESG metrics | 🤖 AI-powered insights | 🔒 Enterprise-grade security
