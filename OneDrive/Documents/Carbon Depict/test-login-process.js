/**
 * Login Process Test Script
 * Tests the login endpoint and documents all potential errors
 */

const axios = require('axios');

const API_BASE = 'http://localhost:5500/api';
const TEST_EMAILS = [
  'user@carbondepict.com', // Valid test user
  'invalid@test.com',      // Invalid user
  'test@gmail.com',        // Blocked domain
  '',                      // Empty email
];

async function testLogin(email, password) {
  console.log('\n' + '='.repeat(60));
  console.log(`Testing Login: ${email || '(empty)'}`);
  console.log('='.repeat(60));
  
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password
    }, {
      validateStatus: () => true // Don't throw on error status
    });

    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    return {
      success: response.status === 200,
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
      return {
        success: false,
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      console.error('No response received');
      return {
        success: false,
        status: 0,
        data: { error: 'No response from server' }
      };
    }
    return {
      success: false,
      status: 0,
      data: { error: error.message }
    };
  }
}

async function runTests() {
  console.log('🧪 LOGIN PROCESS TEST SUITE');
  console.log('='.repeat(60));
  
  // Test 1: Valid login
  console.log('\n📋 Test 1: Valid Login');
  await testLogin('user@carbondepict.com', 'testpassword123');
  
  // Test 2: Invalid email format
  console.log('\n📋 Test 2: Invalid Email Format');
  await testLogin('notanemail', 'testpassword123');
  
  // Test 3: Empty email
  console.log('\n📋 Test 3: Empty Email');
  await testLogin('', 'testpassword123');
  
  // Test 4: Empty password
  console.log('\n📋 Test 4: Empty Password');
  await testLogin('user@carbondepict.com', '');
  
  // Test 5: Wrong password
  console.log('\n📋 Test 5: Wrong Password');
  await testLogin('user@carbondepict.com', 'wrongpassword');
  
  // Test 6: Non-existent user
  console.log('\n📋 Test 6: Non-existent User');
  await testLogin('nonexistent@test.com', 'testpassword123');
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ Test suite completed');
  console.log('='.repeat(60));
}

// Run tests
runTests().catch(console.error);

