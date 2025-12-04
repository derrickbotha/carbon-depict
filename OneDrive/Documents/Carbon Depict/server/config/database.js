const mongoose = require('mongoose')

// MongoDB Connection (Document Store for the entire application)
const connectMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/carbondepict'

    // Production-optimized connection pool settings
    const connectionOptions = {
      // Connection Pool Configuration
      maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE, 10) ||
        parseInt(process.env.MONGO_POOL_MAX, 10) ||
        (process.env.NODE_ENV === 'production' ? 50 : 10),
      minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE, 10) ||
        parseInt(process.env.MONGO_POOL_MIN, 10) ||
        (process.env.NODE_ENV === 'production' ? 10 : 2),

      // Timeout Configuration
      serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS, 10) || 5000,
      socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT_MS, 10) || 45000,
      connectTimeoutMS: parseInt(process.env.MONGODB_CONNECT_TIMEOUT_MS, 10) || 10000,

      // Network Configuration
      family: 4, // Use IPv4

      // Resilience Configuration
      retryWrites: true,
      retryReads: true,

      // Performance Configuration
      autoIndex: process.env.NODE_ENV === 'development', // Disable in production for performance

      // Write Concern (for data integrity in production)
      writeConcern: {
        w: process.env.NODE_ENV === 'production' ? 'majority' : 1,
        j: true, // Journal writes for durability
        wtimeout: 5000
      },

      // Read Preference (for load distribution)
      readPreference: process.env.NODE_ENV === 'production' ? 'primaryPreferred' : 'primary',

      // Compression (for network efficiency in production)
      compressors: process.env.NODE_ENV === 'production' ? ['zlib'] : [],
    }

    try {
      await mongoose.connect(mongoUri, connectionOptions)
    } catch (err) {
      console.warn('⚠️ Failed to connect to primary MongoDB, attempting to start in-memory database...', err.message)
      const { MongoMemoryServer } = require('mongodb-memory-server')
      const mongod = await MongoMemoryServer.create()
      const uri = mongod.getUri()
      console.log('📦 Started in-memory MongoDB at', uri)
      await mongoose.connect(uri, connectionOptions)
    }

    mongoose.connection.on('connected', () => {
      const poolSize = connectionOptions.maxPoolSize
      const env = process.env.NODE_ENV || 'development'
      console.log(`📦 MongoDB connected successfully`)
      console.log(`   Environment: ${env}`)
      console.log(`   Pool Size: ${connectionOptions.minPoolSize}-${poolSize} connections`)
      console.log(`   Database: ${mongoUri.split('/').pop().split('?')[0]}`)
    })

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message)
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected')
    })
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    throw error
  }
}

const connectDatabases = async () => {
  await connectMongoDB()
}

const disconnectDatabases = async () => {
  await mongoose.connection.close()
}

module.exports = {
  mongoose,
  connectMongoDB,
  connectDatabases,
  disconnectDatabases,
}
