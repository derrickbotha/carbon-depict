import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/mongodb/User.js';
import Company from './models/mongodb/Company.js';
import dotenv from 'dotenv';

dotenv.config();

async function debugLogin() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/carbondepict';
    console.log('🔌 Connecting to:', mongoUri);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    const email = 'db@carbondepict.com';
    const password = 'db123!@#DB';

    console.log('🔍 Looking up user:', email);
    const user = await User.findOne({ email }).populate({
      path: 'company',
      select: 'name industry subscription isActive'
    });

    if (!user) {
      console.log('❌ User not found in database');
      return;
    }

    console.log('\n✅ User found!');
    console.log('User Details:');
    console.log('  ID:', user._id);
    console.log('  Email:', user.email);
    console.log('  Name:', user.firstName, user.lastName);
    console.log('  Role:', user.role);
    console.log('  Active:', user.isActive);
    console.log('  Email Verified:', user.emailVerified);
    console.log('  Has password hash:', !!user.password);
    console.log('  Password hash length:', user.password?.length);
    console.log('  Company:', user.company);

    if (!user.isActive) {
      console.log('\n❌ Account is inactive');
      return;
    }

    if (!user.company) {
      console.log('\n❌ Company not found or not populated');
      return;
    }

    if (!user.company.isActive) {
      console.log('\n❌ Company is inactive');
      return;
    }

    console.log('\n🔐 Testing password...');
    console.log('  Password to test:', password);
    console.log('  Hash in DB:', user.password?.substring(0, 30) + '...');
    
    const isPasswordValid = await user.comparePassword(password);
    console.log('  Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('\n❌ Password does not match');
      
      // Try direct bcrypt compare
      console.log('\n🔍 Trying direct bcrypt compare...');
      const directCompare = await bcrypt.compare(password, user.password);
      console.log('  Direct bcrypt result:', directCompare);
      return;
    }

    if (!user.emailVerified) {
      console.log('\n❌ Email not verified');
      return;
    }

    console.log('\n✅ ALL CHECKS PASSED');
    console.log('Login should succeed!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

debugLogin();
