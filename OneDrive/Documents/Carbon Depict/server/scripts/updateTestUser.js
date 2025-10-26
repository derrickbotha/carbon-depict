// Update test user using MongoDB models
require('dotenv').config()

const { connectMongoDB, mongoose } = require('../config/database')
const { User } = require('../models/mongodb')

async function updateTestUser() {
  try {
    await connectMongoDB()

    console.log('Looking for test user...')

    const user = await User.findOne({ email: 'db@carbondepict.com' })

    if (!user) {
      console.log('❌ Test user not found!')
      console.log('Please run: node scripts/createTestUser.js')
      process.exit(1)
    }

    user.emailVerified = true
    user.isActive = true
    await user.save()

    console.log('\n✅ Test user updated successfully!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Email:          db@carbondepict.com')
    console.log('Password:       db123!@#DB')
    console.log('Role:           ' + user.role)
    console.log('Email Verified: ' + user.emailVerified)
    console.log('Active:         ' + user.isActive)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('\n✅ You can now login at: http://localhost:3500/login')

    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('Error updating test user:', error)
    process.exit(1)
  }
}

updateTestUser()
