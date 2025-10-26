#!/usr/bin/env node

import http from 'http'

const checkHealth = (url, name) => {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve({ name, status: 'healthy', statusCode: res.statusCode })
    })
    
    req.on('error', () => {
      resolve({ name, status: 'unhealthy', statusCode: null })
    })
    
    req.setTimeout(5000, () => {
      req.destroy()
      resolve({ name, status: 'timeout', statusCode: null })
    })
  })
}

async function main() {
  console.log('🏥 CarbonDepict Health Check')
  console.log('============================')
  
  const checks = [
    checkHealth('http://localhost:5500/api/health', 'Backend API'),
    checkHealth('http://localhost:3500', 'Frontend App')
  ]
  
  const results = await Promise.all(checks)
  
  results.forEach(({ name, status, statusCode }) => {
    const icon = status === 'healthy' ? '✅' : '❌'
    const statusText = status === 'healthy' ? `Healthy (${statusCode})` : status
    console.log(`${icon} ${name}: ${statusText}`)
  })
  
  const allHealthy = results.every(r => r.status === 'healthy')
  process.exit(allHealthy ? 0 : 1)
}

main().catch(console.error)
