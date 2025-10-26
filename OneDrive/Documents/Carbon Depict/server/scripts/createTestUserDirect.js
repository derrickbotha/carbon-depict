require('dotenv').config()

const { connectDatabases, disconnectDatabases } = require('../config/database')
const { Company } = require('../models/mongodb')
const { createOrUpdateAdmin } = require('../create-db-user')

async function createTestUser() {
  try {
    await connectDatabases()

    const companyName = process.env.CARBON_TEST_COMPANY_NAME || 'Carbon Depict Test Company'
    let company = await Company.findOne({ name: companyName })

    if (!company) {
      console.log('📝 Creating company...')
      company = await Company.create({
        name: companyName,
        industry: process.env.CARBON_TEST_COMPANY_INDUSTRY || 'other',
        region: process.env.CARBON_TEST_COMPANY_REGION || 'uk',
        isActive: true,
        settings: {
          dateFormat: 'yyyy-mm-dd',
          unitSystem: 'metric',
          notifications: {
            email: true,
            monthlyReports: true,
            factorUpdates: false,
          },
        },
      })
      console.log('✓ Company created with ID:', company._id.toString())
    } else {
      console.log('✓ Company exists with ID:', company._id.toString())
    }

    console.log('👤 Ensuring test user exists...')
    const { userId } = await createOrUpdateAdmin({
      email: process.env.CARBON_TEST_USER_EMAIL || 'db@carbondepict.com',
      password: process.env.CARBON_TEST_USER_PASSWORD || 'db123!@#DB',
      firstName: process.env.CARBON_TEST_USER_FIRST || 'DB',
      lastName: process.env.CARBON_TEST_USER_LAST || 'Admin',
      role: process.env.CARBON_TEST_USER_ROLE || 'admin',
      company,
      skipConnection: true,
    })

    console.log('\n✅ Test user ready!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Email:', process.env.CARBON_TEST_USER_EMAIL || 'db@carbondepict.com')
    console.log('Password:', process.env.CARBON_TEST_USER_PASSWORD || 'db123!@#DB')
    console.log('Role:', process.env.CARBON_TEST_USER_ROLE || 'admin')
    console.log('Company:', companyName)
    console.log('User ID:', userId.toString())
    console.log('Company ID:', company._id.toString())
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n🌐 You can now login at: http://localhost:3500/login')
  } catch (err) {
    console.error('❌ Error creating test user:', err.message)
    console.error(err)
    process.exitCode = 1
  } finally {
    await disconnectDatabases()
  }
}

createTestUser().catch(() => {
  process.exitCode = process.exitCode || 1
})
