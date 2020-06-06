const axios = require('axios')

const HttpError = require('../models/http-error')

const API_KEY = "00c668df1ec5a619a6cc412dfa57cad5"

const getCoordsForAddress = async (address) => {
  // return {
  //   lat: 40.788474,
  //   lng: -73.9871516
  // }
  const response = await axios.get(
    `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(address)}&output=JSON&key=${API_KEY}`
  );

  const data = response.data

  if (!data || data.status === 0) {
    const error = new HttpError('Could not find a location for the specified address.', 422)
    throw error
  }

  const location = data.geocodes[0].location

  let { 0: lng, 1: lat } = location.split(',')
  // let lng = location.split(',')[0];
  // let lat = location.split(",")[1];

  return { lng, lat }
}

module.exports = getCoordsForAddress