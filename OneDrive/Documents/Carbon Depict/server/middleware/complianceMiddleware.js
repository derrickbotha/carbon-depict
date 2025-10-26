const { analyzeDataCompliance, batchComplianceCheck } = require('../services/complianceService')

/**
 * Middleware: Validate data compliance before allowing upload
 * Automatically runs AI compliance checks on incoming data
 */
const validateCompliance = (dataType, options = {}) => {
  return async (req, res, next) => {
    try {
      const {
        frameworks = ['GRI', 'CDP'], // Default frameworks to check
        minScore = 70, // Minimum compliance score required
        blockNonCompliant = false, // Whether to block uploads that don't meet threshold
        addScoreToData = true // Add compliance score to the data
      } = options

      // Extract data from request
      const data = req.body
      const companyId = req.user?.companyId
      const userId = req.user?.id

      if (!companyId) {
        return res.status(400).json({ error: 'Company ID required for compliance check' })
      }

      console.log(`[Compliance Middleware] Checking ${dataType} compliance for company ${companyId}`)

      // Run compliance analysis
      const complianceResult = await analyzeDataCompliance(
        data,
        dataType,
        frameworks,
        companyId,
        userId
      )

      // Add compliance data to request for later use
      req.complianceCheck = complianceResult

      // Optionally add score directly to the data being saved
      if (addScoreToData) {
        req.body.complianceScore = complianceResult.overallScore
        req.body.isCompliant = complianceResult.isCompliant
        req.body.complianceFrameworks = frameworks
        req.body.complianceCheckedAt = new Date()
        req.body.complianceMethod = complianceResult.method
        req.body.complianceIssues = complianceResult.issues
      }

      // Check if score meets minimum threshold
      if (blockNonCompliant && complianceResult.overallScore < minScore) {
        return res.status(422).json({
          error: 'Data does not meet compliance standards',
          complianceScore: complianceResult.overallScore,
          requiredScore: minScore,
          isCompliant: false,
          issues: complianceResult.issues,
          recommendations: complianceResult.recommendations,
          frameworkScores: complianceResult.frameworkScores,
          message: `Compliance score of ${complianceResult.overallScore}% is below required ${minScore}%. Please address the issues and try again.`
        })
      }

      // Log warning if score is low but not blocking
      if (complianceResult.overallScore < minScore) {
        console.warn(
          `[Compliance Middleware] ⚠️  Low compliance score: ${complianceResult.overallScore}% (threshold: ${minScore}%)`
        )
      }

      // Continue to next middleware/route handler
      next()

    } catch (error) {
      console.error('[Compliance Middleware] Error:', error)

      // Don't block upload on compliance check failure (graceful degradation)
      // Just log the error and continue
      req.complianceCheck = {
        error: error.message,
        overallScore: 0,
        isCompliant: false,
        method: 'error'
      }

      next()
    }
  }
}

/**
 * Middleware: Batch validate compliance for array of data
 */
const validateBatchCompliance = (dataType, options = {}) => {
  return async (req, res, next) => {
    try {
      const {
        frameworks = ['GRI', 'CDP'],
        minScore = 70,
        blockNonCompliant = false
      } = options

      const dataArray = req.body.data || req.body
      const companyId = req.user?.companyId
      const userId = req.user?.id

      if (!Array.isArray(dataArray)) {
        return res.status(400).json({ error: 'Expected array of data for batch compliance check' })
      }

      if (!companyId) {
        return res.status(400).json({ error: 'Company ID required for compliance check' })
      }

      console.log(`[Batch Compliance] Checking ${dataArray.length} ${dataType} entries`)

      // Run batch compliance analysis
      const results = await batchComplianceCheck(
        dataArray,
        dataType,
        frameworks,
        companyId,
        userId
      )

      // Add compliance results to request
      req.batchComplianceResults = results

      // Filter out non-compliant entries if blocking is enabled
      if (blockNonCompliant) {
        const compliantEntries = results.filter(
          r => r.success && r.data.overallScore >= minScore
        )

        const nonCompliantCount = dataArray.length - compliantEntries.length

        if (nonCompliantCount > 0) {
          return res.status(422).json({
            error: `${nonCompliantCount} of ${dataArray.length} entries do not meet compliance standards`,
            compliantCount: compliantEntries.length,
            nonCompliantCount,
            requiredScore: minScore,
            results: results.map((r, i) => ({
              index: i,
              score: r.data?.overallScore || 0,
              isCompliant: r.data?.isCompliant || false,
              issues: r.data?.issues || []
            }))
          })
        }
      }

      // Enhance data with compliance scores
      req.body.data = dataArray.map((item, index) => ({
        ...item,
        complianceScore: results[index].data?.overallScore || 0,
        isCompliant: results[index].data?.isCompliant || false,
        complianceFrameworks: frameworks,
        complianceCheckedAt: new Date()
      }))

      next()

    } catch (error) {
      console.error('[Batch Compliance Middleware] Error:', error)
      req.batchComplianceResults = { error: error.message }
      next()
    }
  }
}

/**
 * Response formatter: Add compliance info to response
 */
const addComplianceToResponse = (req, res, next) => {
  const originalJson = res.json.bind(res)

  res.json = function(data) {
    if (req.complianceCheck) {
      data.compliance = {
        score: req.complianceCheck.overallScore,
        isCompliant: req.complianceCheck.isCompliant,
        frameworks: req.body.complianceFrameworks,
        issues: req.complianceCheck.issues,
        recommendations: req.complianceCheck.recommendations,
        method: req.complianceCheck.method,
        processingTime: req.complianceCheck.processingTime
      }

      // Add compliance badge
      if (req.complianceCheck.overallScore >= 90) {
        data.compliance.badge = 'excellent'
      } else if (req.complianceCheck.overallScore >= 80) {
        data.compliance.badge = 'good'
      } else if (req.complianceCheck.overallScore >= 70) {
        data.compliance.badge = 'acceptable'
      } else {
        data.compliance.badge = 'needs_improvement'
      }
    }

    return originalJson(data)
  }

  next()
}

module.exports = {
  validateCompliance,
  validateBatchCompliance,
  addComplianceToResponse
}
