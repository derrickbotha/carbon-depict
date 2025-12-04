/**
 * Migration Runner - Phase 3 Week 15
 *
 * Runs database migrations in order
 */

const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

// Migration tracking schema
const migrationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  appliedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'applied', 'failed'], default: 'pending' }
})

const Migration = mongoose.model('Migration', migrationSchema)

/**
 * Get all migration files
 */
const getMigrationFiles = () => {
  const migrationsDir = __dirname
  const files = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.js') && file !== 'migrate.js')
    .sort()

  return files.map(file => ({
    name: file.replace('.js', ''),
    path: path.join(migrationsDir, file)
  }))
}

/**
 * Get applied migrations
 */
const getAppliedMigrations = async () => {
  const migrations = await Migration.find({ status: 'applied' })
  return migrations.map(m => m.name)
}

/**
 * Run pending migrations
 */
const runMigrations = async () => {
  console.log('Starting database migrations...\n')

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carbon-depict')
    console.log('Connected to MongoDB\n')

    // Get all migrations
    const allMigrations = getMigrationFiles()
    const appliedMigrations = await getAppliedMigrations()

    // Filter pending migrations
    const pendingMigrations = allMigrations.filter(
      m => !appliedMigrations.includes(m.name)
    )

    if (pendingMigrations.length === 0) {
      console.log('No pending migrations')
      return
    }

    console.log(`Found ${pendingMigrations.length} pending migrations:\n`)
    pendingMigrations.forEach(m => console.log(`  - ${m.name}`))
    console.log()

    // Run each migration
    for (const migration of pendingMigrations) {
      console.log(`Running migration: ${migration.name}`)

      try {
        // Load migration
        const { up } = require(migration.path)

        // Create migration record
        await Migration.create({
          name: migration.name,
          status: 'pending'
        })

        // Run migration
        const result = await up()

        // Update status
        await Migration.updateOne(
          { name: migration.name },
          { status: 'applied' }
        )

        console.log(`✓ Migration completed: ${migration.name}`)
        if (result) {
          console.log(`  Result:`, result)
        }
        console.log()

      } catch (error) {
        console.error(`✗ Migration failed: ${migration.name}`)
        console.error(`  Error:`, error.message)

        // Update status
        await Migration.updateOne(
          { name: migration.name },
          { status: 'failed' }
        )

        throw error
      }
    }

    console.log('All migrations completed successfully!')

  } catch (error) {
    console.error('\nMigration process failed:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

/**
 * Rollback last migration
 */
const rollbackMigration = async () => {
  console.log('Rolling back last migration...\n')

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carbon-depict')
    console.log('Connected to MongoDB\n')

    // Get last applied migration
    const lastMigration = await Migration.findOne({ status: 'applied' })
      .sort({ appliedAt: -1 })

    if (!lastMigration) {
      console.log('No migrations to rollback')
      return
    }

    console.log(`Rolling back: ${lastMigration.name}`)

    // Load migration
    const migrationPath = path.join(__dirname, `${lastMigration.name}.js`)
    const { down } = require(migrationPath)

    // Run rollback
    const result = await down()

    // Remove migration record
    await Migration.deleteOne({ _id: lastMigration._id })

    console.log(`✓ Rollback completed: ${lastMigration.name}`)
    if (result) {
      console.log(`  Result:`, result)
    }

  } catch (error) {
    console.error('\nRollback failed:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

/**
 * Show migration status
 */
const showStatus = async () => {
  console.log('Migration Status:\n')

  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carbon-depict')

    const allMigrations = getMigrationFiles()
    const appliedMigrations = await Migration.find().sort({ appliedAt: 1 })

    const appliedNames = appliedMigrations.map(m => m.name)

    console.log('Applied migrations:')
    appliedMigrations.forEach(m => {
      console.log(`  ✓ ${m.name} (${m.appliedAt.toISOString()})`)
    })

    console.log('\nPending migrations:')
    const pending = allMigrations.filter(m => !appliedNames.includes(m.name))
    if (pending.length === 0) {
      console.log('  None')
    } else {
      pending.forEach(m => {
        console.log(`  - ${m.name}`)
      })
    }

  } catch (error) {
    console.error('Failed to get status:', error)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
  }
}

// CLI
const command = process.argv[2]

switch (command) {
  case 'up':
    runMigrations()
    break
  case 'down':
    rollbackMigration()
    break
  case 'status':
    showStatus()
    break
  default:
    console.log(`
Database Migration Tool

Usage:
  node migrate.js <command>

Commands:
  up      Run pending migrations
  down    Rollback last migration
  status  Show migration status
    `)
}
