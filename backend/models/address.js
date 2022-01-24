const mongoose = require('mongoose')
const { Schema } = mongoose
const addressSchema = new Schema(
  {
    lat: {
      type: String
    },
    lon: {
      type: String
    },
    place_name: {
      type: String
    },
    state: {
      type: String
    },
    country_name: {
      type: String
    }
  },
  { timestamps: true }
)
module.exports = mongoose.model('Address', addressSchema)
