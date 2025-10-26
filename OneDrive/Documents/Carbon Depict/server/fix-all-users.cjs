const mongoose = require('mongoose')
require('dotenv').config()

const User = require('./models/mongodb/User.js')

const fixAllTestUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carbondepict')
    console.log('✅ Connected to MongoDB')

    const users = await User.find({ 
      email: { $in: ['manager@carbondepict.com', 'user@carbondepict.com'] } 
    })
    
    for (const user of users) {
      console.log(`Fixing ${user.email}...`)
      
      // Update email verification
      user.emailVerified = true
      
      // Reset password based on email
      if (user.email === 'manager@carbondepict.com') {
        user.password = 'ManagerPass123!'
      } else if (user.email === 'user@carbondepict.com') {
        user.password = 'UserPass123!'
      }
      
      await user.save()
      console.log(`✅ Fixed ${user.email}`)
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
  }
}

fixAllTestUsers()
