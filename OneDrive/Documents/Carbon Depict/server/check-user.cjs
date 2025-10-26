const mongoose = require('mongoose')
require('dotenv').config()

const User = require('./models/mongodb/User.js')

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carbondepict')
    console.log('✅ Connected to MongoDB')

    const user = await User.findOne({ email: 'test@carbondepict.com' })
    
    if (user) {
      console.log('User found:')
      console.log('Email:', user.email)
      console.log('Email Verified:', user.emailVerified)
      console.log('Is Active:', user.isActive)
      console.log('Role:', user.role)
      console.log('Company ID:', user.companyId)
      console.log('Password hash length:', user.password.length)
      
      // Test password comparison
      const bcrypt = require('bcryptjs')
      const isMatch = await bcrypt.compare('TestPassword123!', user.password)
      console.log('Password match:', isMatch)
      
      // Test the comparePassword method
      const isMatchMethod = await user.comparePassword('TestPassword123!')
      console.log('Password match (method):', isMatchMethod)
    } else {
      console.log('❌ User not found')
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
  }
}

checkUser()
