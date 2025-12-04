/**
 * Verify Database Indexes Script
 * Checks that all required indexes are present in MongoDB collections
 *
 * Usage: node scripts/verify-indexes.js
 */

require('dotenv').config()
const mongoose = require('mongoose')

// Expected indexes for each collection
const EXPECTED_INDEXES = {
  esgmetrics: [
    '_id_',
    'companyId_1_framework_1_reportingPeriod_1',
    'companyId_1_status_1',
    'companyId_1_topic_1_createdAt_-1',
    'companyId_1_pillar_1_createdAt_-1',
    'createdAt_-1',
    'framework_1'
  ],
  ghgemissions: [
    '_id_',
    'companyId_1_reportingPeriod_1',
    'facilityId_1',
    'scope_1',
    'companyId_1_scope_1_recordedAt_-1',
    'facilityId_1_recordedAt_-1',
    'recordedAt_-1'
  ]
}

async function verifyIndexes() {
  try {
    console.log('🔍 Verifying database indexes...\n')
    console.log(`📊 Connecting to MongoDB: ${process.env.MONGO_URI || 'localhost'}\n`)

    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/carbondepict')
    const db = mongoose.connection.db

    let allPassed = true
    let totalIndexes = 0
    let missingIndexes = []

    for (const [collectionName, expectedIndexNames] of Object.entries(EXPECTED_INDEXES)) {
      console.log(`\n📋 Checking collection: ${collectionName}`)
      console.log('─'.repeat(50))

      // Get actual indexes
      const collection = db.collection(collectionName)
      const actualIndexes = await collection.indexes()
      const actualIndexNames = actualIndexes.map(idx => idx.name)

      console.log(`Expected indexes: ${expectedIndexNames.length}`)
      console.log(`Actual indexes:   ${actualIndexNames.length}`)

      // Check each expected index
      const missing = []
      const present = []

      for (const expectedName of expectedIndexNames) {
        if (actualIndexNames.includes(expectedName)) {
          present.push(expectedName)
          console.log(`  ✓ ${expectedName}`)
        } else {
          missing.push(expectedName)
          console.log(`  ✗ ${expectedName} - MISSING`)
          allPassed = false
        }
      }

      // Check for extra indexes
      const extra = actualIndexNames.filter(name => !expectedIndexNames.includes(name))
      if (extra.length > 0) {
        console.log(`\n  ℹ Extra indexes (not in expected list):`)
        extra.forEach(name => console.log(`    • ${name}`))
      }

      // Collection summary
      if (missing.length === 0) {
        console.log(`\n  ✅ All required indexes present (${present.length}/${expectedIndexNames.length})`)
      } else {
        console.log(`\n  ❌ Missing ${missing.length} index(es)`)
        missingIndexes.push({ collection: collectionName, missing })
      }

      totalIndexes += actualIndexNames.length
    }

    // Final summary
    console.log('\n' + '='.repeat(50))
    console.log('  VERIFICATION SUMMARY')
    console.log('='.repeat(50))
    console.log(`Total indexes across all collections: ${totalIndexes}`)

    if (allPassed) {
      console.log('\n✅ All required indexes are present!')
      console.log('   Database is properly optimized.')
    } else {
      console.log('\n❌ Some indexes are missing:')
      missingIndexes.forEach(({ collection, missing }) => {
        console.log(`\n   Collection: ${collection}`)
        missing.forEach(idx => console.log(`     - ${idx}`))
      })
      console.log('\n   Run migration: npm run migrate:indexes')
    }

    console.log('')
    await mongoose.disconnect()
    process.exit(allPassed ? 0 : 1)
  } catch (error) {
    console.error('❌ Error verifying indexes:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

// Run verification
verifyIndexes()
