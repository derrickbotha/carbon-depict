/**
 * Database Index Migration Script
 * Adds performance-optimized indexes to MongoDB collections
 *
 * Usage: node scripts/add-indexes.js
 */

require('dotenv').config()
const mongoose = require('mongoose')

const ESGMetric = require('../models/mongodb/ESGMetric')
const GHGEmission = require('../models/mongodb/GHGEmission')
const User = require('../models/mongodb/User')

async function addIndexes() {
  try {
    console.log('🔄 Starting database index migration...')
    console.log(`📊 Connecting to MongoDB: ${process.env.MONGO_URI || 'localhost'}`)

    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/carbondepict')
    console.log('✅ Database connected')

    // ESGMetric Indexes
    console.log('\n📝 Creating indexes for ESGMetric collection...')
    await ESGMetric.collection.createIndex({ companyId: 1, topic: 1, createdAt: -1 })
    console.log('  ✓ Created index: companyId_1_topic_1_createdAt_-1')

    await ESGMetric.collection.createIndex({ companyId: 1, pillar: 1, createdAt: -1 })
    console.log('  ✓ Created index: companyId_1_pillar_1_createdAt_-1')

    await ESGMetric.collection.createIndex({ createdAt: -1 })
    console.log('  ✓ Created index: createdAt_-1')

    await ESGMetric.collection.createIndex({ framework: 1 })
    console.log('  ✓ Created index: framework_1')

    // GHGEmission Indexes
    console.log('\n📝 Creating indexes for GHGEmission collection...')
    await GHGEmission.collection.createIndex({ companyId: 1, scope: 1, recordedAt: -1 })
    console.log('  ✓ Created index: companyId_1_scope_1_recordedAt_-1')

    await GHGEmission.collection.createIndex({ facilityId: 1, recordedAt: -1 })
    console.log('  ✓ Created index: facilityId_1_recordedAt_-1')

    await GHGEmission.collection.createIndex({ recordedAt: -1 })
    console.log('  ✓ Created index: recordedAt_-1')

    // List all indexes for verification
    console.log('\n📊 Verifying indexes...')
    const esgIndexes = await ESGMetric.collection.indexes()
    const ghgIndexes = await GHGEmission.collection.indexes()

    console.log(`\n✅ ESGMetric collection has ${esgIndexes.length} indexes:`)
    esgIndexes.forEach(index => {
      console.log(`   - ${index.name}`)
    })

    console.log(`\n✅ GHGEmission collection has ${ghgIndexes.length} indexes:`)
    ghgIndexes.forEach(index => {
      console.log(`   - ${index.name}`)
    })

    console.log('\n🎉 Index migration completed successfully!')

    await mongoose.disconnect()
    console.log('👋 Database disconnected')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error during index migration:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

// Run the migration
addIndexes()
