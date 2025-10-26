const { connectDatabases, disconnectDatabases } = require('./config/database')
const models = require('./models/mongodb')
const { createOrUpdateAdmin } = require('./create-db-user')

const DEFAULT_COMPANY_NAME = process.env.CARBON_COMPANY_NAME || 'CarbonDepict'
const DEFAULT_COMPANY_INDUSTRY = process.env.CARBON_COMPANY_INDUSTRY || 'energy'
const DEFAULT_COMPANY_REGION = process.env.CARBON_COMPANY_REGION || 'uk'
const SHOULD_CREATE_ADMIN = String(process.env.CARBON_SETUP_CREATE_ADMIN || 'true').toLowerCase() !== 'false'

async function syncIndexes() {
	console.log('🛠️  Syncing MongoDB indexes...')
	const entries = Object.entries(models)

	for (const [name, model] of entries) {
		if (model && typeof model.syncIndexes === 'function') {
			try {
				await model.syncIndexes()
				console.log(`   ✅ ${name} indexes in sync`)
			} catch (err) {
				console.error(`   ❌ Failed to sync indexes for ${name}:`, err.message)
				throw err
			}
		}
	}
}

async function ensureDefaultCompany() {
	const { Company } = models

	let company = await Company.findOne({ name: DEFAULT_COMPANY_NAME })

	if (company) {
		console.log('🏢 Default company found:', company._id.toString())
		return company
	}

	console.log('🏗️  Creating default company...')
	company = await Company.create({
		name: DEFAULT_COMPANY_NAME,
		industry: DEFAULT_COMPANY_INDUSTRY,
		region: DEFAULT_COMPANY_REGION,
		isActive: true,
	})
	console.log('✅ Default company created:', company._id.toString())
	return company
}

async function run() {
	console.log('🔧 Starting MongoDB setup...')
	await connectDatabases()

	try {
		const company = await ensureDefaultCompany()
		await syncIndexes()

		if (SHOULD_CREATE_ADMIN) {
			console.log('👤 Ensuring admin account exists...')
			await createOrUpdateAdmin({ company, skipConnection: true })
		} else {
			console.log('ℹ️  Skipping admin creation (CARBON_SETUP_CREATE_ADMIN set to false)')
		}

		console.log('🎉 MongoDB setup completed successfully')
	} catch (err) {
		console.error('❌ Setup failed:', err.message)
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

module.exports = { run }
