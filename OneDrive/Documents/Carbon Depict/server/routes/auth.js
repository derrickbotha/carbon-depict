const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const emailValidator = require('email-validator')
const mongoose = require('mongoose')
const { User, Company, ActivityLog } = require('../models/mongodb')
const { authenticate } = require('../middleware/auth')

// Corporate email domains blacklist (free email providers)
const BLOCKED_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
  'aol.com', 'icloud.com', 'mail.com', 'protonmail.com',
  'yandex.com', 'zoho.com', 'gmx.com', 'live.com', 'msn.com'
]

/**
 * Validate corporate email
 */
const validateCorporateEmail = (email) => {
  if (!emailValidator.validate(email)) {
    return { valid: false, message: 'Invalid email format' }
  }

  const domain = email.split('@')[1].toLowerCase()
  
  if (BLOCKED_DOMAINS.includes(domain)) {
    return { 
      valid: false, 
      message: 'Please use a corporate email address. Personal email providers (Gmail, Yahoo, etc.) are not allowed.' 
    }
  }

  return { valid: true }
}

/**
 * Send verification email (stub - will be implemented with queue)
 */
const sendVerificationEmail = async (email, token, firstName) => {
  console.log(`Verification email would be sent to ${email}`)
  // Will be implemented with Bull queue and Nodemailer
}

/**
 * Send welcome email (stub - will be implemented with queue)
 */
const sendWelcomeEmail = async (email, firstName, companyName) => {
  console.log(`Welcome email would be sent to ${email}`)
}

/**
 * Send password reset email (stub - will be implemented with queue)
 */
const sendPasswordResetEmail = async (email, token, firstName) => {
  console.log(`Password reset email would be sent to ${email}`)
}

/**
 * Emit event to user (stub - will be implemented with WebSocket)
 */
const emitToUser = (userId, event, data) => {
  console.log(`WebSocket event ${event} would be sent to user ${userId}`)
}

/**
 * POST /api/auth/register
 * Register new user with corporate email
 */
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('companyName').trim().notEmpty(),
  body('industry').isIn(['agriculture', 'energy', 'fleet', 'food', 'manufacturing', 'education', 'other']),
], async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password, firstName, lastName, companyName, industry, region, role } = req.body

    // Validate corporate email
    const emailValidation = validateCorporateEmail(email)
    if (!emailValidation.valid) {
      return res.status(400).json({ error: emailValidation.message })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' })
    }

    // Extract company domain from email
    const emailDomain = email.split('@')[1].toLowerCase()

    // Check if company exists with this domain
    let company = await Company.findOne({ name: companyName })
    let isNewCompany = false

    // If company doesn't exist, create it
    if (!company) {
      isNewCompany = true
      company = await Company.create({
        name: companyName,
        industry,
        region: region || 'uk',
        subscription: 'free',
        isActive: true,
        settings: {
          emailDomain: emailDomain,
          allowedDomains: [emailDomain],
          requireEmailVerification: true,
          autoApproveUsers: false
        }
      })
    } else {
      const allowedDomains = Array.isArray(company.settings?.allowedDomains)
        ? company.settings.allowedDomains
        : []

      if (!allowedDomains.includes(emailDomain)) {
        allowedDomains.push(emailDomain)
        company.settings = {
          ...company.settings,
          emailDomain: company.settings?.emailDomain || emailDomain,
          allowedDomains,
        }
        await company.save()
      }
    }

    // Create user
    const user = await User.create({
      email,
      password, // Will be hashed by model hook
      firstName,
      lastName,
      role: isNewCompany ? 'admin' : 'user',
      companyId: company.id,
      isActive: true,
      emailVerified: false
    })

    await user.populate({
      path: 'company',
      select: 'name industry subscription isActive',
    })

    // Generate verification token
    const verificationToken = jwt.sign(
      { userId: user.id, type: 'email_verification' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken, user.firstName)

    // Log activity
    await ActivityLog.create({
      action: 'user_registered',
      userId: user.id.toString(),
      companyId: company.id.toString(),
      resourceType: 'user',
      resourceId: user.id.toString(),
      metadata: {
        email: user.email,
        company: company.name,
        requiresVerification: true
      }
    })

    res.status(201).json({
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: {
          id: company.id,
          name: company.name
        }
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed. Please try again.' })
  }
})

/**
 * POST /api/auth/verify-email
 * Verify email address
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ error: 'Verification token required' })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.type !== 'email_verification') {
      return res.status(400).json({ error: 'Invalid token type' })
    }

    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return res.status(400).json({ error: 'Invalid verification token' })
    }

    // Get user
    const user = await User.findById(decoded.userId).populate('company')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (user.emailVerified) {
      return res.status(400).json({ error: 'Email already verified' })
    }

    // Update user
  user.emailVerified = true
  await user.save()

    // Send welcome email
    await sendWelcomeEmail(user.email, user.firstName, user.company.name)

    // Log activity
    await ActivityLog.create({
      action: 'email_verified',
      userId: user.id.toString(),
      companyId: user.companyId.toString(),
      resourceType: 'user',
      resourceId: user.id.toString()
    })

    // Emit real-time event
    emitToUser(user.id, 'email_verified', { verified: true })

    res.json({ 
      message: 'Email verified successfully. You can now login.',
      emailVerified: true
    })
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Verification link expired. Please request a new one.' })
    }
    console.error('Email verification error:', error)
    res.status(500).json({ error: 'Email verification failed' })
  }
})

/**
 * POST /api/auth/login
 * User login with JWT
 */
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      // Format validation errors into a user-friendly message
      const errorMessages = errors.array().map(err => {
        if (err.param === 'email') {
          return 'Please provide a valid email address'
        } else if (err.param === 'password') {
          return 'Password is required'
        }
        return err.msg || `${err.param} is invalid`
      })
      return res.status(400).json({ 
        error: errorMessages.join('. '),
        errors: errors.array()
      })
    }

    const { email, password } = req.body

    // Find user with company
    const user = await User.findOne({ email })
      .populate({
        path: 'company',
        select: 'name industry subscription isActive'
      })

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account has been deactivated. Please contact support.' })
    }

    // Check if company is active
    if (!user.company.isActive) {
      return res.status(403).json({ error: 'Company account is inactive. Please contact your administrator.' })
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({ 
        error: 'Email not verified. Please check your email for verification link.',
        emailVerified: false
      })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        companyId: user.companyId,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Generate refresh token
    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )

    // Log activity without failing login if MongoDB is unavailable
    try {
      await ActivityLog.create({
        action: 'user_login',
        userId: user.id.toString(),
        companyId: user.companyId.toString(),
        resourceType: 'user',
        resourceId: user.id.toString(),
        metadata: {
          ip: req.ip,
          userAgent: req.get('user-agent')
        }
      })
    } catch (logError) {
      console.warn('ActivityLog create failed (login continues):', logError.message)
    }

    // Emit real-time event (safe even if no WebSocket subscribers)
    emitToUser(user.id, 'user_logged_in', { timestamp: new Date() })

    res.json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: user.emailVerified,
        company: {
          id: user.company.id,
          name: user.company.name,
          industry: user.company.industry,
          subscription: user.company.subscription
        }
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed. Please try again.' })
  }
})

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' })
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET || 'your-secret-key')

    if (decoded.type !== 'refresh') {
      return res.status(400).json({ error: 'Invalid token type' })
    }

    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return res.status(401).json({ error: 'Invalid refresh token' })
    }

    // Get user
    const user = await User.findById(decoded.userId)

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid refresh token' })
    }

    // Generate new access token
    const token = jwt.sign(
      { 
        userId: user.id, 
        companyId: user.companyId,
        role: user.role,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token })
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token expired. Please login again.' })
    }
    console.error('Token refresh error:', error)
    res.status(500).json({ error: 'Token refresh failed' })
  }
})

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail(),
], async (req, res) => {
  try {
    const { email } = req.body

  const user = await User.findOne({ email })

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If an account exists, a password reset link has been sent.' })
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    // Send reset email
    await sendPasswordResetEmail(user.email, resetToken, user.firstName)

    // Log activity
    await ActivityLog.create({
      action: 'password_reset_requested',
      userId: user.id.toString(),
      companyId: user.companyId.toString(),
      resourceType: 'user',
      resourceId: user.id.toString()
    })

    res.json({ message: 'If an account exists, a password reset link has been sent.' })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ error: 'Password reset request failed' })
  }
})

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post('/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 8 }),
], async (req, res) => {
  try {
    const { token, password } = req.body

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    if (decoded.type !== 'password_reset') {
      return res.status(400).json({ error: 'Invalid token type' })
    }

    if (!mongoose.Types.ObjectId.isValid(decoded.userId)) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Get user
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Update password
    user.password = password // Will be hashed by model hook
    await user.save()

    // Log activity
    await ActivityLog.create({
      action: 'password_reset_completed',
      userId: user.id.toString(),
      companyId: user.companyId.toString(),
      resourceType: 'user',
      resourceId: user.id.toString()
    })

    // Emit real-time event
    emitToUser(user.id, 'password_changed', { timestamp: new Date() })

    res.json({ message: 'Password reset successful. You can now login with your new password.' })
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Reset link expired. Please request a new one.' })
    }
    console.error('Reset password error:', error)
    res.status(500).json({ error: 'Password reset failed' })
  }
})

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
        emailVerified: req.user.emailVerified,
        lastLogin: req.user.lastLogin,
        company: {
          id: req.user.company.id,
          name: req.user.company.name,
          industry: req.user.company.industry,
          subscription: req.user.company.subscription
        }
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ error: 'Failed to get user profile' })
  }
})

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal, server-side logging)
 */
router.post('/logout', authenticate, async (req, res) => {
  try {
    // Log the activity
    await ActivityLog.create({
      action: 'user_logout',
      userId: req.user.id.toString(),
      companyId: req.user.companyId.toString(),
      resourceType: 'user',
      resourceId: req.user.id.toString()
    })

    // Emit real-time event
    emitToUser(req.user.id, 'user_logged_out', { timestamp: new Date() })

    res.json({ message: 'Logout successful' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ error: 'Logout failed' })
  }
})

module.exports = router
