#!/usr/bin/env node

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { User } = require('./models/mongodb')

async function testPassword() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/carbondepict'
    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB\n')

    const email = 'db@carbondepict.com'
    const password = 'db123!@#DB'

    console.log(`🔍 Testing login for: ${email}`)
    console.log(`   Password: ${password}\n`)

    const user = await User.findOne({ email })
    
    if (!user) {
      console.log('❌ User not found!')
      return
    }

    console.log('User found:')
    console.log('  Email:', user.email)
    console.log('  Password hash:', user.password)
    console.log('  Email Verified:', user.emailVerified)
    console.log('  Active:', user.isActive)
    console.log('')

    // Test comparePassword method
    console.log('Testing comparePassword method...')
    const isValid1 = await user.comparePassword(password)
    console.log(`  Result: ${isValid1 ? '✅ VALID' : '❌ INVALID'}`)
    console.log('')

    // Test bcrypt.compare directly
    console.log('Testing bcrypt.compare directly...')
    const isValid2 = await bcrypt.compare(password, user.password)
    console.log(`  Result: ${isValid2 ? '✅ VALID' : '❌ INVALID'}`)
    console.log('')

    // Test with various passwords
    const testPasswords = [
      'db123!@#DB',
      'dbadmin#DB123',
      'db123',
      'admin123'
    ]

    console.log('Testing multiple passwords:')
    for (const testPass of testPasswords) {
      const valid = await bcrypt.compare(testPass, user.password)
      console.log(`  ${testPass}: ${valid ? '✅' : '❌'}`)
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await mongoose.connection.close()
  }
}

testPassword()
