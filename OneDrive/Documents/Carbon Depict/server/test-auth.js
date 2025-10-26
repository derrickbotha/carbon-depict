/**
 * Test script to debug authentication errors
 * Run this to ensure MongoDB auth data is healthy
 */

require('dotenv').config()
const { connectDatabases, disconnectDatabases, mongoose } = require('./config/database')
const { User, Company } = require('./models/mongodb')

async function testAuth() {
  try {
    console.log('🔍 Testing authentication setup...\n')

    console.log('1. Testing MongoDB connection...')
    await connectDatabases()
    const { host, port, name } = mongoose.connection
    console.log(`✅ MongoDB connected to ${host}:${port}/${name}\n`)

    console.log('2. Checking User collection...')
    const userCount = await User.countDocuments()
    console.log(`✅ User collection reachable. Found ${userCount} users\n`)

    console.log('3. Testing Company references...')
    if (userCount > 0) {
      const testUser = await User.findOne().populate('company')

      if (testUser) {
        console.log('✅ Sample user loaded')
        console.log('Sample user:', {
          id: testUser._id.toString(),
          email: testUser.email,
          companyId: testUser.companyId ? testUser.companyId.toString() : null,
          hasCompany: !!testUser.company,
        })

        if (!testUser.company && testUser.companyId) {
          const companyExists = await Company.exists({ _id: testUser.companyId })
          console.log('   Company reference valid:', !!companyExists)
        }
      } else {
        console.log('⚠️  Could not load a user document despite count > 0')
      }
    } else {
      console.log('⚠️  No users exist to test with')
      console.log('   Run: node create-db-user.js to seed an admin')
    }

    console.log('\n✅ MongoDB authentication checks passed!')
    console.log('   If you still see auth errors, inspect backend logs during login attempts.\n')
  } catch (error) {
    console.error('\n❌ Test failed with error:')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('\nFull error:', error)
    process.exitCode = 1
  } finally {
    await disconnectDatabases()
  }
}

testAuth().catch(() => {
  process.exitCode = process.exitCode || 1
})
