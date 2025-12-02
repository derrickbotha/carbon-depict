import axios from 'axios';

// Test credentials
const credentials = {
  email: 'db@carbondepict.com',
  password: 'db123!@#DB'
};

async function testLogin() {
  console.log('\n=== Testing Login API ===\n');
  console.log('Credentials:', credentials);
  console.log('Target URL: http://localhost:5500/api/auth/login\n');

  try {
    const response = await axios.post('http://localhost:5500/api/auth/login', credentials, {
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: () => true // Don't throw on any status
    });

    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));

    if (response.status === 200) {
      console.log('\n✅ LOGIN SUCCESSFUL!');
      console.log('Token:', response.data.token ? 'Present' : 'Missing');
    } else {
      console.log('\n❌ LOGIN FAILED');
      console.log('Error:', response.data.error || response.data.message);
      
      if (response.data.errors) {
        console.log('Validation Errors:');
        response.data.errors.forEach(err => {
          console.log(`  - ${err.msg || err.message} (${err.param || err.path})`);
        });
      }
    }
  } catch (error) {
    console.error('\n❌ REQUEST FAILED');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response Data:', error.response.data);
    }
  }
}

testLogin();
