const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User and Company models
const User = require('./models/mongodb/User');
const Company = require('./models/mongodb/Company');

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/carbon-depict', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    const email = 'db@carbondepict.com';
    const password = 'dbadmin#DB123';

    // Find or create company
    let company = await Company.findOne({ name: 'Carbon Depict' });
    if (!company) {
      company = await Company.create({
        name: 'Carbon Depict',
        industry: 'other',
        size: 'small',
        country: 'United States',
        isActive: true,
        subscription: 'enterprise'
      });
      console.log('✅ Company created:', company.name);
    } else {
      console.log('✅ Company found:', company.name);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('⚠️  User already exists. Updating password and verification status...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Update user
      existingUser.password = hashedPassword;
      existingUser.emailVerified = true;
      existingUser.verificationToken = null;
      existingUser.role = 'admin';
      existingUser.companyId = company._id;
      existingUser.isActive = true;
      
      await existingUser.save();
      console.log('✅ User updated successfully!');
      console.log('📧 Email:', existingUser.email);
      console.log('✔️  Email Verified:', existingUser.emailVerified);
      console.log('👤 Role:', existingUser.role);
      console.log('🏢 Company:', company.name);
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new User({
        email,
        password: hashedPassword,
        firstName: 'Derrick',
        lastName: 'Admin',
        role: 'admin',
        emailVerified: true,
        verificationToken: null,
        companyId: company._id,
        isActive: true
      });

      await newUser.save();
      console.log('✅ Test user created successfully!');
      console.log('📧 Email:', newUser.email);
      console.log('🔑 Password: dbadmin#DB123');
      console.log('✔️  Email Verified:', newUser.emailVerified);
      console.log('👤 Role:', newUser.role);
      console.log('🏢 Company:', company.name);
    }

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test user:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createTestUser();
