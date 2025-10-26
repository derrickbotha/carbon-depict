// Test script for emissions bulk save functionality
const axios = require('axios')

const testData = {
  formData: {
    stationaryCombustion: {
      'natural-gas': { name: 'Natural Gas (kWh)', value: '1000', unit: 'kWh', completed: true },
      'fuel-oil': { name: 'Fuel Oil (litres)', value: '500', unit: 'litres', completed: true },
      'coal': { name: 'Coal (tonnes)', value: '10', unit: 'tonnes', completed: true }
    }
  },
  scope: 'scope1',
  reportingPeriod: '2024'
}

async function testBulkSave() {
  try {
    console.log('Testing emissions bulk save endpoint...')
    
    // First, we need to login to get a token
    const loginResponse = await axios.post('http://localhost:5500/api/auth/login', {
      email: 'test@carbondepict.com',
      password: 'password123'
    })
    
    const token = loginResponse.data.token
    
    // Now test the bulk save endpoint
    const response = await axios.post('http://localhost:5500/api/emissions/bulk-save', testData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('✅ Success! Response:', response.data)
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message)
  }
}

testBulkSave()
