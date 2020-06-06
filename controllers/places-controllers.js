const { v1: uuidv1 } = require('uuid')
const { validationResult } = require('express-validator')

const HttpError = require("../models/http-error");
const getCoordsForAddress = require('../util/location')
const Place = require('../models/place')

let M_P = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lng: 116.410829,
      lat: 39.881913,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Emp. State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lng: 116.410829,
      lat: 39.881913,
    },
    creator: "u2",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find a place.', 500)
    return next(error)
  }

  if (!place) {
    const error = new HttpError("Could not find a place for the provided id.", 404);
    return next(error)
  }

  res.json({ place: place.toObject({ getters: true }) });
}

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching place failed, please try again.",
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided userId.", 404)
    )
  }
  res.json({ places: places.map(place => place.toObject({ getters: true })) });
}

const createPlace = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    )
  }

  const { title, description, address, creator } = req.body

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address)
  } catch (error) {
    return next(error)
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
    creator,
  })

  try {
    await createdPlace.save()
  } catch (err) {
    const error = new HttpError('creating place failed, please try again.', 500)
    return next(error)
  }

  res.status(201).json({ createdPlace })
}

const updatePlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  const { title, description } = req.body
  const placeId = req.params.pid
  
  const updatedPlace = { ...M_P.find(p => p.id === placeId) }
  const placeIndex = M_P.findIndex(p => p.id === placeId)
  updatedPlace.title = title
  updatedPlace.description = description
  M_P[placeIndex] = updatedPlace

  res.status(200).json({ place: updatedPlace })
}

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid
  if (!M_P.find(p => p.id === placeId)) {
    throw new HttpError('Could not find a place for that id.', 404)
  }
  M_P = M_P.filter(p => p.id !== placeId)
  res.status(200).json({ message: 'Place deleted.'})
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace