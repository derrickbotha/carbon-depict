/**
 * Migration: Add Approval Fields to ESG Metrics
 * Phase 3 Week 15: Database Migrations
 *
 * Adds approval workflow fields to existing ESG metrics
 */

const mongoose = require('mongoose')

const up = async () => {
  console.log('Starting migration: Add approval fields to ESG Metrics')

  try {
    const db = mongoose.connection.db
    const collection = db.collection('esgmetrics')

    // Add approval fields to documents that don't have them
    const result = await collection.updateMany(
      { approvalStatus: { $exists: false } },
      {
        $set: {
          approvalStatus: 'pending',
          approvedBy: null,
          approvedAt: null,
          notes: '',
          tags: []
        }
      }
    )

    console.log(`Updated ${result.modifiedCount} ESG metrics with approval fields`)

    // Create indexes
    await collection.createIndex({ approvalStatus: 1 })
    await collection.createIndex({ companyId: 1, approvalStatus: 1, createdAt: -1 })

    console.log('Created indexes for approval fields')

    return { success: true, modified: result.modifiedCount }
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

const down = async () => {
  console.log('Rolling back migration: Remove approval fields')

  try {
    const db = mongoose.connection.db
    const collection = db.collection('esgmetrics')

    // Remove approval fields
    const result = await collection.updateMany(
      {},
      {
        $unset: {
          approvalStatus: '',
          approvedBy: '',
          approvedAt: '',
          notes: '',
          tags: ''
        }
      }
    )

    console.log(`Removed approval fields from ${result.modifiedCount} ESG metrics`)

    // Drop indexes
    await collection.dropIndex('approvalStatus_1')
    await collection.dropIndex('companyId_1_approvalStatus_1_createdAt_-1')

    console.log('Dropped approval field indexes')

    return { success: true, modified: result.modifiedCount }
  } catch (error) {
    console.error('Rollback failed:', error)
    throw error
  }
}

module.exports = { up, down }
