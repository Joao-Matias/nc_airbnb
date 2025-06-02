const express = require('express');

const { getUserById, patchUserById } = require('./controllers/users.controller');
const { handlePathNotFound, handleBadRequest, handleCustomErrors } = require('./controllers/errors.controller');
const {
  getProperties,
  getPropertyById,
  getPropertyReviews,
  postPropertyReview,
  postPropertyFavourited,
  deletePropertyFavourited,
  getPropertyBookings,
} = require('./controllers/properties.controller');
const { deleteReviewById } = require('./controllers/reviews.controller');
const { getAmenities } = require('./controllers/amenities.controller');

const app = express();

app.use(express.json());

app.get('/api/properties', getProperties);
app.get('/api/properties/:id', getPropertyById);
app.get('/api/properties/:id/reviews', getPropertyReviews);
app.post('/api/properties/:id/reviews', postPropertyReview);
app.post('/api/properties/:id/favourite', postPropertyFavourited);
app.delete('/api/properties/:id/favourite', deletePropertyFavourited);
app.get('/api/properties/:id/bookings', getPropertyBookings);

app.get('/api/users/:id', getUserById);
app.patch('/api/users/:id', patchUserById);

app.get('/api/amenities', getAmenities);

app.delete('/api/reviews/:id', deleteReviewById);

app.all('/*invalid_path', handlePathNotFound);

app.use(handleCustomErrors);
app.use(handleBadRequest);

module.exports = app;
