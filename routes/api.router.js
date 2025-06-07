const express = require('express');

const { propertiesRouter } = require('./properties.router');
const { usersRouter } = require('./users.router');
const { amenitiesRouter } = require('./amenities.router');
const { bookingsRouter } = require('./bookings.router');
const { reviewsRouter } = require('./reviews.router');

const apiRouter = express.Router();

apiRouter.use('/properties', propertiesRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/amenities', amenitiesRouter);
apiRouter.use('/bookings', bookingsRouter);
apiRouter.use('/reviews', reviewsRouter);

module.exports = { apiRouter };
