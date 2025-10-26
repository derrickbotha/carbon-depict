#!/usr/bin/env node
/**
 * Migration Runner
 * Executes database migrations in order
 */

const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const MIGRATIONS_DIR = __dirname
const MIGRATIONS_COLLECTION = 'migrations'

// Migration tracking schema
const migrationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  executedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' }
})

const Migration = mongoose.model('Migration', migrationSchema)

/**
 * Get all migration files sorted by timestamp
 */
function getMigrationFiles() {
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.js') && f !== 'run.js' && f !== 'create.js')
    .sort()
  
  return files
}

/**
 * Get executed migrations from database
 */
async function getExecutedMigrations() {
  const executed = await Migration.find({ status: 'completed' })
    .sort({ executedAt: 1 })
    .lean()
  
  return executed.map(m => m.name)
}

/**
 * Run migrations
 */
async function runMigrations(targetMigration = null) {
  try {
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const allMigrations = getMigrationFiles()
    const executedMigrations = await getExecutedMigrations()
    
    // Filter pending migrations
    const pendingMigrations = targetMigration
      ? allMigrations.filter(m => m === targetMigration)
      : allMigrations.filter(m => !executedMigrations.includes(m))

    if (pendingMigrations.length === 0) {
      console.log('✅ All migrations are up to date')
      return
    }

    console.log(`\n📋 Found ${pendingMigrations.length} pending migration(s):\n`)
    pendingMigrations.forEach(m => console.log(`  - ${m}`))
    console.log('')

    // Execute migrations
    for (const migrationFile of pendingMigrations) {
      console.log(`▶️  Running migration: ${migrationFile}`)
      
      const migrationPath = path.join(MIGRATIONS_DIR, migrationFile)
      const migration = require(migrationPath)

      // Create migration record
      const migrationRecord = new Migration({
        name: migrationFile,
        status: 'pending'
      })
      await migrationRecord.save()

      try {
        // Execute migration
        await migration.up(mongoose.connection.db)
        
        // Mark as completed
        migrationRecord.status = 'completed'
        migrationRecord.executedAt = new Date()
        await migrationRecord.save()
        
        console.log(`✅ Completed: ${migrationFile}\n`)
      } catch (error) {
        // Mark as failed
        migrationRecord.status = 'failed'
        await migrationRecord.save()
        
        console.error(`❌ Failed: ${migrationFile}`)
        console.error('Error:', error.message)
        throw error
      }
    }

    console.log('✅ All migrations completed successfully')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
  }
}

/**
 * Rollback last migration
 */
async function rollbackMigration() {
  try {
    console.log('🔄 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const lastMigration = await Migration.findOne({ status: 'completed' })
      .sort({ executedAt: -1 })

    if (!lastMigration) {
      console.log('ℹ️  No migrations to rollback')
      return
    }

    console.log(`\n🔙 Rolling back migration: ${lastMigration.name}`)

    const migrationPath = path.join(MIGRATIONS_DIR, lastMigration.name)
    const migration = require(migrationPath)

    if (!migration.down) {
      console.error('❌ Migration does not have a rollback function')
      process.exit(1)
    }

    // Execute rollback
    await migration.down(mongoose.connection.db)

    // Remove migration record
    await Migration.deleteOne({ _id: lastMigration._id })

    console.log('✅ Rollback completed')
  } catch (error) {
    console.error('❌ Rollback failed:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const isRollback = args.includes('--rollback')
const targetMigration = args.find(arg => !arg.startsWith('--'))

// Run migrations
if (isRollback) {
  rollbackMigration()
} else {
  runMigrations(targetMigration)
}
