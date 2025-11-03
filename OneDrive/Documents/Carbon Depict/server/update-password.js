#!/usr/bin/env node

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { User } = require('./models/mongodb')

async function updatePassword() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/carbondepict'
    await mongoose.connect(mongoUri)
    console.log('✅ Connected to MongoDB\n')

    const email = 'db@carbondepict.com'
    const newPassword = 'db123!@#DB'

    console.log(`🔍 Finding user: ${email}`)
    const user = await User.findOne({ email })
    
    if (!user) {
      console.log('❌ User not found!')
      return
    }

    console.log('✅ User found')
    console.log(`🔑 Updating password to: ${newPassword}\n`)

    // Update password - this will trigger the pre-save hook to hash it
    user.password = newPassword
    await user.save()

    console.log('✅ Password updated successfully!')
    console.log('   New hash:', user.password)
    
    // Verify the new password works
    console.log('\n🧪 Testing new password...')
    const isValid = await user.comparePassword(newPassword)
    console.log(`   Result: ${isValid ? '✅ VALID' : '❌ INVALID'}`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await mongoose.connection.close()
    console.log('\n✅ Done')
  }
}

updatePassword()
