const express = require('express');

const { getUserById, patchUserById } = require('./controllers/users.controller');
const { handlePathNotFound, handleBadRequest, handleCustomErrors } = require('./controllers/errors.controller');
const {
  getProperties,
  getPropertyById,
  getPropertyReviews,
  postPropertyReview,
  postPropertyFavourited,
  deletePropertyUsersFavourited,
  getPropertyBookings,
  postBooking,
} = require('./controllers/properties.controller');
const { deleteReviewById } = require('./controllers/reviews.controller');
const { getAmenities } = require('./controllers/amenities.controller');
const { deleteBookingById, patchBookingsById } = require('./controllers/bookings.controller');

const app = express();

app.use(express.json());

app.get('/api/properties', getProperties);
app.get('/api/properties/:id', getPropertyById);
app.get('/api/properties/:id/reviews', getPropertyReviews);
app.post('/api/properties/:id/reviews', postPropertyReview);
app.post('/api/properties/:id/favourite', postPropertyFavourited);
app.delete('/api/properties/:id/users/:user_id/favourite', deletePropertyUsersFavourited);
app.get('/api/properties/:id/bookings', getPropertyBookings);
app.post('/api/properties/:id/booking', postBooking);

app.get('/api/users/:id', getUserById);
app.patch('/api/users/:id', patchUserById);

app.get('/api/amenities', getAmenities);

app.delete('/api/bookings/:id', deleteBookingById);
app.patch('/api/bookings/:id', patchBookingsById);

app.delete('/api/reviews/:id', deleteReviewById);

app.all('/*invalid_path', handlePathNotFound);

app.use(handleCustomErrors);
app.use(handleBadRequest);

module.exports = app;
