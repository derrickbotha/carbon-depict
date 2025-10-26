// Delete test user (MongoDB)
require('dotenv').config()

const { connectMongoDB, mongoose } = require('../config/database')
const { User } = require('../models/mongodb')

async function deleteTestUser() {
  try {
    await connectMongoDB()

    console.log('Looking for test user...')

    const user = await User.findOne({ email: 'db@carbondepict.com' })

    if (!user) {
      console.log('❌ Test user not found!')
      await mongoose.connection.close()
      process.exit(1)
    }

    await user.deleteOne()

    console.log('\n✅ Test user deleted successfully!')
    console.log('You can now recreate it with: node scripts/createTestUser.js')

    await mongoose.connection.close()
    process.exit(0)
  } catch (error) {
    console.error('Error deleting test user:', error)
    process.exit(1)
  }
}

deleteTestUser()
