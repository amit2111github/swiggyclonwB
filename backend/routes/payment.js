const express = require('express')
const router = express.Router()
const { isSignedIn, isAuthenticated } = require('../controller/auth')
const {
  verifyPayment,
  createOrder,
  createItems,
  initatePayment
} = require('../controller/order')

router.get(
  '/order/:userId/:amount',
  isSignedIn,
  isAuthenticated,
  initatePayment
)

router.post(
  '/createOrder/:userId',
  isSignedIn,
  isAuthenticated,
  verifyPayment,
  createItems,
  createOrder
)

module.exports = router
