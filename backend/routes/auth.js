const express = require('express')
const {
  signUp,
  verifyOTP,
  login,
  getOrderByUserId,
  isSignedIn,
  isAuthenticated
} = require('../controller/auth')
const dotenv = require('dotenv')

dotenv.config()
const router = express.Router()

router.post('/signup', signUp)
router.post('/login/verify-otp', verifyOTP)
router.post('/login', login)
router.get('/order/:userId', isSignedIn, isAuthenticated, getOrderByUserId)

module.exports = router
