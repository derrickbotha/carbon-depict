const { connectDatabases, disconnectDatabases, mongoose } = require('./config/database')
const { Company, User } = require('./models/mongodb')

function parseArgs(argv) {
	return argv.reduce((acc, arg) => {
		const trimmed = arg.trim()
		if (!trimmed.startsWith('--')) {
			return acc
		}

		const [key, value = ''] = trimmed.slice(2).split('=')
		if (!key) {
			return acc
		}

		acc[key] = value
		return acc
	}, {})
}

async function resolveCompany(args) {
	const companyId = args.companyId || args.companyID
	const companyName = args.company || args.companyName || process.env.CARBON_COMPANY_NAME
	const autoCreate = String(args.createCompany || process.env.CARBON_CREATE_USER_AUTO_COMPANY || 'false').toLowerCase() === 'true'

	if (companyId) {
		if (!mongoose.Types.ObjectId.isValid(companyId)) {
			throw new Error('Invalid companyId supplied')
		}
		const company = await Company.findById(companyId)
		if (!company) {
			throw new Error(`Company not found for id ${companyId}`)
		}
		return company
	}

	if (!companyName) {
		throw new Error('Provide --company=<name> or --companyId=<id>, or set CARBON_COMPANY_NAME')
	}

	let company = await Company.findOne({ name: companyName })

	if (!company && autoCreate) {
		console.log('🏗️  Creating company:', companyName)
		company = await Company.create({
			name: companyName,
			industry: process.env.CARBON_COMPANY_INDUSTRY || 'energy',
			region: process.env.CARBON_COMPANY_REGION || 'uk',
			isActive: true,
		})
		console.log('✅ Company created:', company._id.toString())
	}

	if (!company) {
		throw new Error(`Company '${companyName}' not found. Use --createCompany=true to auto-create it.`)
	}

	return company
}

async function createOrUpdateUser(args) {
	const email = args.email || process.env.CARBON_CREATE_USER_EMAIL
	const password = args.password || process.env.CARBON_CREATE_USER_PASSWORD

	if (!email) {
		throw new Error('Missing required --email=<value> argument')
	}

	if (!password) {
		throw new Error('Missing required --password=<value> argument')
	}

	const company = await resolveCompany(args)
	const allowUpdate = String(args.updateExisting || process.env.CARBON_CREATE_USER_UPDATE || 'true').toLowerCase() !== 'false'

	let user = await User.findOne({ email })

	if (user && !allowUpdate) {
		throw new Error(`User with email ${email} already exists. Pass --updateExisting=false to prevent updates or remove the user first.`)
	}

	const payload = {
		email,
		password,
		firstName: args.firstName || process.env.CARBON_CREATE_USER_FIRST || '',
		lastName: args.lastName || process.env.CARBON_CREATE_USER_LAST || '',
		role: args.role || process.env.CARBON_CREATE_USER_ROLE || 'user',
		isActive: String(args.isActive || process.env.CARBON_CREATE_USER_ACTIVE || 'true').toLowerCase() !== 'false',
		emailVerified: String(args.emailVerified || process.env.CARBON_CREATE_USER_VERIFY || 'true').toLowerCase() !== 'false',
		companyId: company._id,
	}

	if (user) {
		console.log('⚠️  User exists, updating credentials and profile...')
		Object.assign(user, payload)
		await user.save()
		console.log('✅ User updated:', user._id.toString())
		return { user, company }
	}

	console.log('👤 Creating new user...')
	user = await User.create(payload)
	console.log('✅ User created:', user._id.toString())
	return { user, company }
}

async function run() {
	const args = parseArgs(process.argv.slice(2))
	await connectDatabases()

	try {
		const { user, company } = await createOrUpdateUser(args)

		console.log('\n📄 Summary')
		console.log('   Email:', user.email)
		console.log('   User ID:', user._id.toString())
		console.log('   Company ID:', company._id.toString())
		console.log('   Role:', user.role)
		console.log('   Email Verified:', user.emailVerified)
		console.log('   Active:', user.isActive)
		console.log('\n🎉 Done! The password will be hashed automatically before storage.')
	} catch (err) {
		console.error('❌ Error:', err.message)
		console.error(err)
		process.exitCode = 1
	} finally {
		await disconnectDatabases()
		console.log('🔌 MongoDB connection closed')
	}
}

if (require.main === module) {
	run().catch(() => {
		process.exitCode = process.exitCode || 1
	})
}

module.exports = { run, createOrUpdateUser }
