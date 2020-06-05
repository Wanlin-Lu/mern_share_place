const express = require('express')
const bodyParser = require('body-parser')

const placeRouter = require('./routes/places-routes')

const app = express()

app.use(bodyParser.json())

app.use('/api/places', placeRouter)

app.use((error, req, res, next) => {
  if (res.headerSend) {
    return next(error)
  }
  res.status(error.code || 500)
  res.json({ message: error.message || "An unknown error occurred." })
})

app.listen(5000)

