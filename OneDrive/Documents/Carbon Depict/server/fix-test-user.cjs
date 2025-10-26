const mongoose = require('mongoose')
require('dotenv').config()

const User = require('./models/mongodb/User.js')

const fixTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carbondepict')
    console.log('✅ Connected to MongoDB')

    const user = await User.findOne({ email: 'test@carbondepict.com' })
    
    if (user) {
      console.log('Fixing test user...')
      
      // Update email verification
      user.emailVerified = true
      
      // Reset password (let the pre-save hook hash it properly)
      user.password = 'TestPassword123!'
      
      await user.save()
      console.log('✅ User updated successfully')
      
      // Verify the fix
      const updatedUser = await User.findOne({ email: 'test@carbondepict.com' })
      console.log('Email Verified:', updatedUser.emailVerified)
      
      const isMatch = await updatedUser.comparePassword('TestPassword123!')
      console.log('Password match:', isMatch)
      
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

fixTestUser()
