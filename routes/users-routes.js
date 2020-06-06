const express = require('express')
const { check } = require('express-validator')

const router = express.Router()

const UserControllers = require('../controllers/users-controllers')

router.get('/', UserControllers.getUsers)

router.post(
  "/signup",
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 })
  ],
  UserControllers.signup
)

router.post("/login", UserControllers.login);

module.exports = router