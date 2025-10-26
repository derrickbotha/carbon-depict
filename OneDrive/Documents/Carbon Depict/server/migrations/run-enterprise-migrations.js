#!/usr/bin/env node

/**
 * Enterprise Database Migration Runner
 * Executes database migrations for enterprise-grade infrastructure
 */

const mongoose = require('mongoose')
const { runMigrations } = require('./enterprise-migrations')
require('dotenv').config()

async function runEnterpriseMigrations() {
  try {
    console.log('🚀 Starting Enterprise Database Migrations...')
    console.log('==========================================')

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/carbondepict'
    console.log(`📡 Connecting to MongoDB: ${mongoUri.replace(/\/\/.*@/, '//***@')}`)
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log('✅ Connected to MongoDB successfully')

    // Get database instance
    const db = mongoose.connection.db

    // Run migrations
    await runMigrations(db)

    console.log('\n🎉 Enterprise migrations completed successfully!')
    console.log('==========================================')
    console.log('Your database is now ready for enterprise-grade operations.')
    console.log('\nNext steps:')
    console.log('1. Start your backend server: npm run dev')
    console.log('2. Start your frontend: npm run dev')
    console.log('3. Access the application at http://localhost:3500')

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message)
    console.error('Stack trace:', error.stack)
    process.exit(1)
  } finally {
    // Close database connection
    await mongoose.connection.close()
    console.log('\n📡 Database connection closed')
  }
}

// Run migrations if this script is executed directly
if (require.main === module) {
  runEnterpriseMigrations()
}

module.exports = { runEnterpriseMigrations }
