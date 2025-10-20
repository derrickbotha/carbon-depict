require('dotenv').config()
const { connectDatabases } = require('../config/database')
const { seedEmissionFactors } = require('../seeders/emissionFactors')

/**
 * Database seeding script
 * Run with: node server/scripts/seed.js
 */
const seed = async () => {
  try {
    console.log('🌱 Starting database seeding...')

    // Connect to databases
    await connectDatabases()

    // Seed emission factors (MongoDB)
    await seedEmissionFactors()

    console.log('✅ Database seeding completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error.message)
    process.exit(1)
  }
}

seed()
