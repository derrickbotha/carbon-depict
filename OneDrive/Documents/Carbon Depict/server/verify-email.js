const { connectDatabases, disconnectDatabases } = require('./config/database')
const { User } = require('./models/mongodb')

const TARGET_EMAIL = process.argv[2] || process.env.CARBON_VERIFY_EMAIL || 'db@carbondepict.com'

async function verifyEmail() {
  try {
    await connectDatabases()
    console.log('🔌 Connected to MongoDB')

    const user = await User.findOne({ email: TARGET_EMAIL })

    if (!user) {
      console.log('❌ User not found for email:', TARGET_EMAIL)
      process.exitCode = 1
      return
    }

    user.emailVerified = true
    await user.save()

    console.log('\n✅ Email verification flag set!')
    console.log('📋 Updated user:')
    console.log('   Email:', user.email)
    console.log('   Email Verified:', user.emailVerified)
    console.log('   Role:', user.role)
    console.log('   Active:', user.isActive)
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error)
    process.exitCode = 1
  } finally {
    await disconnectDatabases()
    console.log('\n🔌 Database connection closed')
  }
}

verifyEmail().catch(() => {
  process.exitCode = process.exitCode || 1
})
