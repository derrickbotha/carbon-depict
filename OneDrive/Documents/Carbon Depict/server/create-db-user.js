const { connectDatabases, disconnectDatabases } = require('./config/database')
const { Company, User } = require('./models/mongodb')

const DEFAULT_EMAIL = process.env.CARBON_ADMIN_EMAIL || 'db@carbondepict.com'
const DEFAULT_PASSWORD = process.env.CARBON_ADMIN_PASSWORD || 'db123!@#DB'
const DEFAULT_COMPANY = process.env.CARBON_COMPANY_NAME || 'CarbonDepict'
const DEFAULT_FIRST_NAME = process.env.CARBON_ADMIN_FIRST_NAME || 'DB'
const DEFAULT_LAST_NAME = process.env.CARBON_ADMIN_LAST_NAME || 'Admin'

async function createOrUpdateAdmin(options = {}) {
  const {
    email = DEFAULT_EMAIL,
    password = DEFAULT_PASSWORD,
    firstName = DEFAULT_FIRST_NAME,
    lastName = DEFAULT_LAST_NAME,
    role = 'admin',
    companyName = DEFAULT_COMPANY,
    companyId = null,
    company = null,
    ensureCompany = true,
    skipConnection = false,
  } = options

  let managedConnection = false

  try {
    if (!skipConnection) {
      console.log('🔌 Connecting to MongoDB...')
      await connectDatabases()
      managedConnection = true
      console.log('✅ MongoDB connection established')
    }

    let targetCompany = company

    if (!targetCompany) {
      if (companyId) {
        targetCompany = await Company.findById(companyId)
      } else if (companyName) {
        targetCompany = await Company.findOne({ name: companyName })
      }
    }

    if (!targetCompany && ensureCompany) {
      console.log('📦 Creating default company...')
      targetCompany = await Company.create({
        name: companyName,
        industry: process.env.CARBON_COMPANY_INDUSTRY || 'energy',
        region: process.env.CARBON_COMPANY_REGION || 'uk',
        isActive: true,
      })
      console.log('✅ Company created:', targetCompany._id.toString())
    }

    if (!targetCompany) {
      throw new Error('Company not found. Provide an existing companyId/companyName or allow ensureCompany to create one.')
    }

    let user = await User.findOne({ email })

    if (user) {
      console.log('⚠️  User already exists with email:', email)
      console.log('🔄 Updating password and verifying email...')
      user.password = password
      user.firstName = firstName
      user.lastName = lastName
      user.role = role
      user.emailVerified = true
      user.companyId = targetCompany._id
      await user.save()
      console.log('✅ Password and profile updated successfully!')
    } else {
      console.log('👤 Creating new admin user...')
      user = await User.create({
        email,
        password,
        firstName,
        lastName,
        role,
        isActive: true,
        emailVerified: true,
        companyId: targetCompany._id,
      })
      console.log('✅ User created successfully!')
      console.log('📧 Email:', email)
      console.log('🔑 Password:', password)
      console.log('👤 User ID:', user._id.toString())
    }

    console.log('🏢 Company ID:', targetCompany._id.toString())
    console.log('\n🎉 Done! You can now login with:')
    console.log('   Email:', email)
    console.log('   Password:', password)

    return { userId: user._id, companyId: targetCompany._id }
  } catch (err) {
    console.error('❌ Error:', err.message)
    console.error(err)
    process.exitCode = 1
    throw err
  } finally {
    if (managedConnection) {
      await disconnectDatabases()
      console.log('\n🔌 Database connection closed')
    }
  }
}

if (require.main === module) {
  createOrUpdateAdmin().catch(() => {
    // Errors are logged in the function; ensure process exits with failure when run via CLI.
    process.exitCode = process.exitCode || 1
  })
}

module.exports = { createOrUpdateAdmin }
