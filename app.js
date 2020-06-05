const express = require('express')
const bodyParser = require('body-parser')

const placeRouter = require('./routes/places-routes')

const app = express()

app.use(bodyParser.json())

app.use('/api/places', placeRouter)

app.listen(5000)

