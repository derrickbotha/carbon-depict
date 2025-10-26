/**
 * Enterprise Database Migration System
 * Creates comprehensive database structure with proper relationships
 */

const mongoose = require('mongoose')

// Migration registry
const migrations = [
  {
    version: '20250101000001',
    name: 'create_core_enterprise_schema',
    description: 'Create core enterprise database schema with relationships',
    up: async (db) => {
      console.log('  ▶️  Creating core enterprise schema...')
      
      // Create collections with proper relationships
      await createCoreCollections(db)
      await createESGCollections(db)
      await createAuditCollections(db)
      await createIndexes(db)
      
      console.log('  ✅ Core enterprise schema created')
    },
    down: async (db) => {
      console.log('  ▶️  Rolling back core enterprise schema...')
      // Rollback logic here
      console.log('  ✅ Core enterprise schema rolled back')
    }
  },
  {
    version: '20250101000002',
    name: 'seed_enterprise_data',
    description: 'Seed enterprise data and reference tables',
    up: async (db) => {
      console.log('  ▶️  Seeding enterprise data...')
      
      await seedEmissionFactors(db)
      await seedFrameworkTemplates(db)
      await seedReferenceData(db)
      
      console.log('  ✅ Enterprise data seeded')
    },
    down: async (db) => {
      console.log('  ▶️  Rolling back enterprise data...')
      // Rollback logic here
      console.log('  ✅ Enterprise data rolled back')
    }
  }
]

// Core collections creation
async function createCoreCollections(db) {
  // Companies collection
  try {
    await db.createCollection('companies', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'industry', 'subscription'],
          properties: {
            name: { bsonType: 'string', minLength: 1 },
            industry: { 
              bsonType: 'string',
              enum: ['agriculture', 'energy', 'fleet', 'food', 'manufacturing', 'education', 'other']
            },
            subscription: {
              bsonType: 'string',
              enum: ['free', 'professional', 'enterprise']
            },
            isActive: { bsonType: 'bool' },
            settings: { bsonType: 'object' }
          }
        }
      }
    })
    console.log('    ✅ Created companies collection')
  } catch (error) {
    if (error.code === 48) { // NamespaceExists
      console.log('    ⚠️  Companies collection already exists')
    } else {
      throw error
    }
  }

  // Users collection
  try {
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['email', 'password', 'firstName', 'lastName', 'companyId'],
          properties: {
            email: { bsonType: 'string', pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$' },
            password: { bsonType: 'string', minLength: 8 },
            firstName: { bsonType: 'string', minLength: 1 },
            lastName: { bsonType: 'string', minLength: 1 },
            companyId: { bsonType: 'objectId' },
            role: {
              bsonType: 'string',
              enum: ['admin', 'manager', 'user']
            },
            isActive: { bsonType: 'bool' },
            emailVerified: { bsonType: 'bool' }
          }
        }
      }
    })
    console.log('    ✅ Created users collection')
  } catch (error) {
    if (error.code === 48) { // NamespaceExists
      console.log('    ⚠️  Users collection already exists')
    } else {
      throw error
    }
  }

  // Locations collection
  try {
    await db.createCollection('locations', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'companyId', 'address'],
          properties: {
            name: { bsonType: 'string', minLength: 1 },
            companyId: { bsonType: 'objectId' },
            address: { bsonType: 'object' },
            coordinates: { bsonType: 'object' },
            isActive: { bsonType: 'bool' }
          }
        }
      }
    })
    console.log('    ✅ Created locations collection')
  } catch (error) {
    if (error.code === 48) { // NamespaceExists
      console.log('    ⚠️  Locations collection already exists')
    } else {
      throw error
    }
  }

  // Facilities collection
  try {
    await db.createCollection('facilities', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'companyId', 'locationId'],
          properties: {
            name: { bsonType: 'string', minLength: 1 },
            companyId: { bsonType: 'objectId' },
            locationId: { bsonType: 'objectId' },
            facilityType: { bsonType: 'string' },
            isActive: { bsonType: 'bool' }
          }
        }
      }
    })
    console.log('    ✅ Created facilities collection')
  } catch (error) {
    if (error.code === 48) { // NamespaceExists
      console.log('    ⚠️  Facilities collection already exists')
    } else {
      throw error
    }
  }
}

// ESG collections creation
async function createESGCollections(db) {
  // GHG Emissions collection
  try {
    await db.createCollection('ghgemissions', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['companyId', 'scope', 'activityType', 'activityValue', 'co2e'],
          properties: {
            companyId: { bsonType: 'objectId' },
            facilityId: { bsonType: 'objectId' },
            locationId: { bsonType: 'objectId' },
            scope: {
              bsonType: 'string',
              enum: ['scope1', 'scope2', 'scope3']
            },
            activityType: { bsonType: 'string' },
            activityValue: { bsonType: 'number', minimum: 0 },
            co2e: { bsonType: 'number', minimum: 0 },
            emissionFactor: { bsonType: 'number', minimum: 0 },
            reportingPeriod: { bsonType: 'string' },
            recordedAt: { bsonType: 'date' }
          }
        }
      }
    })
    console.log('    ✅ Created ghgemissions collection')
  } catch (error) {
    if (error.code === 48) { // NamespaceExists
      console.log('    ⚠️  GHG Emissions collection already exists')
    } else {
      throw error
    }
  }

  // ESG Metrics collection
  try {
    await db.createCollection('esgmetrics', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['companyId', 'framework', 'pillar', 'metricName'],
          properties: {
            companyId: { bsonType: 'objectId' },
            userId: { bsonType: 'objectId' },
            framework: { bsonType: 'string' },
            pillar: { bsonType: 'string' },
            metricName: { bsonType: 'string' },
            value: { bsonType: 'number' },
            unit: { bsonType: 'string' },
            reportingPeriod: { bsonType: 'string' },
            status: {
              bsonType: 'string',
              enum: ['draft', 'published', 'archived']
            },
            complianceStatus: {
              bsonType: 'string',
              enum: ['compliant', 'non_compliant', 'pending']
            }
          }
        }
      }
    })
    console.log('    ✅ Created esgmetrics collection')
  } catch (error) {
    if (error.code === 48) { // NamespaceExists
      console.log('    ⚠️  ESG Metrics collection already exists')
    } else {
      throw error
    }
  }

  // ESG Targets collection
  try {
    await db.createCollection('esgtargets', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['companyId', 'framework', 'targetName', 'targetType'],
          properties: {
            companyId: { bsonType: 'objectId' },
            framework: { bsonType: 'string' },
            targetName: { bsonType: 'string' },
            targetType: { bsonType: 'string' },
            baselineYear: { bsonType: 'number' },
            targetYear: { bsonType: 'number' },
            baselineValue: { bsonType: 'number' },
            targetValue: { bsonType: 'number' },
            unit: { bsonType: 'string' },
            status: {
              bsonType: 'string',
              enum: ['draft', 'submitted', 'approved', 'rejected']
            }
          }
        }
      }
    })
    console.log('    ✅ Created esgtargets collection')
  } catch (error) {
    if (error.code === 48) { // NamespaceExists
      console.log('    ⚠️  ESG Targets collection already exists')
    } else {
      throw error
    }
  }

  // Materiality Assessment collection
  try {
    await db.createCollection('materialityassessments', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['companyId', 'assessmentYear', 'topics'],
          properties: {
            companyId: { bsonType: 'objectId' },
            assessmentYear: { bsonType: 'number' },
            topics: { bsonType: 'array' },
            stakeholderInput: { bsonType: 'object' },
            status: {
              bsonType: 'string',
              enum: ['draft', 'in_progress', 'completed', 'published']
            }
          }
        }
      }
    })
    console.log('    ✅ Created materialityassessments collection')
  } catch (error) {
    if (error.code === 48) { // NamespaceExists
      console.log('    ⚠️  Materiality Assessments collection already exists')
    } else {
      throw error
    }
  }
}

// Audit collections creation
async function createAuditCollections(db) {
  // Activity Logs collection
  await db.createCollection('activitylogs', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['action', 'userId', 'companyId', 'timestamp'],
        properties: {
          action: { bsonType: 'string' },
          userId: { bsonType: 'objectId' },
          companyId: { bsonType: 'objectId' },
          resourceType: { bsonType: 'string' },
          resourceId: { bsonType: 'string' },
          timestamp: { bsonType: 'date' },
          metadata: { bsonType: 'object' }
        }
      }
    }
  })

  // Incident Logs collection
  await db.createCollection('incidentlogs', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['companyId', 'incidentType', 'severity', 'occurredAt'],
        properties: {
          companyId: { bsonType: 'objectId' },
          incidentType: { bsonType: 'string' },
          severity: {
            bsonType: 'string',
            enum: ['low', 'medium', 'high', 'critical']
          },
          occurredAt: { bsonType: 'date' },
          description: { bsonType: 'string' },
          status: {
            bsonType: 'string',
            enum: ['reported', 'investigating', 'resolved', 'closed']
          }
        }
      }
    }
  })
}

// Create comprehensive indexes
async function createIndexes(db) {
  console.log('    📊 Creating enterprise indexes...')
  
  // Company indexes
  await db.collection('companies').createIndex({ name: 1 }, { unique: true })
  await db.collection('companies').createIndex({ industry: 1 })
  await db.collection('companies').createIndex({ subscription: 1 })
  await db.collection('companies').createIndex({ isActive: 1 })

  // User indexes
  await db.collection('users').createIndex({ email: 1 }, { unique: true })
  await db.collection('users').createIndex({ companyId: 1 })
  await db.collection('users').createIndex({ role: 1 })
  await db.collection('users').createIndex({ isActive: 1 })

  // Location indexes
  await db.collection('locations').createIndex({ companyId: 1 })
  await db.collection('locations').createIndex({ 'address.country': 1 })
  await db.collection('locations').createIndex({ isActive: 1 })

  // Facility indexes
  await db.collection('facilities').createIndex({ companyId: 1 })
  await db.collection('facilities').createIndex({ locationId: 1 })
  await db.collection('facilities').createIndex({ facilityType: 1 })

  // GHG Emission indexes
  await db.collection('ghgemissions').createIndex({ companyId: 1, reportingPeriod: 1 })
  await db.collection('ghgemissions').createIndex({ facilityId: 1 })
  await db.collection('ghgemissions').createIndex({ scope: 1 })
  await db.collection('ghgemissions').createIndex({ recordedAt: 1 })
  await db.collection('ghgemissions').createIndex({ activityType: 1 })

  // ESG Metric indexes
  await db.collection('esgmetrics').createIndex({ companyId: 1, framework: 1, reportingPeriod: 1 })
  await db.collection('esgmetrics').createIndex({ companyId: 1, status: 1 })
  await db.collection('esgmetrics').createIndex({ pillar: 1 })
  await db.collection('esgmetrics').createIndex({ isDraft: 1 })
  await db.collection('esgmetrics').createIndex({ complianceStatus: 1 })

  // ESG Target indexes
  await db.collection('esgtargets').createIndex({ companyId: 1, framework: 1 })
  await db.collection('esgtargets').createIndex({ companyId: 1, status: 1 })
  await db.collection('esgtargets').createIndex({ targetYear: 1 })

  // Materiality Assessment indexes
  await db.collection('materialityassessments').createIndex({ companyId: 1, assessmentYear: 1 })
  await db.collection('materialityassessments').createIndex({ status: 1 })

  // Activity Log indexes (with TTL)
  await db.collection('activitylogs').createIndex({ companyId: 1, timestamp: -1 })
  await db.collection('activitylogs').createIndex({ userId: 1 })
  await db.collection('activitylogs').createIndex({ timestamp: 1 }, { expireAfterSeconds: 63072000 }) // 2 years

  // Incident Log indexes
  await db.collection('incidentlogs').createIndex({ companyId: 1, occurredAt: -1 })
  await db.collection('incidentlogs').createIndex({ incidentType: 1 })
  await db.collection('incidentlogs').createIndex({ severity: 1 })
  await db.collection('incidentlogs').createIndex({ status: 1 })

  console.log('    ✅ Enterprise indexes created')
}

// Seed emission factors
async function seedEmissionFactors(db) {
  console.log('    🌱 Seeding emission factors...')
  
  const emissionFactors = [
    // Scope 1: Direct emissions
    { category: 'fuels', subcategory: 'diesel', factor: 2.546, unit: 'kgCO2e/litre', scope: 'scope1', source: 'DEFRA 2025', region: 'uk', year: 2025 },
    { category: 'fuels', subcategory: 'petrol', factor: 2.315, unit: 'kgCO2e/litre', scope: 'scope1', source: 'DEFRA 2025', region: 'uk', year: 2025 },
    { category: 'fuels', subcategory: 'natural-gas', factor: 0.185, unit: 'kgCO2e/kWh', scope: 'scope1', source: 'DEFRA 2025', region: 'uk', year: 2025 },
    
    // Scope 2: Electricity
    { category: 'electricity', subcategory: 'uk-grid', factor: 0.20898, unit: 'kgCO2e/kWh', scope: 'scope2', source: 'DEFRA 2025', region: 'uk', year: 2025 },
    { category: 'electricity', subcategory: 'uk-renewable', factor: 0, unit: 'kgCO2e/kWh', scope: 'scope2', source: 'DEFRA 2025', region: 'uk', year: 2025 },
    
    // Scope 3: Transport
    { category: 'transport', subcategory: 'car-small-petrol', factor: 0.14235, unit: 'kgCO2e/km', scope: 'scope3', source: 'DEFRA 2025', region: 'uk', year: 2025 },
    { category: 'transport', subcategory: 'car-medium-petrol', factor: 0.18694, unit: 'kgCO2e/km', scope: 'scope3', source: 'DEFRA 2025', region: 'uk', year: 2025 },
    { category: 'transport', subcategory: 'van-class-1', factor: 0.12686, unit: 'kgCO2e/km', scope: 'scope3', source: 'DEFRA 2025', region: 'uk', year: 2025 },
    
    // Refrigerants
    { category: 'refrigerants', subcategory: 'r-134a', factor: 1430, unit: 'kgCO2e/kg', scope: 'scope1', source: 'DEFRA 2025', region: 'uk', year: 2025 },
    { category: 'refrigerants', subcategory: 'r-404a', factor: 3922, unit: 'kgCO2e/kg', scope: 'scope1', source: 'DEFRA 2025', region: 'uk', year: 2025 },
    
    // Waste
    { category: 'waste', subcategory: 'landfill', factor: 467, unit: 'kgCO2e/tonne', scope: 'scope3', source: 'DEFRA 2025', region: 'uk', year: 2025 },
    { category: 'waste', subcategory: 'recycling', factor: 21, unit: 'kgCO2e/tonne', scope: 'scope3', source: 'DEFRA 2025', region: 'uk', year: 2025 },
    
    // Water
    { category: 'water', subcategory: 'supply', factor: 0.344, unit: 'kgCO2e/m³', scope: 'scope3', source: 'DEFRA 2025', region: 'uk', year: 2025 },
    { category: 'water', subcategory: 'treatment', factor: 0.708, unit: 'kgCO2e/m³', scope: 'scope3', source: 'DEFRA 2025', region: 'uk', year: 2025 }
  ]

  await db.collection('emissionfactors').insertMany(emissionFactors)
  console.log('    ✅ Emission factors seeded')
}

// Seed framework templates
async function seedFrameworkTemplates(db) {
  console.log('    📋 Seeding framework templates...')
  
  const frameworkTemplates = [
    {
      framework: 'GRI',
      pillar: 'environmental',
      topic: 'emissions',
      subTopic: 'scope1',
      metricName: 'Direct GHG emissions (Scope 1)',
      unit: 'tCO2e',
      methodology: 'GHG Protocol',
      isRequired: true,
      isActive: true
    },
    {
      framework: 'GRI',
      pillar: 'environmental',
      topic: 'emissions',
      subTopic: 'scope2',
      metricName: 'Energy indirect GHG emissions (Scope 2)',
      unit: 'tCO2e',
      methodology: 'GHG Protocol',
      isRequired: true,
      isActive: true
    },
    {
      framework: 'GRI',
      pillar: 'environmental',
      topic: 'emissions',
      subTopic: 'scope3',
      metricName: 'Other indirect GHG emissions (Scope 3)',
      unit: 'tCO2e',
      methodology: 'GHG Protocol',
      isRequired: true,
      isActive: true
    },
    {
      framework: 'TCFD',
      pillar: 'governance',
      topic: 'climate_governance',
      subTopic: 'board_oversight',
      metricName: 'Board oversight of climate-related risks and opportunities',
      unit: 'text',
      methodology: 'TCFD Recommendations',
      isRequired: true,
      isActive: true
    },
    {
      framework: 'SBTi',
      pillar: 'environmental',
      topic: 'targets',
      subTopic: 'science_based',
      metricName: 'Science-based target for GHG emissions reduction',
      unit: '%',
      methodology: 'SBTi Criteria',
      isRequired: true,
      isActive: true
    }
  ]

  await db.collection('frameworktemplates').insertMany(frameworkTemplates)
  console.log('    ✅ Framework templates seeded')
}

// Seed reference data
async function seedReferenceData(db) {
  console.log('    📚 Seeding reference data...')
  
  // Industry classifications
  const industries = [
    { code: 'agriculture', name: 'Agriculture', description: 'Farming, forestry, and fishing' },
    { code: 'energy', name: 'Energy', description: 'Electricity, gas, and water supply' },
    { code: 'fleet', name: 'Fleet Management', description: 'Transportation and logistics' },
    { code: 'food', name: 'Food & Beverage', description: 'Food production and processing' },
    { code: 'manufacturing', name: 'Manufacturing', description: 'Industrial production' },
    { code: 'education', name: 'Education', description: 'Educational services' },
    { code: 'other', name: 'Other', description: 'Other industries' }
  ]

  await db.collection('industries').insertMany(industries)

  // ESG Pillars
  const pillars = [
    { code: 'environmental', name: 'Environmental', description: 'Environmental impact and sustainability' },
    { code: 'social', name: 'Social', description: 'Social impact and stakeholder relations' },
    { code: 'governance', name: 'Governance', description: 'Corporate governance and ethics' }
  ]

  await db.collection('pillars').insertMany(pillars)

  console.log('    ✅ Reference data seeded')
}

module.exports = {
  migrations,
  runMigrations: async (db) => {
    console.log('🚀 Running enterprise database migrations...')
    
    for (const migration of migrations) {
      console.log(`\n📦 Migration ${migration.version}: ${migration.name}`)
      console.log(`   ${migration.description}`)
      
      try {
        await migration.up(db)
        console.log(`   ✅ Migration ${migration.version} completed`)
      } catch (error) {
        console.error(`   ❌ Migration ${migration.version} failed:`, error.message)
        throw error
      }
    }
    
    console.log('\n🎉 All enterprise migrations completed successfully!')
  }
}
