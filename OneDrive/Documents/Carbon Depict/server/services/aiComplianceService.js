const axios = require('axios')
const { FrameworkTemplate } = require('../models/mongodb')
const { ActivityLog } = require('../models/mongodb')
const { emitToUser, emitToCompany } = require('./websocketService')

/**
 * AI Framework Compliance Service
 * Analyzes data entries against ESG frameworks (GRI, TCFD, CDP, SASB, etc.)
 * Provides real-time compliance scoring and feedback
 */

// Framework standards with scoring criteria
const FRAMEWORK_STANDARDS = {
  'GRI': {
    minScore: 80,
    categories: ['governance', 'environment', 'social', 'economic'],
    requiredFields: ['disclosure', 'indicator', 'value', 'unit', 'reportingPeriod', 'verification']
  },
  'TCFD': {
    minScore: 75,
    categories: ['governance', 'strategy', 'risk-management', 'metrics-targets'],
    requiredFields: ['pillar', 'recommendation', 'disclosure', 'evidence', 'climateRisk']
  },
  'CDP': {
    minScore: 85,
    categories: ['climate-change', 'water-security', 'forests'],
    requiredFields: ['module', 'question', 'response', 'evidence', 'verification']
  },
  'SASB': {
    minScore: 80,
    categories: ['environment', 'social-capital', 'human-capital', 'business-model', 'leadership'],
    requiredFields: ['topic', 'metric', 'value', 'unit', 'accountingMetric']
  },
  'SDG': {
    minScore: 70,
    categories: Array.from({ length: 17 }, (_, i) => `goal-${i + 1}`),
    requiredFields: ['goal', 'target', 'indicator', 'value', 'impact']
  }
}

/**
 * Analyze data entry against framework requirements
 */
const analyzeCompliance = async (data, framework, userId, companyId) => {
  try {
    console.log(`🤖 Analyzing compliance: ${framework} for company ${companyId}`)

    // Get framework template from database
    const template = await FrameworkTemplate.findOne({
      framework: framework.toUpperCase(),
      isActive: true
    })

    if (!template) {
      throw new Error(`Framework template not found: ${framework}`)
    }

    // Prepare AI prompt
    const prompt = buildCompliancePrompt(data, template, framework)

    // Call AI API with retry logic
    const aiResponse = await callAIWithRetry(prompt, 3)

    // Parse AI response and calculate scores
    const analysis = parseAIResponse(aiResponse, framework, template)

    // Calculate compliance score
    const complianceScore = calculateComplianceScore(data, analysis, framework)

    // Generate compliance feedback
    const feedback = generateFeedback(analysis, complianceScore, framework)

    // Store analysis in database
    await ActivityLog.create({
      action: 'ai_compliance_check',
      userId: userId.toString(),
      companyId: companyId.toString(),
      resourceType: 'compliance_analysis',
      metadata: {
        framework,
        score: complianceScore.overall,
        status: complianceScore.isCompliant ? 'compliant' : 'non_compliant',
        feedback: feedback.summary
      }
    })

    // Emit real-time update
    emitToUser(userId, 'compliance_update', {
      framework,
      score: complianceScore.overall,
      isCompliant: complianceScore.isCompliant,
      feedback: feedback.summary
    })

    return {
      success: true,
      framework,
      score: complianceScore,
      analysis,
      feedback,
      recommendations: feedback.recommendations,
      missingElements: feedback.missingElements,
      proofRequired: feedback.proofRequired,
      timestamp: new Date()
    }
  } catch (error) {
    console.error('❌ Compliance analysis error:', error)
    
    // Log error but don't fail completely
    await ActivityLog.create({
      action: 'ai_compliance_error',
      userId: userId.toString(),
      companyId: companyId.toString(),
      resourceType: 'error',
      metadata: {
        error: error.message,
        framework
      }
    })

    // Return degraded response
    return {
      success: false,
      error: error.message,
      framework,
      score: { overall: 0, isCompliant: false },
      feedback: {
        summary: 'Unable to complete compliance analysis. Please try again.',
        recommendations: ['Check your data format', 'Ensure all required fields are present']
      }
    }
  }
}

/**
 * Build AI prompt for compliance analysis
 */
const buildCompliancePrompt = (data, template, framework) => {
  const standard = FRAMEWORK_STANDARDS[framework.toUpperCase()]

  return `You are an ESG compliance expert analyzing data against ${framework} framework standards.

FRAMEWORK: ${framework}
MINIMUM COMPLIANCE SCORE: ${standard?.minScore || 75}%

FRAMEWORK REQUIREMENTS:
${JSON.stringify(template.structure, null, 2)}

USER SUBMITTED DATA:
${JSON.stringify(data, null, 2)}

REQUIRED FIELDS: ${standard?.requiredFields.join(', ')}

Please analyze the submitted data and provide:

1. COMPLIANCE SCORE (0-100): Overall adherence to framework requirements
2. FIELD ANALYSIS: Check each required field
3. MISSING ELEMENTS: List what's missing or incomplete
4. EVIDENCE REQUIREMENTS: What proof/documentation is needed
5. RECOMMENDATIONS: Specific guidance to improve compliance
6. REGULATORY NOTES: Any regulatory concerns or flags

Format your response as JSON:
{
  "complianceScore": <number 0-100>,
  "isCompliant": <boolean>,
  "fieldAnalysis": {
    "<fieldName>": {
      "present": <boolean>,
      "quality": <"excellent"|"good"|"poor"|"missing">,
      "score": <number 0-100>,
      "issues": ["<issue1>", "<issue2>"]
    }
  },
  "missingElements": [
    {
      "field": "<fieldName>",
      "requirement": "<what's required>",
      "severity": <"critical"|"high"|"medium"|"low">,
      "guidance": "<how to fix>"
    }
  ],
  "evidenceRequirements": [
    {
      "type": "<document|link|certification|report>",
      "description": "<what's needed>",
      "purpose": "<why it's needed>",
      "mandatory": <boolean>
    }
  ],
  "recommendations": [
    {
      "priority": <"high"|"medium"|"low">,
      "action": "<what to do>",
      "impact": "<why it matters>"
    }
  ],
  "regulatoryNotes": ["<note1>", "<note2>"],
  "strengths": ["<strength1>", "<strength2>"],
  "summary": "<brief summary of compliance status>"
}`
}

/**
 * Call AI API with exponential backoff retry
 */
const callAIWithRetry = async (prompt, maxRetries = 3) => {
  let lastError

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 AI API call attempt ${attempt}/${maxRetries}`)

      const response = await axios.post(
        process.env.AI_API_URL || 'https://api.x.ai/v1/chat/completions',
        {
          model: process.env.AI_MODEL || 'grok-beta',
          messages: [
            {
              role: 'system',
              content: 'You are an expert ESG compliance analyst with deep knowledge of GRI, TCFD, CDP, SASB, and SDG frameworks.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.AI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      )

      if (response.data?.choices?.[0]?.message?.content) {
        console.log('✅ AI API call successful')
        return response.data.choices[0].message.content
      }

      throw new Error('Invalid AI API response format')
    } catch (error) {
      lastError = error
      console.error(`❌ AI API attempt ${attempt} failed:`, error.message)

      if (attempt < maxRetries) {
        // Exponential backoff: 2s, 4s, 8s
        const delay = Math.pow(2, attempt) * 1000
        console.log(`⏳ Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw new Error(`AI API failed after ${maxRetries} attempts: ${lastError.message}`)
}

/**
 * Parse AI response with fallback
 */
const parseAIResponse = (aiResponse, framework, template) => {
  try {
    // Try to extract JSON from response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    // Fallback: parse text response
    return {
      complianceScore: 50,
      isCompliant: false,
      fieldAnalysis: {},
      missingElements: [],
      evidenceRequirements: [],
      recommendations: [{ priority: 'high', action: 'Review data format', impact: 'Ensure proper compliance' }],
      regulatoryNotes: [],
      strengths: [],
      summary: 'Could not parse AI response. Manual review recommended.'
    }
  } catch (error) {
    console.error('❌ Error parsing AI response:', error)
    return {
      complianceScore: 0,
      isCompliant: false,
      fieldAnalysis: {},
      missingElements: [],
      evidenceRequirements: [],
      recommendations: [],
      regulatoryNotes: [],
      strengths: [],
      summary: 'Error parsing compliance analysis'
    }
  }
}

/**
 * Calculate detailed compliance score
 */
const calculateComplianceScore = (data, analysis, framework) => {
  const standard = FRAMEWORK_STANDARDS[framework.toUpperCase()]

  // Get field scores from AI analysis
  const fieldScores = Object.values(analysis.fieldAnalysis || {}).map(f => f.score || 0)
  const avgFieldScore = fieldScores.length > 0 
    ? fieldScores.reduce((a, b) => a + b, 0) / fieldScores.length 
    : 0

  // Combine AI score with field score
  const overall = Math.round((analysis.complianceScore * 0.7) + (avgFieldScore * 0.3))

  // Check required fields
  const requiredPresent = standard?.requiredFields.filter(field => 
    data.hasOwnProperty(field) && data[field] !== null && data[field] !== ''
  ).length || 0

  const requiredTotal = standard?.requiredFields.length || 1
  const completeness = Math.round((requiredPresent / requiredTotal) * 100)

  // Determine compliance status
  const minScore = standard?.minScore || 75
  const isCompliant = overall >= minScore && completeness >= 80

  return {
    overall,
    aiScore: analysis.complianceScore,
    fieldScore: Math.round(avgFieldScore),
    completeness,
    isCompliant,
    requiredFieldsPresent: requiredPresent,
    requiredFieldsTotal: requiredTotal,
    minScoreRequired: minScore,
    breakdown: {
      dataQuality: analysis.complianceScore,
      fieldCompleteness: completeness,
      evidenceProvided: data.evidence ? 100 : 0
    }
  }
}

/**
 * Generate actionable feedback
 */
const generateFeedback = (analysis, complianceScore, framework) => {
  const isCompliant = complianceScore.isCompliant

  return {
    summary: isCompliant
      ? `✅ Compliant with ${framework} framework (Score: ${complianceScore.overall}/100)`
      : `⚠️ Non-compliant with ${framework} framework (Score: ${complianceScore.overall}/100 - Required: ${complianceScore.minScoreRequired})`,
    
    status: isCompliant ? 'compliant' : 'non_compliant',
    
    score: {
      overall: complianceScore.overall,
      grade: getGrade(complianceScore.overall),
      isCompliant
    },

    missingElements: analysis.missingElements || [],
    
    recommendations: (analysis.recommendations || []).map(rec => ({
      ...rec,
      implemented: false,
      timestamp: new Date()
    })),

    proofRequired: (analysis.evidenceRequirements || []).map(req => ({
      ...req,
      uploaded: false,
      status: 'pending'
    })),

    regulatoryNotes: analysis.regulatoryNotes || [],
    strengths: analysis.strengths || [],
    
    nextSteps: generateNextSteps(analysis, complianceScore),
    
    detailedAnalysis: analysis.fieldAnalysis || {}
  }
}

/**
 * Get grade letter from score
 */
const getGrade = (score) => {
  if (score >= 95) return 'A+'
  if (score >= 90) return 'A'
  if (score >= 85) return 'A-'
  if (score >= 80) return 'B+'
  if (score >= 75) return 'B'
  if (score >= 70) return 'B-'
  if (score >= 65) return 'C+'
  if (score >= 60) return 'C'
  if (score >= 55) return 'C-'
  if (score >= 50) return 'D'
  return 'F'
}

/**
 * Generate next steps based on analysis
 */
const generateNextSteps = (analysis, complianceScore) => {
  const steps = []

  if (!complianceScore.isCompliant) {
    steps.push({
      step: 1,
      action: 'Address critical missing elements',
      items: (analysis.missingElements || [])
        .filter(m => m.severity === 'critical')
        .map(m => m.field)
    })
  }

  if ((analysis.evidenceRequirements || []).length > 0) {
    steps.push({
      step: steps.length + 1,
      action: 'Upload required documentation',
      items: analysis.evidenceRequirements.map(e => e.type)
    })
  }

  if ((analysis.recommendations || []).filter(r => r.priority === 'high').length > 0) {
    steps.push({
      step: steps.length + 1,
      action: 'Implement high-priority recommendations',
      items: analysis.recommendations
        .filter(r => r.priority === 'high')
        .map(r => r.action)
    })
  }

  return steps
}

/**
 * Batch analyze multiple entries
 */
const batchAnalyzeCompliance = async (entries, framework, userId, companyId) => {
  const results = []
  
  for (const entry of entries) {
    try {
      const result = await analyzeCompliance(entry, framework, userId, companyId)
      results.push({
        entryId: entry.id || entry._id,
        ...result
      })

      // Small delay between requests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      results.push({
        entryId: entry.id || entry._id,
        success: false,
        error: error.message
      })
    }
  }

  // Emit batch completion
  emitToUser(userId, 'batch_compliance_complete', {
    total: entries.length,
    successful: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length
  })

  return results
}

/**
 * Re-analyze after updates
 */
const reanalyzeCompliance = async (entryId, updatedData, framework, userId, companyId) => {
  console.log(`🔄 Re-analyzing entry ${entryId} after updates`)
  
  const result = await analyzeCompliance(updatedData, framework, userId, companyId)
  
  // Emit improvement notification if score increased
  if (result.success) {
    emitToUser(userId, 'compliance_improved', {
      entryId,
      newScore: result.score.overall,
      isCompliant: result.score.isCompliant
    })
  }
  
  return result
}

module.exports = {
  analyzeCompliance,
  batchAnalyzeCompliance,
  reanalyzeCompliance,
  FRAMEWORK_STANDARDS
}
