const { User, Order, Item } = require('../models/user')
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid')
const Razorpay = require('razorpay')
const razorpay = new Razorpay({
  key_id: process.env.RAZOR_PAY_KEY_ID,
  key_secret: process.env.RAZOR_PAY_KEY_SECRET
})
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpayPaymentId, orderid, razorpaySignature } = req.body
    const secret = process.env.RAZOR_PAY_KEY_SECRET
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(orderid + '|' + razorpayPaymentId)
      .digest('hex')
    if (generatedSignature !== razorpaySignature)
      return res.json({ error: 'Invalid Payment' })
    next()
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: 'Oops Something went wrong' })
  }
}

exports.createItems = async (req, res, next) => {
  try {
    let items = req.body.order.items
    items = items.map((curItem) => {
      return {
        insertOne: {
          document: curItem
        }
      }
    })
    const { insertedIds } = await Item.bulkWrite(items)
    req.items = Object.values(insertedIds)
    next()
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: 'Failed to create items' })
  }
}

exports.createOrder = async (req, res, next) => {
  try {
    const { order } = req.body
    const { userId } = req.params
    console.log(req.params, req.params.userId, 'DAN')
    console.log(userId, 'IN ORDER CREATION')
    order.items = req.items
    const newOrder = new Order({ ...order, image_url: order.img_url })
    const data = await newOrder.save()
    await User.findByIdAndUpdate(userId, {
      $push: { orders: data }
    })
    return res.json(data)
  } catch (err) {
    console.log(err)
    return res.status(400).json({ error: 'Failed to create order' })
  }
}

exports.initatePayment = async (req, res) => {
  try {
    const { amount } = req.params
    const options = {
      amount: Number(amount) * 100,
      currency: 'INR',
      receipt: uuidv4(),
      payment_capture: 0
    }
    const data = await razorpay.orders.create(options)
    return res.json(data)
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      error: 'Something went wrong'
    })
  }
}
