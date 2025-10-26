/**
 * Initial Migration: Set up base collections and indexes
 * Created: 2025-10-24
 */

module.exports = {
  async up(db) {
    console.log('  ▶️  Setting up base collections and indexes...')
    
    // Helper function to create index if it doesn't exist
    const createIndexSafe = async (collection, indexSpec, options = {}) => {
      try {
        const indexes = await db.collection(collection).indexes()
        const indexName = options.name || Object.keys(indexSpec).map(key => `${key}_1`).join('_')
        const exists = indexes.some(idx => idx.name === indexName)
        
        if (!exists) {
          await db.collection(collection).createIndex(indexSpec, options)
          console.log(`    ✓ Created index ${indexName} on ${collection}`)
        } else {
          console.log(`    ⊙ Index ${indexName} already exists on ${collection}`)
        }
      } catch (error) {
        if (error.code !== 86) { // Ignore IndexKeySpecsConflict
          throw error
        }
      }
    }
    
    // Companies collection indexes
    await createIndexSafe('companies', { name: 1 })
    await createIndexSafe('companies', { slug: 1 }, { unique: true, sparse: true })
    await createIndexSafe('companies', { 'subscriptionStatus': 1 })
    
    // Users collection indexes
    await createIndexSafe('users', { email: 1 }, { unique: true })
    await createIndexSafe('users', { companyId: 1 })
    await createIndexSafe('users', { role: 1 })
    await createIndexSafe('users', { isActive: 1 })
    
    // GHG Emissions collection indexes
    await createIndexSafe('ghgemissions', { companyId: 1, reportingPeriod: 1 })
    await createIndexSafe('ghgemissions', { facilityId: 1 })
    await createIndexSafe('ghgemissions', { scope: 1 })
    await createIndexSafe('ghgemissions', { recordedAt: 1 })
    
    // ESG Metrics collection indexes
    await createIndexSafe('esgmetrics', { companyId: 1, framework: 1, reportingPeriod: 1 })
    await createIndexSafe('esgmetrics', { companyId: 1, status: 1 })
    await createIndexSafe('esgmetrics', { pillar: 1 })
    await createIndexSafe('esgmetrics', { isDraft: 1 })
    
    // Locations collection indexes
    await createIndexSafe('locations', { companyId: 1 })
    await createIndexSafe('locations', { 'address.country': 1 })
    
    // Facilities collection indexes
    await createIndexSafe('facilities', { companyId: 1 })
    await createIndexSafe('facilities', { locationId: 1 })
    
    // GRI Disclosures collection indexes
    await createIndexSafe('gridisclosures', { companyId: 1, reportingPeriod: 1 })
    await createIndexSafe('gridisclosures', { standard: 1 })
    
    // Emission Factors collection indexes
    await createIndexSafe('emissionfactors', { category: 1, region: 1 })
    await createIndexSafe('emissionfactors', { source: 1, year: 1 })
    
    // Activity Logs collection indexes (with TTL)
    await createIndexSafe('activitylogs', { companyId: 1, timestamp: -1 })
    await createIndexSafe('activitylogs', { userId: 1 })
    await createIndexSafe('activitylogs', { timestamp: 1 }, { expireAfterSeconds: 63072000 }) // 2 years
    
    // Incident Logs collection indexes
    await createIndexSafe('incidentlogs', { companyId: 1, occurredAt: -1 })
    await createIndexSafe('incidentlogs', { pillar: 1 })
    await createIndexSafe('incidentlogs', { status: 1 })
    
    // Framework Templates collection indexes
    await createIndexSafe('frameworktemplates', { framework: 1 })
    await createIndexSafe('frameworktemplates', { pillar: 1 })
    await createIndexSafe('frameworktemplates', { isActive: 1 })
    
    // Stakeholder Engagement collection indexes
    await createIndexSafe('stakeholderengagements', { companyId: 1, engagementDate: -1 })
    await createIndexSafe('stakeholderengagements', { stakeholderType: 1 })
    
    // Supplier Assessment collection indexes
    await createIndexSafe('supplierassessments', { companyId: 1 })
    await createIndexSafe('supplierassessments', { assessmentDate: -1 })
    await createIndexSafe('supplierassessments', { approvalStatus: 1 })
    
    // AI Inferences collection indexes
    await createIndexSafe('aiinferences', { companyId: 1, createdAt: -1 })
    await createIndexSafe('aiinferences', { modelName: 1 })
    
    // ML Model Predictions collection indexes
    await createIndexSafe('mlmodelpredictions', { companyId: 1, predictionDate: -1 })
    await createIndexSafe('mlmodelpredictions', { modelVersion: 1 })
    
    // Document Embeddings collection indexes
    await createIndexSafe('documentembeddings', { companyId: 1 })
    await createIndexSafe('documentembeddings', { documentType: 1 })
    
    console.log('  ✅ Base collections and indexes verified')
  },

  async down(db) {
    console.log('  ▶️  Removing base collections indexes...')
    
    // Note: We typically don't drop indexes in rollback as it might affect existing data
    // If needed, you can drop specific indexes here
    
    console.log('  ✅ Rollback completed')
  }
}
