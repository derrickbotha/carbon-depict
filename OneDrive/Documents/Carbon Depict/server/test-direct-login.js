const mongoose = require('mongoose');
const { User } = require('./models/mongodb');

async function testLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/carbondepict');
    console.log('Connected to MongoDB');

    const email = 'db@carbondepict.com';
    const password = 'Db123!Admin&';

    // Test the login logic
    const user = await User.findOne({ email })
      .populate({
        path: 'companyId',
        select: 'name industry subscription isActive'
      });

    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log('✅ User found:', user.email);
    console.log('   Company:', user.companyId ? user.companyId.name : 'NO COMPANY');
    console.log('   Active:', user.isActive);
    console.log('   Email Verified:', user.emailVerified);

    // Test password
    const isPasswordValid = await user.comparePassword(password);
    console.log('   Password valid:', isPasswordValid);

    // Check company
    if (user.companyId) {
      console.log('   Company ID:', user.companyId._id);
      console.log('   Company Active:', user.companyId.isActive);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testLogin();
