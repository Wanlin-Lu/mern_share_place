const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const placeRouter = require('./routes/places-routes')
const userRouter = require('./routes/users-routes')
const HttpError = require('./models/http-error')

const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.setHeader('Access-Control-Allow-Method', 'GET, POST, PATCH, DELETE')

  next()
})

app.use('/api/places', placeRouter)
app.use('/api/users', userRouter)

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

mongoose
  .connect(
    "mongodb+srv://luwanlin:R37T9XXsQivoY4pq@shareplaces-u7evs.gcp.mongodb.net/mern_s?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });

