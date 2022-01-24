const { ObjectId } = require('mongoose')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// location of hotel

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  geometry: {
    type: ObjectId,
    ref: 'Address'
  },
  items: {
    type: ['Food'],
    required: true
  }
})
module.exports = mongoose.model('Restaurant', restaurantSchema)
