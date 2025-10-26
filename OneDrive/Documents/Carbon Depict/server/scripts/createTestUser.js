// Create test user using MongoDB models
require('dotenv').config();

const { connectMongoDB, mongoose } = require('../config/database')
const { User, Company } = require('../models/mongodb')

async function createTestUser() {
  try {
    await connectMongoDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'db@carbondepict.com' })
    if (existingUser) {
      console.log('User already exists!')
      console.log('Email:', existingUser.email)
      console.log('Name:', existingUser.firstName, existingUser.lastName)
      console.log('Company:', existingUser.companyId)
      process.exit(0)
      return
    }

    // Create company first
    console.log('Creating company...')
    const company = await Company.create({
      name: 'Carbon Depict Test Company',
      industry: 'other',
      size: 'medium',
      country: 'USA',
      settings: {
        fiscalYearStart: '2024-01-01',
        emissionScopes: ['scope1', 'scope2', 'scope3'],
        reportingStandards: ['GRI', 'TCFD', 'CDP', 'SBTI', 'SDG', 'CSRD']
      }
    })
    console.log('Company created with ID:', company._id.toString())

    // Create user - password will be auto-hashed by User model hook
    console.log('Creating user...')
    const user = await User.create({
      email: 'db@carbondepict.com',
      password: 'db123!@#DB',
      firstName: 'DB',
      lastName: 'Admin',
      role: 'admin',
      companyId: company._id,
      emailVerified: true,
      isActive: true
    })

    console.log('\n✅ Test user created successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Email:    db@carbondepict.com')
    console.log('Password: db123!@#DB')
    console.log('Role:     admin')
    console.log('Company:  Carbon Depict Test Company')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\nYou can now login at: http://localhost:3500/login')

    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('Error creating test user:', error)
    process.exit(1)
  }
}

createTestUser()
