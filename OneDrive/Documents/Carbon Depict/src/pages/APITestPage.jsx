// Cache bust 2025-10-23
import { useState, useEffect } from 'react'
import { apiClient } from '../utils/api'

const APITestPage = () => {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState({})
  const [errors, setErrors] = useState({})

  const runTest = async (testName, apiCall) => {
    setLoading(prev => ({ ...prev, [testName]: true }))
    setErrors(prev => ({ ...prev, [testName]: null }))
    
    try {
      const response = await apiCall()
      setResults(prev => ({ 
        ...prev, 
        [testName]: {
          success: true,
          data: response.data,
          status: response.status,
          timestamp: new Date().toISOString()
        }
      }))
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        [testName]: error.response?.data || error.message 
      }))
      setResults(prev => ({ 
        ...prev, 
        [testName]: {
          success: false,
          error: error.response?.data || error.message,
          status: error.response?.status,
          timestamp: new Date().toISOString()
        }
      }))
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }))
    }
  }

  const tests = [
    {
      name: 'Health Check',
      key: 'health',
      fn: () => apiClient.health(),
      description: 'Basic server health check'
    },
    {
      name: 'Detailed Health',
      key: 'detailedHealth',
      fn: () => apiClient.detailedHealth(),
      description: 'Detailed health with database status'
    },
    {
      name: 'Get Frameworks',
      key: 'frameworks',
      fn: () => apiClient.compliance.getFrameworks(),
      description: 'Get all supported ESG frameworks'
    },
    {
      name: 'Get GRI Framework',
      key: 'griFramework',
      fn: () => apiClient.compliance.getFramework('GRI'),
      description: 'Get GRI framework details'
    },
    {
      name: 'Compliance Stats',
      key: 'complianceStats',
      fn: () => apiClient.compliance.getStats(),
      description: 'Get compliance statistics'
    },
  ]

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.key, test.fn)
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  useEffect(() => {
    // Auto-run health check on mount
    runTest('health', apiClient.health)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🔧 API Connection Test Dashboard
          </h1>
          <p className="text-gray-600 mb-4">
            Testing communication between Frontend (Port 3500) and Backend (Port 5500)
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={runAllTests}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              🚀 Run All Tests
            </button>
            
            <button
              onClick={() => {
                setResults({})
                setErrors({})
                runTest('health', apiClient.health)
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Server Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              🌐 Frontend Server
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-gray-700">Running on http://localhost:3500</span>
              </div>
              <div className="text-sm text-gray-600">
                API Base URL: {import.meta.env.MODE === 'development' ? '/api (proxied to :5500)' : (import.meta.env.VITE_API_URL || 'http://localhost:5500/api')}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ⚙️ Backend Server
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span 
                  className={`w-3 h-3 rounded-full mr-2 ${
                    results.health?.success ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                ></span>
                <span className="text-gray-700">
                  {results.health?.success ? 'Connected' : 'Checking...'} - http://localhost:5500
                </span>
              </div>
              {results.health?.data && (
                <div className="text-sm text-gray-600">
                  Status: {results.health.data.status} | 
                  Uptime: {Math.floor(results.health.data.uptime)}s
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Test Results</h2>
          
          {tests.map((test) => (
            <div 
              key={test.key}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {test.name}
                      </h3>
                      {results[test.key] && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          results[test.key].success 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {results[test.key].success ? '✓ Success' : '✗ Failed'}
                        </span>
                      )}
                      {loading[test.key] && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          ⟳ Loading...
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{test.description}</p>
                  </div>
                  
                  <button
                    onClick={() => runTest(test.key, test.fn)}
                    disabled={loading[test.key]}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    {loading[test.key] ? 'Testing...' : 'Test'}
                  </button>
                </div>

                {results[test.key] && (
                  <div className="mt-4">
                    <div className="flex items-center gap-4 mb-2 text-sm">
                      <span className="text-gray-600">
                        Status Code: <span className="font-semibold">{results[test.key].status || 'N/A'}</span>
                      </span>
                      <span className="text-gray-600">
                        Time: {new Date(results[test.key].timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                      <pre className="text-xs text-gray-800">
                        {JSON.stringify(
                          results[test.key].data || results[test.key].error, 
                          null, 
                          2
                        )}
                      </pre>
                    </div>
                  </div>
                )}

                {errors[test.key] && !results[test.key] && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm font-medium">Error:</p>
                    <p className="text-red-700 text-sm">{JSON.stringify(errors[test.key])}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Test Summary</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {Object.keys(results).length}
              </div>
              <div className="text-gray-600 text-sm">Total Tests</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">
                {Object.values(results).filter(r => r.success).length}
              </div>
              <div className="text-gray-600 text-sm">Passed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600">
                {Object.values(results).filter(r => !r.success).length}
              </div>
              <div className="text-gray-600 text-sm">Failed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default APITestPage

