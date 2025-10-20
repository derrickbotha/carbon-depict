const express = require('express')
const router = express.Router()

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', async (req, res) => {
  try {
    // TODO: Get user from auth middleware
    res.json({ success: true, user: {} })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', async (req, res) => {
  try {
    // TODO: Update user in database
    res.json({ success: true, message: 'Profile updated' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router
