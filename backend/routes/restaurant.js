const express = require('express')
const dotenv = require('dotenv')
const {
  createRestaurant,
  createFood,
  createLocation,
  getAllFood,
  getFoodById,
  getAddress
} = require('../controller/restaurant')

const router = express.Router()
dotenv.config()

router.post('/addRestaurant', createLocation, createRestaurant)
router.post('/addItem', createFood)
router.get('/food', getAllFood)
router.get('/food/:foodId', getFoodById)
router.get('/address/:restaurantId', getAddress)

module.exports = router
