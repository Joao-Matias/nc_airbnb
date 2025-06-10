const express = require('express');

const propertiesRouter = express.Router();

const {
  getProperties,
  getPropertyById,
  getPropertyReviews,
  postPropertyReview,
  postPropertyFavourited,
  deletePropertyUsersFavourited,
  getPropertyBookings,
  postBooking,
  getPropertyAmenities,
} = require('../controllers/properties.controller');
const { handleInvalidMethod } = require('../controllers/errors.controller');

propertiesRouter.route('/').get(getProperties).all(handleInvalidMethod);
propertiesRouter.route('/:id').get(getPropertyById).all(handleInvalidMethod);
propertiesRouter.route('/:id/reviews').get(getPropertyReviews).post(postPropertyReview).all(handleInvalidMethod);
propertiesRouter.route('/:id/favourite').post(postPropertyFavourited).all(handleInvalidMethod);
propertiesRouter.route('/:id/amenities').get(getPropertyAmenities).all(handleInvalidMethod);
propertiesRouter.route('/:id/users/:user_id/favourite').delete(deletePropertyUsersFavourited).all(handleInvalidMethod);
propertiesRouter.route('/:id/bookings').get(getPropertyBookings).all(handleInvalidMethod);
propertiesRouter.route('/:id/booking').post(postBooking).all(handleInvalidMethod);

module.exports = { propertiesRouter };
