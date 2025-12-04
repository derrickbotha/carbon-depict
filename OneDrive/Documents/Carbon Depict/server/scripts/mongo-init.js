/**
 * MongoDB Initialization Script
 * Creates database, user, and initial collections
 * Runs automatically when MongoDB container starts for the first time
 */

// Switch to the application database
db = db.getSiblingDB('carbondepict');

// Create application user with read/write permissions
db.createUser({
  user: 'carbondepict_app',
  pwd: process.env.MONGO_APP_PASSWORD || 'changeme-app-password',
  roles: [
    {
      role: 'readWrite',
      db: 'carbondepict'
    }
  ]
});

print('✅ Database user created: carbondepict_app');

// Create collections with validation schemas
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password'],
      properties: {
        email: {
          bsonType: 'string',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          description: 'must be a valid email address'
        },
        password: {
          bsonType: 'string',
          minLength: 60,
          maxLength: 60,
          description: 'must be a bcrypt hashed password'
        },
        role: {
          enum: ['admin', 'manager', 'user'],
          description: 'must be a valid role'
        }
      }
    }
  }
});

db.createCollection('companies');
db.createCollection('locations');
db.createCollection('facilities');
db.createCollection('ghgemissions');
db.createCollection('esgmetrics');
db.createCollection('reports');
db.createCollection('emissionfactors');
db.createCollection('activitylogs');

print('✅ Collections created');

// Create indexes for better performance
// Users
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ companyId: 1 });
db.users.createIndex({ createdAt: -1 });

// Companies
db.companies.createIndex({ name: 1 });
db.companies.createIndex({ industry: 1 });
db.companies.createIndex({ createdAt: -1 });

// Locations
db.locations.createIndex({ companyId: 1 });
db.locations.createIndex({ country: 1 });

// Facilities
db.facilities.createIndex({ companyId: 1 });
db.facilities.createIndex({ locationId: 1 });
db.facilities.createIndex({ facilityType: 1 });

// GHG Emissions
db.ghgemissions.createIndex({ companyId: 1, reportingPeriod: 1 });
db.ghgemissions.createIndex({ companyId: 1, scope: 1, recordedAt: -1 });
db.ghgemissions.createIndex({ facilityId: 1, recordedAt: -1 });
db.ghgemissions.createIndex({ scope: 1 });
db.ghgemissions.createIndex({ recordedAt: -1 });

// ESG Metrics
db.esgmetrics.createIndex({ companyId: 1, framework: 1, reportingPeriod: 1 });
db.esgmetrics.createIndex({ companyId: 1, status: 1 });
db.esgmetrics.createIndex({ companyId: 1, topic: 1, createdAt: -1 });
db.esgmetrics.createIndex({ companyId: 1, pillar: 1, createdAt: -1 });
db.esgmetrics.createIndex({ createdAt: -1 });
db.esgmetrics.createIndex({ framework: 1 });

// Reports
db.reports.createIndex({ companyId: 1, reportType: 1 });
db.reports.createIndex({ companyId: 1, status: 1 });
db.reports.createIndex({ createdAt: -1 });

// Emission Factors
db.emissionfactors.createIndex({ year: 1, category: 1, subcategory: 1 });
db.emissionfactors.createIndex({ source: 1 });

// Activity Logs
db.activitylogs.createIndex({ userId: 1, createdAt: -1 });
db.activitylogs.createIndex({ companyId: 1, createdAt: -1 });
db.activitylogs.createIndex({ action: 1 });
db.activitylogs.createIndex({ createdAt: -1 }, { expireAfterSeconds: 7776000 }); // 90 days TTL

print('✅ Indexes created');

// Insert DEFRA 2025 emission factors (sample data)
// In production, this would be loaded from a complete data file
db.emissionfactors.insertMany([
  {
    year: 2025,
    source: 'DEFRA',
    category: 'Fuels',
    subcategory: 'Natural Gas',
    activityUnit: 'kWh',
    co2Factor: 0.18316,
    ch4Factor: 0.00003,
    n2oFactor: 0.00001,
    co2eTotal: 0.18385,
    scope: 'scope1',
    region: 'UK',
    createdAt: new Date()
  },
  {
    year: 2025,
    source: 'DEFRA',
    category: 'Electricity',
    subcategory: 'Grid Electricity',
    activityUnit: 'kWh',
    co2Factor: 0.21233,
    ch4Factor: 0.00001,
    n2oFactor: 0.00001,
    co2eTotal: 0.21290,
    scope: 'scope2',
    region: 'UK',
    createdAt: new Date()
  }
]);

print('✅ Sample emission factors inserted');

// Create a system configuration document
db.systemconfig.insertOne({
  version: '1.0.0',
  initializedAt: new Date(),
  defaultSettings: {
    defaultReportingYear: 2025,
    defaultCurrency: 'USD',
    defaultEmissionFactorSource: 'DEFRA',
    features: {
      aiAssistant: false,
      advancedAnalytics: true,
      bulkUpload: true
    }
  }
});

print('✅ System configuration created');

print('\n========================================');
print('  MongoDB Initialization Complete!');
print('========================================');
print('Database: carbondepict');
print('Application User: carbondepict_app');
print('Collections: 9 created');
print('Indexes: 30+ created');
print('========================================\n');
