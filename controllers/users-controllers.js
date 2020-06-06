const { v4: uuidv4 } = require('uuid')

const HttpError = require('../models/http-error')

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

const signup = (req, res, next) => {
  const { email, name, password } = req.body
  const hasUser = M_U.find(u => u.email === email)
  if (hasUser) {
    throw new HttpError('Could not create user, email already exists.', 422)
  }

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password
  }
  M_U.push(createdUser)

  res.status(201).json({ user: createdUser })
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