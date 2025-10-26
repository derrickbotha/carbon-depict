require('dotenv').config()

const { connectDatabases, disconnectDatabases, mongoose } = require('./config/database')

async function testMongo() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/carbondepict'
  console.log('Testing MongoDB connection...')
  console.log('MONGODB_URI:', uri)

  try {
    await connectDatabases()
    const { host, port, name } = mongoose.connection
    console.log('✅ Connection successful!')
    console.log('   Host:', host)
    console.log('   Port:', port)
    console.log('   Database:', name)

    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log('   Collections:', collections.map((c) => c.name).join(', ') || '(none)')
  } catch (err) {
    console.error('❌ Connection failed:', err.message)
    console.error(err)
    process.exitCode = 1
  } finally {
    await disconnectDatabases()
  }
}

testMongo().catch(() => {
  process.exitCode = process.exitCode || 1
})
