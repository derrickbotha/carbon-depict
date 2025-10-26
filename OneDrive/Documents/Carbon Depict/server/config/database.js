const mongoose = require('mongoose')

// MongoDB Connection (Document Store for the entire application)
const connectMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/carbondepict'

    await mongoose.connect(mongoUri, {
      maxPoolSize: parseInt(process.env.MONGO_POOL_MAX, 10) || 10,
      minPoolSize: parseInt(process.env.MONGO_POOL_MIN, 10) || 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      connectTimeoutMS: 10000,
      retryWrites: true,
      retryReads: true,
      autoIndex: process.env.NODE_ENV === 'development',
    })

    mongoose.connection.on('connected', () => {
      console.log('📦 MongoDB connected successfully')
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
