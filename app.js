const express = require('express');

const { getUserById } = require('./controllers/users.controller');
const { handlePathNotFound, handleBadRequest, handleCustomErrors } = require('./controllers/errors.controller');
const {
  getProperties,
  getPropertyById,
  getPropertyReviews,
  postPropertyReview,
} = require('./controllers/properties.controller');

const app = express();

app.use(express.json());

app.get('/api/properties', getProperties);
app.get('/api/properties/:id', getPropertyById);
app.get('/api/properties/:id/reviews', getPropertyReviews);

app.post('/api/properties/:id/reviews', postPropertyReview);

app.get('/api/users/:id', getUserById);

app.all('/*invalid_path', handlePathNotFound);

app.use(handleCustomErrors);
app.use(handleBadRequest);

module.exports = app;
