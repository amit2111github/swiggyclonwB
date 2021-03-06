const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const restaurantRouter = require('./routes/restaurant')
const authRouter = require('./routes/auth')
const paymentRouter = require('./routes/payment')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/user', authRouter)
app.use('/restaurant', restaurantRouter)
app.use('/razor', paymentRouter)
app.use('/test', (req , res) => {
  return res.send("Hello from test");
})


mongoose.connect(
  process.env.ATLAS_URI,
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
  () => {
    console.log('The database is connected!')
  }
)

app.listen( process.env.PORT || 5000 ,  () => {
  console.log('Server is Up & Running')
})
