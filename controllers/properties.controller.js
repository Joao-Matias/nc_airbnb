const { fetchProperties, fetchPropertyById } = require('../models/properties.model');

const getProperties = async (req, res, next) => {
  const properties = await fetchProperties();

  res.status(200).send({ properties });
};

const getPropertyById = async (req, res, next) => {
  const { id } = req.params;

  const property = await fetchPropertyById(id);
  res.status(200).send({ property });
};
module.exports = { getProperties, getPropertyById };
