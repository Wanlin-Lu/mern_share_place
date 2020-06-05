const express = require('express')
const router = express.Router()

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

router.get('/:pid', (req, res, next) => {
  const placeId = req.params.pid
  const place = M_P.find(p => { return p.id === placeId })
  if (!place) {
    const error = new Error('Could not find a place for the provided id.')
    error.code = 404
    throw error
  }
  res.json({ place })
})

router.get('/user/:uid', (req, res, next) => {
  const userId = req.params.uid
  const place = M_P.find(p => { return p.creator === userId })
  if (!place) {
    const error = new Error("Could not find a place for the provided userId.");
    error.code = 404;
    return next(error);
  }
  res.json({ place })
})

module.exports = router