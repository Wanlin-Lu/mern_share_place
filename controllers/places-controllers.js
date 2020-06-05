const { v1: uuidv1 } = require('uuid')
const HttpError = require("../models/http-error");

const M_P = [
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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = M_P.find((p) => {
    return p.id === placeId;
  });
  if (!place) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }
  res.json({ place });
}

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = M_P.find((p) => {
    return p.creator === userId;
  });
  if (!place) {
    throw new HttpError("Could not find a place for the provided userId.", 404);
  }
  res.json({ place });
}

const createPlace = (req, res, next) => {
  const { title, description, address, coordinates, creator } = req.body
  const createdPlace = {
    id: uuidv1(),
    title,
    description,
    address,
    location: coordinates,
    creator,
  }
  M_P.unshift(createdPlace)
  res.status(201).json({ createdPlace })
}

exports.getPlaceById = getPlaceById
exports.getPlaceByUserId = getPlaceByUserId
exports.createPlace = createPlace