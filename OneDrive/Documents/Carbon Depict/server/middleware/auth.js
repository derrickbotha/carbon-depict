const jwt = require('jsonwebtoken')
const { User } = require('../models/mongodb')
const mongoose = require('mongoose')

/**
 * Authentication Middleware
 * Validates JWT token and attaches user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Authentication required. Please provide a valid token.' 
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')

    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Get user from database (with company)
    const user = await User.findById(decoded.userId)
      .populate({
        path: 'company',
        select: 'name industry subscription isActive'
      })
      .select('-password')

    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account has been deactivated' })
    }

    if (!user.emailVerified) {
      return res.status(403).json({ 
        error: 'Email not verified. Please verify your email to continue.' 
      })
    }

    if (user.company && !user.company.isActive) {
      return res.status(403).json({ error: 'Company account is inactive' })
    }

    // Attach user to request
    req.user = user
    req.userId = user.id
    req.companyId = user.companyId ? user.companyId.toString() : user.company?._id?.toString()

    // Update last login occasionally to avoid write amplification
    const now = Date.now()
    if (!user.lastLogin || now - new Date(user.lastLogin).getTime() > 5 * 60 * 1000) {
      user.lastLogin = new Date(now)
      await user.save()
    }

    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' })
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired. Please login again.' })
    }
    
    console.error('Authentication error:', error)
    return res.status(500).json({ error: 'Authentication failed' })
  }
}

/**
 * Role-based Authorization Middleware
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.',
        required: allowedRoles,
        current: req.user.role
      })
    }

    next()
  }
}

/**
 * Check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

/**
 * Check if user is manager or admin
 */
const isManagerOrAdmin = (req, res, next) => {
  if (!req.user || !['admin', 'manager'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Manager or Admin access required' })
  }
  next()
}

/**
 * Verify company ownership
 * Ensures user can only access their company's data
 */
const verifyCompanyAccess = (req, res, next) => {
  const requestedCompanyId = req.params.companyId || req.body.companyId || req.query.companyId

  if (!requestedCompanyId) {
    return next() // No company specified, continue
  }

  // Admin can access any company
  if (req.user.role === 'admin') {
    return next()
  }

  // User can only access their own company
  if (requestedCompanyId !== req.user.companyId) {
    return res.status(403).json({ 
      error: 'Access denied. You can only access your own company data.' 
    })
  }

  next()
}

/**
 * Rate limiting for sensitive operations
 */
const sensitiveOperationLimit = (req, res, next) => {
  // Implement custom rate limiting for sensitive operations
  // This can be enhanced with Redis for distributed systems
  next()
}

module.exports = {
  authenticate,
  authorize,
  isAdmin,
  isManagerOrAdmin,
  verifyCompanyAccess,
  sensitiveOperationLimit
}
