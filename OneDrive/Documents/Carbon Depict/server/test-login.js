// Test Login API
const https = require('http');

const postData = JSON.stringify({
  email: 'db@carbondepict.com',
  password: 'db123!@#DB'
});

const options = {
  hostname: 'localhost',
  port: 5500,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing login API...');
console.log('URL: http://localhost:5500/api/auth/login');
console.log('Credentials:', JSON.parse(postData));

const req = https.request(options, (res) => {
  console.log('\n=== RESPONSE ===');
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Status Message: ${res.statusMessage}`);
  console.log('Headers:', res.headers);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n=== RESPONSE BODY ===');
    try {
      const jsonData = JSON.parse(data);
      console.log(JSON.stringify(jsonData, null, 2));
      
      if (jsonData.token) {
        console.log('\n✅ LOGIN SUCCESSFUL!');
        console.log('Token:', jsonData.token.substring(0, 50) + '...');
      } else if (jsonData.error) {
        console.log('\n❌ LOGIN FAILED!');
        console.log('Error:', jsonData.error);
      }
    } catch (e) {
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request Error:', e.message);
});

req.write(postData);
req.end();
