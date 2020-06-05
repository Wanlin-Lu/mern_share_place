const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
  console.log("GET request in places")
  res.status(200).json({ message: 'It works.' })
})

module.exports = router