/**
 * Direct Database Cleanup Script
 * This script directly connects to MongoDB and clears all emissions data
 */

const { MongoClient } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carbondepict'
const DB_NAME = 'carbondepict'

const clearEmissionsData = async () => {
  let client
  
  try {
    console.log('🔄 Connecting to MongoDB...')
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    
    const db = client.db(DB_NAME)
    const emissionsCollection = db.collection('ghgemissions')
    
    // Get count before deletion
    const totalEmissions = await emissionsCollection.countDocuments()
    console.log(`📊 Found ${totalEmissions} emission records`)
    
    if (totalEmissions === 0) {
      console.log('✅ No emissions data to clear')
      return
    }
    
    // Delete all emissions data
    const deleteResult = await emissionsCollection.deleteMany({})
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} emission records`)
    
    // Verify deletion
    const remainingCount = await emissionsCollection.countDocuments()
    console.log(`✅ Remaining emission records: ${remainingCount}`)
    
    // Check user data is preserved
    const usersCollection = db.collection('users')
    const companiesCollection = db.collection('companies')
    
    const userCount = await usersCollection.countDocuments()
    const companyCount = await companiesCollection.countDocuments()
    
    console.log(`👥 Users preserved: ${userCount}`)
    console.log(`🏢 Companies preserved: ${companyCount}`)
    
    console.log('🎉 Emissions data cleanup completed successfully!')
    console.log('📊 All dashboards will now show 0 emissions until new data is entered')
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error)
    throw error
  } finally {
    if (client) {
      await client.close()
      console.log('🔌 Database connection closed')
    }
  }
}

const main = async () => {
  try {
    await clearEmissionsData()
    
    console.log('\n🚀 Cleanup Summary:')
    console.log('   ✅ All emissions data cleared')
    console.log('   ✅ User accounts preserved')
    console.log('   ✅ Company data preserved')
    console.log('   ✅ Dashboards will show 0 emissions')
    console.log('\n💡 Next steps:')
    console.log('   - Enter new data in Scope 1, 2, 3 forms')
    console.log('   - Dashboard will update with new calculations')
    console.log('   - All ESG data will be fresh and accurate')
    
  } catch (error) {
    console.error('💥 Cleanup failed:', error)
    process.exit(1)
  }
}

// Run the script
main()
