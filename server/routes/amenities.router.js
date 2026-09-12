const express = require('express');

const { getAmenities } = require('../controllers/amenities.controller');
const { handleInvalidMethod } = require('../controllers/errors.controller');

const amenitiesRouter = express.Router();

amenitiesRouter.route('/').get(getAmenities).all(handleInvalidMethod);

module.exports = { amenitiesRouter };
