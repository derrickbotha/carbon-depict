/**
 * Authentication API Tests
 * Tests for login, register, and token verification
 */

const axios = require('axios')

const API_BASE = 'http://localhost:5500/api'
const TEST_USER = {
  email: 'db@carbondepict.com',
  password: 'db123!@#DB'
}

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function testHealthEndpoint() {
  log('blue', '\n📋 Testing Health Endpoint')
  try {
    const response = await axios.get(`${API_BASE}/health`)
    if (response.status === 200 && response.data.status === 'ok') {
      log('green', '✅ Health check passed')
      return true
    } else {
      log('red', '❌ Health check failed')
      return false
    }
  } catch (error) {
    log('red', `❌ Health check error: ${error.message}`)
    return false
  }
}

async function testLogin() {
  log('blue', '\n🔐 Testing Login Endpoint')
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, TEST_USER)
    
    if (response.status === 200 && response.data.token) {
      log('green', '✅ Login successful')
      log('green', `   Token: ${response.data.token.substring(0, 50)}...`)
      log('green', `   User: ${response.data.user.email}`)
      log('green', `   Role: ${response.data.user.role}`)
      log('green', `   Company: ${response.data.user.company.name}`)
      return { success: true, token: response.data.token }
    } else {
      log('red', '❌ Login failed: No token received')
      return { success: false }
    }
  } catch (error) {
    log('red', `❌ Login error: ${error.response?.data?.error || error.message}`)
    return { success: false }
  }
}

async function testInvalidLogin() {
  log('blue', '\n🔐 Testing Invalid Login')
  try {
    await axios.post(`${API_BASE}/auth/login`, {
      email: 'invalid@example.com',
      password: 'wrongpassword'
    })
    log('red', '❌ Invalid login should have failed')
    return false
  } catch (error) {
    if (error.response?.status === 401) {
      log('green', '✅ Invalid login correctly rejected')
      return true
    } else {
      log('red', `❌ Unexpected error: ${error.message}`)
      return false
    }
  }
}

async function testTokenVerification(token) {
  log('blue', '\n🎫 Testing Token Verification')
  try {
    const response = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    if (response.status === 200 && response.data.user) {
      log('green', '✅ Token verification successful')
      log('green', `   User: ${response.data.user.email}`)
      return true
    } else {
      log('red', '❌ Token verification failed')
      return false
    }
  } catch (error) {
    log('red', `❌ Token verification error: ${error.response?.data?.error || error.message}`)
    return false
  }
}

async function testInvalidToken() {
  log('blue', '\n🎫 Testing Invalid Token')
  try {
    await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: 'Bearer invalid.token.here' }
    })
    log('red', '❌ Invalid token should have been rejected')
    return false
  } catch (error) {
    if (error.response?.status === 401) {
      log('green', '✅ Invalid token correctly rejected')
      return true
    } else {
      log('red', `❌ Unexpected error: ${error.message}`)
      return false
    }
  }
}

async function testProxyEndpoint() {
  log('blue', '\n🔀 Testing Vite Proxy (Frontend -> Backend)')
  try {
    const response = await axios.post('http://localhost:3500/api/auth/login', TEST_USER)
    
    if (response.status === 200 && response.data.token) {
      log('green', '✅ Proxy login successful')
      log('green', '   Frontend can communicate with backend')
      return true
    } else {
      log('red', '❌ Proxy login failed')
      return false
    }
  } catch (error) {
    log('red', `❌ Proxy error: ${error.message}`)
    log('yellow', '   Make sure frontend server is running on port 3500')
    return false
  }
}

async function runAllTests() {
  log('blue', '═══════════════════════════════════════════════════')
  log('blue', '  Carbon Depict - Authentication Tests')
  log('blue', '═══════════════════════════════════════════════════')
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0
  }

  // Test 1: Health Check
  results.total++
  if (await testHealthEndpoint()) results.passed++
  else results.failed++

  // Test 2: Valid Login
  results.total++
  const loginResult = await testLogin()
  if (loginResult.success) results.passed++
  else results.failed++

  // Test 3: Invalid Login
  results.total++
  if (await testInvalidLogin()) results.passed++
  else results.failed++

  // Test 4: Token Verification (if we have a token)
  if (loginResult.token) {
    results.total++
    if (await testTokenVerification(loginResult.token)) results.passed++
    else results.failed++
  }

  // Test 5: Invalid Token
  results.total++
  if (await testInvalidToken()) results.passed++
  else results.failed++

  // Test 6: Proxy Endpoint
  results.total++
  if (await testProxyEndpoint()) results.passed++
  else results.failed++

  // Summary
  log('blue', '\n═══════════════════════════════════════════════════')
  log('blue', '  Test Summary')
  log('blue', '═══════════════════════════════════════════════════')
  log('blue', `  Total Tests: ${results.total}`)
  log('green', `  Passed: ${results.passed}`)
  if (results.failed > 0) {
    log('red', `  Failed: ${results.failed}`)
  }
  log('blue', '═══════════════════════════════════════════════════\n')

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0)
}

// Run tests
runAllTests().catch(error => {
  log('red', `\n❌ Test suite error: ${error.message}`)
  process.exit(1)
})
