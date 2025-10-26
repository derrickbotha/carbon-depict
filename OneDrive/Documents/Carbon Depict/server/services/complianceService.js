const axios = require('axios')
const { GHGEmission, ESGMetric, WaterUsage, WasteManagement, EnergyConsumption } = require('../models/postgres')
const { ActivityLog, AIInference } = require('../models/mongodb')

/**
 * AI Compliance Scoring Service
 * Validates data entries against ESG framework standards before upload
 * Provides compliance scores and recommendations
 */

// Framework compliance rules and requirements
const FRAMEWORK_REQUIREMENTS = {
  GRI: {
    name: 'Global Reporting Initiative',
    emissionsRequirements: {
      requiredFields: ['scope', 'ghgType', 'activityType', 'value', 'unit', 'date'],
      validationRules: {
        scope: ['scope1', 'scope2', 'scope3'],
        ghgType: ['CO2', 'CH4', 'N2O', 'HFCs', 'PFCs', 'SF6', 'NF3'],
        unit: ['kg', 'tonnes', 'mtCO2e']
      },
      qualityThreshold: 0.75
    },
    esgRequirements: {
      requiredFields: ['category', 'metric', 'value', 'unit', 'date'],
      categories: ['environmental', 'social', 'governance'],
      qualityThreshold: 0.80
    }
  },
  CDP: {
    name: 'Carbon Disclosure Project',
    emissionsRequirements: {
      requiredFields: ['scope', 'ghgType', 'value', 'unit', 'date', 'activityData', 'emissionFactor'],
      detailLevel: 'high',
      requiresVerification: true,
      qualityThreshold: 0.85
    }
  },
  TCFD: {
    name: 'Task Force on Climate-related Financial Disclosures',
    emissionsRequirements: {
      requiredFields: ['scope', 'value', 'unit', 'date', 'methodology'],
      requiresRiskAssessment: true,
      requiresScenarioAnalysis: true,
      qualityThreshold: 0.80
    }
  },
  SASB: {
    name: 'Sustainability Accounting Standards Board',
    emissionsRequirements: {
      requiredFields: ['scope', 'industry', 'value', 'unit', 'date'],
      industrySpecific: true,
      qualityThreshold: 0.80
    }
  }
}

/**
 * Primary AI API call with retry logic and fallback
 */
const callAIAPI = async (prompt, options = {}, retries = 3) => {
  const apis = [
    {
      name: 'primary',
      url: process.env.AI_API_URL || 'https://api.x.ai/v1/chat/completions',
      key: process.env.AI_API_KEY,
      model: 'grok-beta'
    },
    {
      name: 'openai',
      url: 'https://api.openai.com/v1/chat/completions',
      key: process.env.OPENAI_API_KEY,
      model: 'gpt-4'
    },
    {
      name: 'anthropic',
      url: 'https://api.anthropic.com/v1/messages',
      key: process.env.ANTHROPIC_API_KEY,
      model: 'claude-3-opus-20240229'
    }
  ]

  // Try each API in order until one succeeds
  for (const api of apis) {
    if (!api.key) continue

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        console.log(`[AI Compliance] Attempting ${api.name} API (attempt ${attempt + 1}/${retries})`)

        const response = await axios.post(
          api.url,
          {
            model: api.model,
            messages: [
              {
                role: 'system',
                content: 'You are an expert ESG compliance analyst specializing in GRI, CDP, TCFD, SASB, and other sustainability frameworks. Analyze data quality, completeness, and framework compliance.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: options.temperature || 0.3,
            max_tokens: options.maxTokens || 2000
          },
          {
            headers: {
              'Authorization': `Bearer ${api.key}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000 // 30 second timeout
          }
        )

        console.log(`[AI Compliance] ✓ Success with ${api.name} API`)
        return {
          content: response.data.choices[0].message.content,
          model: api.model,
          api: api.name
        }
      } catch (error) {
        console.error(`[AI Compliance] ✗ ${api.name} API failed (attempt ${attempt + 1}):`, error.message)

        if (attempt === retries - 1) {
          console.log(`[AI Compliance] Moving to next API provider...`)
        } else {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
        }
      }
    }
  }

  // All APIs failed, use rule-based fallback
  console.warn('[AI Compliance] All AI APIs failed, using rule-based validation')
  return null
}

/**
 * Rule-based compliance validation (fallback when AI is unavailable)
 */
const ruleBasedValidation = (data, dataType, frameworks) => {
  const results = {
    isCompliant: true,
    overallScore: 0,
    frameworkScores: {},
    issues: [],
    recommendations: []
  }

  let totalScore = 0
  let frameworkCount = 0

  for (const framework of frameworks) {
    const requirements = FRAMEWORK_REQUIREMENTS[framework]
    if (!requirements) continue

    frameworkCount++
    let frameworkScore = 100
    const frameworkIssues = []

    // Check required fields based on data type
    const reqKey = `${dataType}Requirements`
    const reqs = requirements[reqKey]

    if (reqs && reqs.requiredFields) {
      const missingFields = reqs.requiredFields.filter(field => !data[field] || data[field] === '')
      
      if (missingFields.length > 0) {
        frameworkScore -= (missingFields.length * 10)
        frameworkIssues.push(`Missing required fields: ${missingFields.join(', ')}`)
        results.isCompliant = false
      }
    }

    // Validate field values
    if (reqs && reqs.validationRules) {
      for (const [field, validValues] of Object.entries(reqs.validationRules)) {
        if (data[field] && !validValues.includes(data[field])) {
          frameworkScore -= 5
          frameworkIssues.push(`Invalid ${field}: ${data[field]}. Expected one of: ${validValues.join(', ')}`)
        }
      }
    }

    // Check data quality
    const dataQuality = calculateDataQuality(data, dataType)
    if (reqs && reqs.qualityThreshold && dataQuality < reqs.qualityThreshold) {
      frameworkScore -= 15
      frameworkIssues.push(`Data quality (${(dataQuality * 100).toFixed(0)}%) below ${framework} threshold (${(reqs.qualityThreshold * 100).toFixed(0)}%)`)
      results.isCompliant = false
    }

    frameworkScore = Math.max(0, frameworkScore)
    totalScore += frameworkScore

    results.frameworkScores[framework] = {
      score: frameworkScore,
      isCompliant: frameworkScore >= 70,
      issues: frameworkIssues,
      threshold: reqs.qualityThreshold || 0.75
    }
  }

  results.overallScore = frameworkCount > 0 ? Math.round(totalScore / frameworkCount) : 0
  results.method = 'rule-based'

  // Generate recommendations
  if (results.overallScore < 70) {
    results.recommendations.push('Improve data completeness by filling all required fields')
  }
  if (results.overallScore < 85) {
    results.recommendations.push('Add supporting documentation for verification')
  }

  return results
}

/**
 * Calculate data quality score based on completeness and consistency
 */
const calculateDataQuality = (data, dataType) => {
  let score = 0
  let checks = 0

  // Completeness check (40% weight)
  const requiredFields = getRequiredFieldsForType(dataType)
  const completedFields = requiredFields.filter(field => data[field] && data[field] !== '').length
  score += (completedFields / requiredFields.length) * 0.4
  checks++

  // Data consistency (30% weight)
  if (data.value && typeof data.value === 'number' && data.value >= 0) {
    score += 0.3
  }
  checks++

  // Temporal validity (15% weight)
  if (data.date && new Date(data.date) <= new Date()) {
    score += 0.15
  }
  checks++

  // Unit consistency (15% weight)
  if (data.unit && isValidUnit(data.unit, dataType)) {
    score += 0.15
  }
  checks++

  return score
}

/**
 * Get required fields based on data type
 */
const getRequiredFieldsForType = (dataType) => {
  const fieldMap = {
    emissions: ['scope', 'ghgType', 'value', 'unit', 'date', 'activityType'],
    esg: ['category', 'metric', 'value', 'unit', 'date'],
    water: ['waterType', 'volume', 'unit', 'date', 'source'],
    waste: ['wasteType', 'weight', 'unit', 'date', 'disposalMethod'],
    energy: ['energyType', 'consumption', 'unit', 'date', 'source']
  }
  return fieldMap[dataType] || ['value', 'unit', 'date']
}

/**
 * Validate unit for data type
 */
const isValidUnit = (unit, dataType) => {
  const validUnits = {
    emissions: ['kg', 'tonnes', 'mtCO2e', 'kgCO2e', 'tCO2e'],
    water: ['liters', 'm3', 'gallons'],
    waste: ['kg', 'tonnes', 'lbs'],
    energy: ['kWh', 'MWh', 'GJ', 'BTU']
  }
  return validUnits[dataType]?.includes(unit) || true
}

/**
 * Main function: Analyze data compliance with AI
 */
const analyzeDataCompliance = async (data, dataType, frameworks, companyId, userId) => {
  const startTime = Date.now()

  try {
    console.log(`[AI Compliance] Analyzing ${dataType} data for frameworks: ${frameworks.join(', ')}`)

    // Build AI prompt
    const prompt = buildCompliancePrompt(data, dataType, frameworks)

    // Try AI analysis first
    const aiResponse = await callAIAPI(prompt, { temperature: 0.2, maxTokens: 2000 })

    let results

    if (aiResponse) {
      // Parse AI response
      try {
        results = parseAIResponse(aiResponse.content, frameworks)
        results.method = 'ai'
        results.model = aiResponse.model
        results.api = aiResponse.api
      } catch (parseError) {
        console.error('[AI Compliance] Failed to parse AI response:', parseError)
        results = ruleBasedValidation(data, dataType, frameworks)
      }
    } else {
      // Fallback to rule-based validation
      results = ruleBasedValidation(data, dataType, frameworks)
    }

    // Calculate processing time
    results.processingTime = Date.now() - startTime

    // Log to MongoDB for analytics
    await AIInference.create({
      model: results.model || 'rule-based',
      inputType: 'compliance_check',
      input: {
        dataType,
        frameworks,
        data: sanitizeDataForLogging(data)
      },
      output: results,
      companyId: companyId.toString(),
      userId: userId?.toString(),
      confidence: results.overallScore / 100,
      processingTime: results.processingTime,
      status: 'completed',
      metadata: {
        method: results.method,
        api: results.api,
        frameworkCount: frameworks.length
      }
    })

    // Log activity
    await ActivityLog.create({
      action: 'compliance_check',
      userId: userId?.toString(),
      companyId: companyId.toString(),
      resourceType: dataType,
      metadata: {
        frameworks,
        score: results.overallScore,
        isCompliant: results.isCompliant,
        method: results.method
      }
    })

    return results

  } catch (error) {
    console.error('[AI Compliance] Analysis failed:', error)

    // Return rule-based fallback on error
    const fallbackResults = ruleBasedValidation(data, dataType, frameworks)
    fallbackResults.error = error.message
    fallbackResults.processingTime = Date.now() - startTime

    return fallbackResults
  }
}

/**
 * Build AI prompt for compliance analysis
 */
const buildCompliancePrompt = (data, dataType, frameworks) => {
  return `Analyze the following ${dataType} data entry for compliance with ${frameworks.join(', ')} frameworks.

DATA:
${JSON.stringify(data, null, 2)}

FRAMEWORKS TO CHECK: ${frameworks.join(', ')}

Provide a detailed analysis in JSON format with the following structure:
{
  "overallScore": <number 0-100>,
  "isCompliant": <boolean>,
  "frameworkScores": {
    "${frameworks[0]}": {
      "score": <number 0-100>,
      "isCompliant": <boolean>,
      "issues": [<array of specific issues>],
      "strengths": [<array of what was done well>]
    }
  },
  "dataQuality": {
    "completeness": <number 0-100>,
    "accuracy": <number 0-100>,
    "consistency": <number 0-100>
  },
  "issues": [<array of all issues found>],
  "recommendations": [<array of specific actionable recommendations>],
  "missingFields": [<array of required but missing fields>],
  "summary": "<brief 1-2 sentence summary>"
}

Be specific about what fields are missing, what values are incorrect, and how to improve compliance.`
}

/**
 * Parse AI response into structured format
 */
const parseAIResponse = (content, frameworks) => {
  // Extract JSON from response (handle markdown code blocks)
  const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/\{[\s\S]*\}/)
  
  if (!jsonMatch) {
    throw new Error('No JSON found in AI response')
  }

  const jsonStr = jsonMatch[1] || jsonMatch[0]
  const parsed = JSON.parse(jsonStr)

  // Ensure all required fields exist
  return {
    overallScore: parsed.overallScore || 0,
    isCompliant: parsed.isCompliant || false,
    frameworkScores: parsed.frameworkScores || {},
    dataQuality: parsed.dataQuality || { completeness: 0, accuracy: 0, consistency: 0 },
    issues: parsed.issues || [],
    recommendations: parsed.recommendations || [],
    missingFields: parsed.missingFields || [],
    summary: parsed.summary || 'Analysis completed'
  }
}

/**
 * Sanitize data for logging (remove sensitive info)
 */
const sanitizeDataForLogging = (data) => {
  const sanitized = { ...data }
  const sensitiveFields = ['password', 'token', 'apiKey', 'secret']
  
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]'
    }
  }
  
  return sanitized
}

/**
 * Batch compliance check for multiple entries
 */
const batchComplianceCheck = async (dataArray, dataType, frameworks, companyId, userId) => {
  console.log(`[AI Compliance] Batch checking ${dataArray.length} entries`)

  const results = await Promise.allSettled(
    dataArray.map(data => analyzeDataCompliance(data, dataType, frameworks, companyId, userId))
  )

  return results.map((result, index) => ({
    index,
    success: result.status === 'fulfilled',
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason.message : null
  }))
}

/**
 * Health check for AI service
 */
const healthCheck = async () => {
  const health = {
    status: 'unknown',
    apis: {},
    timestamp: new Date()
  }

  const apis = [
    { name: 'primary', key: process.env.AI_API_KEY },
    { name: 'openai', key: process.env.OPENAI_API_KEY },
    { name: 'anthropic', key: process.env.ANTHROPIC_API_KEY }
  ]

  for (const api of apis) {
    health.apis[api.name] = {
      configured: !!api.key,
      status: api.key ? 'available' : 'not_configured'
    }
  }

  const availableAPIs = Object.values(health.apis).filter(api => api.configured).length
  health.status = availableAPIs > 0 ? 'healthy' : 'degraded'
  health.fallbackAvailable = true // Rule-based always available

  return health
}

module.exports = {
  analyzeDataCompliance,
  batchComplianceCheck,
  ruleBasedValidation,
  healthCheck,
  FRAMEWORK_REQUIREMENTS
}
