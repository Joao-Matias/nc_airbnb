const { fetchAmenities } = require('../models/amenities.module');

const getAmenities = async (req, res, next) => {
  const amenities = await fetchAmenities();

  res.status(200).send({ amenities });
};

module.exports = { getAmenities };
