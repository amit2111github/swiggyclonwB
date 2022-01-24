const Restaurant = require('../models/restaurant')
const Address = require('../models/address')
const Food = require('../models/food')
const axios = require('axios')

exports.createLocation = async (req, res, next) => {
  try {
    const token = 'pk.deef30aaf013ccf6d20e0290f723c4fc'
    const { lat, lon } = req.body
    const { data } = await axios.get(
      `https://us1.locationiq.com/v1/reverse.php?key=${token}&lat=${lat}&lon=${lon}&format=json`
    )

    let address = new Address({
      lat: data.lat,
      lon: data.lon,
      place_name: data.display_name,
      state: data.address.state,
      country_name: data.address.country
    })
    address = await address.save()
    req.location = address
    next()
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: 'Failed to create Location' })
  }
}
exports.createRestaurant = async (req, res, next) => {
  try {
    const { name, rating, food } = req.body
    let restaurant = new Restaurant({
      name,
      rating,
      items: food,
      geometry: req.location
    })
    restaurant = await restaurant.save()
    return res.json(restaurant)
  } catch (err) {
    console.log(err)
    return res.json({ error: 'Failed to create Restraunt' })
  }
}

exports.createFood = async (req, res) => {
  try {
    let food = new Food(req.body)
    food = await food.save()
    return res.json(food)
  } catch (err) {
    console.log(err)
    return res.status(400).json(err)
  }
}

exports.getAllFood = async (req, res, next) => {
  try {
    const food = await Food.find({}).populate({
      path: 'restaurant_name',
      populate: {
        path: 'geometry',
        model: 'Address'
      }
    })
    return res.json(food)
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: 'Failed to get Food' })
  }
}
exports.getFoodById = async (req, res, next) => {
  try {
    const { foodId } = req.params
    const food = await Food.findById(foodId)
    return res.json(food)
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: 'Failed to get Food' })
  }
}

exports.getAddress = async (req, res) => {
  try {
    const { restaurantId } = req.params
    const data = await Restaurant.findById(restaurantId).populate('geometry')
    console.log('DAN', data)
    return res.json(data)
  } catch (err) {
    console.log(err)
    return res.json({ error: 'Failed to get Hotel details' })
  }
}
