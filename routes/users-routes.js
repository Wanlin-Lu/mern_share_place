const express = require('express')
const router = express.Router()

const UserControllers = require('../controllers/users-controllers')

router.get('/', UserControllers.getUsers)
router.post("/signup", UserControllers.signup);
router.post("/login", UserControllers.login);

module.exports = router