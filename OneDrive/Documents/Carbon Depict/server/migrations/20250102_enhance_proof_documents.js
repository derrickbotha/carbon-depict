/**
 * Migration: Enhance Proof Documents
 * Phase 3 Week 15: Database Migrations
 *
 * Enhances proof documents array with additional fields
 */

const mongoose = require('mongoose')

const up = async () => {
  console.log('Starting migration: Enhance proof documents')

  try {
    const db = mongoose.connection.db
    const collection = db.collection('esgmetrics')

    // Find all documents with proofs
    const documents = await collection.find({ proofs: { $exists: true, $ne: [] } }).toArray()

    let updateCount = 0

    for (const doc of documents) {
      if (Array.isArray(doc.proofs)) {
        const enhancedProofs = doc.proofs.map(proof => ({
          ...proof,
          // Add missing fields with defaults
          type: proof.type || 'document',
          fileSize: proof.fileSize || null,
          mimeType: proof.mimeType || null,
          status: proof.status || 'pending_review',
          reviewedBy: proof.reviewedBy || null,
          reviewedAt: proof.reviewedAt || null,
          description: proof.description || ''
        }))

        await collection.updateOne(
          { _id: doc._id },
          { $set: { proofs: enhancedProofs } }
        )

        updateCount++
      }
    }

    console.log(`Enhanced proofs in ${updateCount} ESG metrics`)

    return { success: true, modified: updateCount }
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

const down = async () => {
  console.log('Rolling back migration: Restore original proof structure')

  try {
    const db = mongoose.connection.db
    const collection = db.collection('esgmetrics')

    // Find all documents with proofs
    const documents = await collection.find({ proofs: { $exists: true, $ne: [] } }).toArray()

    let updateCount = 0

    for (const doc of documents) {
      if (Array.isArray(doc.proofs)) {
        const originalProofs = doc.proofs.map(proof => ({
          fileUrl: proof.fileUrl,
          fileName: proof.fileName,
          uploadedBy: proof.uploadedBy,
          uploadedAt: proof.uploadedAt
        }))

        await collection.updateOne(
          { _id: doc._id },
          { $set: { proofs: originalProofs } }
        )

        updateCount++
      }
    }

    console.log(`Restored original proof structure in ${updateCount} ESG metrics`)

    return { success: true, modified: updateCount }
  } catch (error) {
    console.error('Rollback failed:', error)
    throw error
  }
}

module.exports = { up, down }
