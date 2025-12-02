import mongoose from 'mongoose';

async function checkUser() {
  try {
    await mongoose.connect('mongodb://localhost:27017/carbondepict');
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const user = await db.collection('users').findOne({ email: 'db@carbondepict.com' });
    
    if (!user) {
      console.log('❌ User not found!');
      console.log('The user db@carbondepict.com does not exist in the database.');
    } else {
      console.log('✅ User found!\n');
      console.log('User Details:');
      console.log('  ID:', user._id);
      console.log('  Email:', user.email);
      console.log('  Name:', user.firstName, user.lastName);
      console.log('  Role:', user.role);
      console.log('  Email Verified:', user.emailVerified || user.isEmailVerified);
      console.log('  Active:', user.isActive);
      console.log('  Company ID:', user.companyId || user.company);
      console.log('  Last Login:', user.lastLogin || 'Never');
      console.log('  Has Password:', !!user.password);
      console.log('  Password (hash starts with):', user.password?.substring(0, 30));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

checkUser();