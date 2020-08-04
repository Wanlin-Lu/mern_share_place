const { validationResult } = require('express-validator')
const mongoose = require('mongoose')

const HttpError = require("../models/http-error");
const getCoordsForAddress = require('../util/location')
const Place = require('../models/place')
const User = require('../models/user')

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
    image: req.file.path,
    creator,
  })

  let user
  try {
    user = await User.findById(creator)
  } catch (err) {
    return next(
      new HttpError('', 500)
    )
  }

  if (!user) {
    return next(
      new HttpError('Could not find a user for provided id.', 404)
    )
  }

  try {
    const sess = await mongoose.startSession()
    sess.startTransaction()
    await createdPlace.save({ session: sess })
    user.places.push(createdPlace)
    await user.save({ session: sess })
    await sess.commitTransaction()
  } catch (err) {
    const error = new HttpError(
      "creating place failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ createdPlace })
}

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }
  const { title, description } = req.body
  const placeId = req.params.pid
  
  let place
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new HttpError('Something went wrong, could not find updated place.', 500)
    )
  }

  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError(
      "You are not alowed to edit this place.",
      401
    )
    return next(error)
  }

  place.title = title
  place.description = description

  try {
    await place.save()
  } catch (err) {
    return next(
      new HttpError('Something went wrong, could not update place.', 500)
    )
  }

  res.status(200).json({ place: place.toObject({ getters: true }) })
}

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid
  let place
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete the place.", 500)
    );
  }

  if (!place) {
    return next(new HttpError("Could not find a place for this id.", 404));
  }

  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this place.",
      401
    )
    return next(error)
  }
  
  try {
    const sess = await mongoose.startSession()
    sess.startTransaction()
    await place.remove({ session: sess })
    place.creator.places.pull(place)
    await place.creator.save({ session: sess })
    await sess.commitTransaction()
  } catch (err) {
    return next(
      new HttpError('Something went wrong, could not delete that place.', 500)
    )
  }

  res.status(200).json({ message: 'Place deleted.'})
}

exports.getPlaceById = getPlaceById
exports.getPlacesByUserId = getPlacesByUserId
exports.createPlace = createPlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace