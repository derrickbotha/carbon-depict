#!/usr/bin/env node
/**
 * Migration Generator
 * Creates a new migration file with timestamp
 */

const fs = require('fs')
const path = require('path')

const MIGRATIONS_DIR = __dirname

// Get description from command line
const description = process.argv.slice(2).join('_').replace(/[^a-z0-9_]/gi, '_').toLowerCase()

if (!description) {
  console.error('❌ Please provide a migration description')
  console.log('Usage: node create.js "description of migration"')
  process.exit(1)
}

// Generate timestamp
const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '')
const filename = `${timestamp}_${description}.js`
const filepath = path.join(MIGRATIONS_DIR, filename)

// Migration template
const template = `/**
 * Migration: ${description}
 * Created: ${new Date().toISOString()}
 */

module.exports = {
  /**
   * Run the migration
   * @param {import('mongodb').Db} db - MongoDB database instance
   */
  async up(db) {
    console.log('  ▶️  Running migration: ${description}')
    
    // Example: Create a new collection
    // await db.createCollection('new_collection')
    
    // Example: Add index
    // await db.collection('users').createIndex({ email: 1 }, { unique: true })
    
    // Example: Update documents
    // await db.collection('users').updateMany(
    //   { role: { $exists: false } },
    //   { $set: { role: 'user' } }
    // )
    
    // TODO: Add your migration code here
    
    console.log('  ✅ Migration completed')
  },

  /**
   * Rollback the migration
   * @param {import('mongodb').Db} db - MongoDB database instance
   */
  async down(db) {
    console.log('  ▶️  Rolling back migration: ${description}')
    
    // TODO: Add rollback code here
    // This should reverse the changes made in up()
    
    console.log('  ✅ Rollback completed')
  }
}
`

// Write file
fs.writeFileSync(filepath, template)

console.log(`✅ Created migration file: ${filename}`)
console.log(`\nEdit the file at: ${filepath}`)
console.log('\nTo run migrations: node run.js')
