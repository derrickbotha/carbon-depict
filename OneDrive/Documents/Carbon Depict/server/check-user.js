const { connectDatabases, disconnectDatabases } = require('./config/database')
const { User } = require('./models/mongodb')

const TARGET_EMAIL = process.argv[2] || process.env.CARBON_CHECK_USER_EMAIL || 'db@carbondepict.com'

async function checkUser() {
  try {
    await connectDatabases()
    console.log('✅ Connected to MongoDB')

    const user = await User.findOne({ email: TARGET_EMAIL }).populate('company')

    if (user) {
      console.log('\n👤 User found:')
      console.log('   Email:', user.email)
      console.log('   Name:', [user.firstName || '', user.lastName || ''].join(' ').trim() || '(not set)')
      console.log('   Role:', user.role)
      console.log('   Active:', user.isActive)
      console.log('   Email Verified:', user.emailVerified)
      console.log('   Company ID:', user.companyId ? user.companyId.toString() : 'none')
      console.log('   Company:', user.company ? user.company.name : 'none')
      console.log('   Created:', user.createdAt)
      console.log('   Updated:', user.updatedAt)
    } else {
      console.log('❌ User not found for email:', TARGET_EMAIL)
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error(error)
    process.exitCode = 1
  } finally {
    await disconnectDatabases()
  }
}

checkUser().catch(() => {
  process.exitCode = process.exitCode || 1
})
