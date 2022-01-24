const mongoose = require('mongoose')
const { Schema } = mongoose
const { ObjectId } = mongoose

const itemSchema = new Schema(
  {
    price: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    veg: {
      type: Boolean,
      required: true
    }
  },
  { timestamps: true }
)

const orderSchema = new Schema(
  {
    restaurant_id: {
      type: String,
      required: true
    },
    restaurant_name: {
      type: String,
      required: true
    },
    image_url: {
      type: String
    },
    location: {
      type: ObjectId,
      ref: 'Address'
    },
    address_1: {
      type: String,
      default: ''
    },
    address_2: {
      type: String,
      default: ''
    },
    date: {
      type: Date,
      default: Date.now()
    },
    items: ['Item']
  },
  { timestamps: true }
)

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    otp: {
      type: Number
    },
    password: {
      type: String,
      trim: true
    },
    salt: {
      type: String,
      required: true
    },
    orders: [orderSchema]
  },
  { timestamps: true }
)

module.exports = {
  User: mongoose.model('User', userSchema),
  Order: mongoose.model('Order', orderSchema),
  Item: mongoose.model('Item', itemSchema)
}
