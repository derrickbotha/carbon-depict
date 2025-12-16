#!/usr/bin/env node
/**
 * Test script to verify login fix works
 * This tests the login logic without running the full server
 */

const mongoose = require('mongoose');
const { User, Company } = require('./models/mongodb');
const bcrypt = require('bcryptjs');

async function testLoginFix() {
  try {
    console.log('🔍 Testing login fix...\n');

    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/carbondepict';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Test email and password
    const email = 'db@carbondepict.com';
    const password = 'Db123!Admin&';

    console.log(`\n📧 Testing login for: ${email}`);
    console.log(`🔑 Password: ${password}\n`);

    // Simulate the login route logic with the FIX
    const user = await User.findOne({ email })
      .populate({
        path: 'companyId',  // FIXED: was 'company', now 'companyId'
        select: 'name industry subscription isActive'
      });

    if (!user) {
      console.log('❌ FAILED: User not found');
      process.exit(1);
    }

    console.log('✅ User found:', user.email);
    console.log('   First Name:', user.firstName);
    console.log('   Last Name:', user.lastName);
    console.log('   Role:', user.role);
    console.log('   Active:', user.isActive);
    console.log('   Email Verified:', user.emailVerified);

    // Check company population (FIXED)
    if (!user.companyId) {
      console.log('❌ FAILED: Company not populated');
      process.exit(1);
    }

    console.log('\n✅ Company populated:', user.companyId.name);
    console.log('   Industry:', user.companyId.industry);
    console.log('   Subscription:', user.companyId.subscription);
    console.log('   Active:', user.companyId.isActive);

    // Test password
    const isPasswordValid = await user.comparePassword(password);
    console.log('\n🔑 Password validation:', isPasswordValid ? '✅ VALID' : '❌ INVALID');

    if (!isPasswordValid) {
      console.log('❌ FAILED: Password does not match');
      console.log('\nℹ️  Note: The password in the seeder is "Db123!Admin&"');
      process.exit(1);
    }

    // Check all conditions from login route
    console.log('\n🔍 Checking login conditions:');

    if (!user.companyId.isActive) {
      console.log('❌ FAILED: Company is not active');
      process.exit(1);
    }
    console.log('✅ Company is active');

    if (!user.isActive) {
      console.log('❌ FAILED: User is not active');
      process.exit(1);
    }
    console.log('✅ User is active');

    if (!user.emailVerified) {
      console.log('❌ FAILED: Email is not verified');
      process.exit(1);
    }
    console.log('✅ Email is verified');

    // Test response object construction (FIXED)
    const response = {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: user.emailVerified,
        company: {
          id: user.companyId.id,           // FIXED: was user.company.id
          name: user.companyId.name,       // FIXED: was user.company.name
          industry: user.companyId.industry,
          subscription: user.companyId.subscription
        }
      }
    };

    console.log('\n✅ Response object constructed successfully:');
    console.log(JSON.stringify(response, null, 2));

    console.log('\n✅ ✅ ✅ ALL TESTS PASSED! ✅ ✅ ✅');
    console.log('\n📝 The login fix is working correctly.');
    console.log('   Please restart your server to load the updated code.\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log('\n❌ TEST FAILED WITH ERROR:');
    console.error('   Error:', error.message);
    console.error('   Stack:', error.stack);
    process.exit(1);
  }
}

testLoginFix();
