const express = require('express')
const { check } = require('express-validator')

const router = express.Router()

const UserControllers = require('../controllers/users-controllers')
const fileUpload = require('../middleware/file-upload')

router.get('/', UserControllers.getUsers)

router.post(
  "/signup",
  fileUpload.single('image'),
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 })
  ],
  UserControllers.signup
)

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  UserControllers.login
);

module.exports = router