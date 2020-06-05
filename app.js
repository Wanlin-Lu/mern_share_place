const express = require('express')
const bodyParser = require('body-parser')

const placeRouter = require('./routes/places-routes')
const HttpError = require('./models/http-error')

const app = express()

app.use(bodyParser.json())

app.use('/api/places', placeRouter)

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404)
  throw error
})

app.use((error, req, res, next) => {
  if (res.headerSend) {
    return next(error)
  }
  res.status(error.code || 500)
  res.json({ message: error.message || "An unknown error occurred." })
})

app.listen(5000)

