const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')

const HttpError = require('../models/http-error')
const User = require('../models/user')

const getUsers = async (req, res, next) => {
  let users
  try {
    users = await User.find({}, "-password")
  } catch (err) {
    return next(
      new HttpError("Fetching users failed, please try again later.", 500)
    );
  }

  res.json({ users: users.map(user => user.toObject({ getters: true}))})
}

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  
  const { email, name, password } = req.body
  let existingUser
  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    return next(
      new HttpError('Sign up failed 1, please try again later.', 500)
    )
  }

  if (existingUser) {
    return next(
      new HttpError('User already exists, please login instead.', 422)
    )
  }

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(password, 12)
  } catch (err) {
    const error = new HttpError('Could not create user, please try again.', 500)
    return next(error)
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: []
  })
  
  try {
    await createdUser.save()
  } catch (err) {
    return next(
      new HttpError('Sign up failed ya, please try again later.', 500)
    )
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) })
}

const login = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }
  const { email, password } = req.body

  let identifiedUser
  try {
    identifiedUser = await User.findOne({ email })
  } catch (err) {
    return next(
      new HttpError('Login failed, please try again later!', 500)
    )
  }

  if (!identifiedUser) {
    return next(
      new HttpError('Could not identify user, credentials seems to be wrong.', 401)
    )
  }

  let isValidPassword = false
  try {
    isValidPassword = await bcrypt.compare(password, identifiedUser.password)
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error)
  }

  res.json({ message: 'Logged in!', user: identifiedUser.toObject({ getters: true })})
}
exports.getUsers = getUsers 
exports.signup = signup
exports.login = login