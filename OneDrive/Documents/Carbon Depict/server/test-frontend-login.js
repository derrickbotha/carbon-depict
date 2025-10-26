const axios = require('axios');

// Test login from frontend perspective
async function testFrontendLogin() {
  console.log('\n=== Testing Frontend Login ===\n');
  
  const credentials = {
    email: 'db@carbondepict.com',
    password: 'db123!@#DB'
  };

  console.log('Attempting login with:');
  console.log('  Email:', credentials.email);
  console.log('  Password:', credentials.password);
  console.log('\nSending POST request to: http://localhost:3500/api/auth/login');
  console.log('(This goes through Vite proxy to http://localhost:5500/api/auth/login)\n');

  try {
    const response = await axios.post('http://localhost:3500/api/auth/login', credentials, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      validateStatus: function (status) {
        return true; // Don't throw for any status code
      }
    });

    console.log('=== RESPONSE ===');
    console.log('Status:', response.status, response.statusText);
    console.log('\nResponse Data:');
    console.log(JSON.stringify(response.data, null, 2));

    if (response.status === 200) {
      console.log('\n✅ LOGIN SUCCESSFUL!');
      console.log('Token received:', response.data.token ? 'Yes' : 'No');
      console.log('User data:', response.data.user ? 'Yes' : 'No');
    } else {
      console.log('\n❌ LOGIN FAILED!');
      console.log('Error:', response.data.error || response.data.message);
      
      // Additional debugging
      if (response.status === 403 && response.data.emailVerified === false) {
        console.log('\n⚠️  EMAIL NOT VERIFIED');
        console.log('The backend is rejecting login because email is not verified.');
        console.log('Run: node scripts/updateTestUser.js to fix this.');
      }
    }
  } catch (error) {
    console.error('\n❌ REQUEST FAILED!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
      console.error('Check:');
      console.error('  - Frontend: http://localhost:3500');
      console.error('  - Backend: http://localhost:5500');
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Also test direct backend
async function testBackendDirect() {
  console.log('\n\n=== Testing Direct Backend Login ===\n');
  
  const credentials = {
    email: 'db@carbondepict.com',
    password: 'db123!@#DB'
  };

  console.log('Sending POST request directly to: http://localhost:5500/api/auth/login\n');

  try {
    const response = await axios.post('http://localhost:5500/api/auth/login', credentials, {
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: function (status) {
        return true;
      }
    });

    console.log('=== RESPONSE ===');
    console.log('Status:', response.status, response.statusText);
    console.log('\nResponse Data:');
    console.log(JSON.stringify(response.data, null, 2));

    if (response.status === 200) {
      console.log('\n✅ DIRECT BACKEND LOGIN SUCCESSFUL!');
    } else {
      console.log('\n❌ DIRECT BACKEND LOGIN FAILED!');
      console.log('Error:', response.data.error || response.data.message);
    }
  } catch (error) {
    console.error('\n❌ REQUEST FAILED!');
    console.error('Error:', error.message);
  }
}

// Run both tests
(async () => {
  await testBackendDirect();
  await testFrontendLogin();
  console.log('\n');
})();
