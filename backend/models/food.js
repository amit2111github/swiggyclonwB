const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = mongoose
const foodSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  veg: {
    type: Boolean,
    required: true
  },
  img_url: {
    type: String,
    required: true
  },
  restaurant_name: {
    type: ObjectId,
    ref: 'Restaurant'
  }
})

module.exports = mongoose.model('Food', foodSchema)
