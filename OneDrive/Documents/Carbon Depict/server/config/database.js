const { Sequelize } = require('sequelize')
const mongoose = require('mongoose')

// PostgreSQL Connection (Relational Data)
const sequelize = new Sequelize(
  process.env.POSTGRES_DB || 'carbondepict',
  process.env.POSTGRES_USER || 'postgres',
  process.env.POSTGRES_PASSWORD || 'postgres',
  {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
)

// MongoDB Connection (Non-Relational Data)
const connectMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/carbondepict'
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('📦 MongoDB connected successfully')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message)
    // Don't exit process, allow app to run with PostgreSQL only
  }
}

// Test PostgreSQL Connection
const connectPostgreSQL = async () => {
  try {
    await sequelize.authenticate()
    console.log('🐘 PostgreSQL connected successfully')
    
    // Sync models in development (creates tables)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true })
      console.log('📊 PostgreSQL tables synchronized')
    }
  } catch (error) {
    console.error('❌ PostgreSQL connection error:', error.message)
    process.exit(1)
  }
}

// Initialize both databases
const connectDatabases = async () => {
  await connectPostgreSQL()
  await connectMongoDB()
}

module.exports = {
  sequelize,
  mongoose,
  connectDatabases,
}
