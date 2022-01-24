const { User } = require('../models/user')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const secret = process.env.SECRET
const password = process.env.GMAIL_PASSWORD
console.log(password);

const validPhoneNumber = (str) => {
  const regexExp = /^[6-9]\d{9}$/gi
  return regexExp.test(str)
}
const generateRandomOTP = () => {
  let otp = ''
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10)
  }
  return Number(otp)
}
const sendOTP = async (otp, email, name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 465,
      secure: false,
      auth: {
        user: 'amit.dev.nit@gmail.com',
        pass: password
      }
    })
    console.log("mail created");
    const info = await transporter.sendMail({
      from: '"Eflyer 👻" <amit.dev.nit@gmail.com>',
      to: email,
      subject: `Hello ,`,
      html: `<p>Hello</p> <h2>${name}</h2> </br> <p>Your OTP for Swiggy is ${otp}</p>`
    })
    const response = await transporter.sendMail(info)
    console.log("Get respone" , response);
  } catch (err) {
    console.log(err , "AT sending mail");
    throw Error('Failed to Send OTP')
  }
}

const getEncryptedPasswor = (plainPassword, salt) => {
  return crypto.createHash('sha256', salt).update(plainPassword).digest('hex')
}

exports.signUp = async (req, res, next) => {
  try {
    const { email, name, phoneNumber, password } = req.body
    let user = await User.findOne({
      $or: [{ email }, { phoneNumber }]
    })
    if (user && user.email === email) {
      return res
        .status(400)
        .json({ error: 'Email already exists in the Database' })
    }
    if (user && user.phoneNumber === phoneNumber) {
      return res.status(400).json({ error: 'Phone number already exists' })
    }
    if (!validPhoneNumber(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone Number' })
    }
    const otp = generateRandomOTP()
    const salt = uuidv4()
    const encry_password = getEncryptedPasswor(password, salt)
    user = new User({
      name,
      email,
      phoneNumber,
      password: encry_password,
      otp,
      salt
    })
    user = await user.save()
    // sending OTP

    await sendOTP(otp, email, name)
    return res.status(200).send(user)
  } catch (err) {
    console.log(err)
    return res.json({ error: 'Failed to Create Account' })
  }
}

exports.verifyOTP = async (req, res) => {
  try {
    const { email } = req.body
    let user = await User.findOne({ email })
    if (user.otp === Number(req.body.otp)) {
      user.otp = -1
      const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '1h' })
      res.cookie('token', token)
      user = await user.save()
      const { name, phoneNumber, _id } = user
      return res.json({ email, name, phoneNumber, token, _id })
    } else {
      res.status(400).send({ error: 'Invalid OTP' })
    }
  } catch (err) {
    return res.status(400).json({ error: 'Failed to login' })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res
        .status(400)
        .send({ error: 'Email id does not exists..Sign up' })
    }
    if (!(user.password === getEncryptedPasswor(password, user.salt))) {
      return res.json({ error: 'Wrong Password' })
    }
    const otp = generateRandomOTP()
    user.otp = otp
    await user.save()
    await sendOTP(otp, email, user.name)
    return res.json(user)
  } catch (err) {
    return res.status(400).json({ error: 'Failed to Login' })
  }
}

exports.getOrderByUserId = async (req, res) => {
  try {
    const { userId } = req.params
    const { orders } = await User.findById(userId).populate({
      path: 'orders',
      populate: {
        path: 'items',
        model: 'Item'
      }
    })
    return res.json(orders)
  } catch (err) {
    console.log(err)
    return res.json({ error: 'Failed to get Orders' })
  }
}

exports.isSignedIn = expressJwt({
  secret,
  algorithms: ['HS256'],
  userProperty: 'auth'
})
exports.isAuthenticated = async (err, req, res, next) => {
  try {
    if (err) {
      return res.json({ error: err.code })
    }
    const { userId } = req.params
    if (req.auth && req.auth._id && userId === req.auth._id) {
      next()
    } else {
      return res.status(400).json({ error: 'Invalid token' })
    }
  } catch (err) {
    console.log(err)
    return res.status(400).json({ errro: 'UnAuthorized' })
  }
}
