const { v4: uuidv4 } = require('uuid')
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')
const User = require('../models/user')

let M_U = [
  {
    id: "u1",
    name: "Zhao Jianye",
    email: "zhao@paother.com",
    password: "123456",
  },
  {
    id: "u2",
    name: "Su Wenming",
    email: "su@paother.com",
    password: "123456",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: M_U})
}

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  
  const { email, name, password, places } = req.body
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

  const createdUser = new User({
    name,
    email,
    image: "https://i0.hdslb.com/bfs/face/32c29e460aaaee403b38296bd492c8ee8e025590.jpg",
    password,
    places
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

const login = (req, res, next) => {
  const { email, password } = req.body

  const identifiedUser = M_U.find(u => u.email === email)
  if (!identifiedUser || identifiedUser.password !== password ) {
    throw new HttpError('Could not identify user, credentials seems to be wrong.', 401)
  }

  res.json({ message: 'Logged in!'})
}
exports.getUsers = getUsers 
exports.signup = signup
exports.login = login