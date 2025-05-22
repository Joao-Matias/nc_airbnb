const { fetchProperties } = require('../models/properties.model');

const getProperties = async (req, res, next) => {
  const properties = await fetchProperties();

  res.status(200).send({ properties });
};

module.exports = { getProperties };
