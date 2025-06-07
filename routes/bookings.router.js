const express = require('express');

const { deleteBookingById, patchBookingsById } = require('../controllers/bookings.controller');
const { handleInvalidMethod } = require('../controllers/errors.controller');

const bookingsRouter = express.Router();

bookingsRouter.route('/:id').delete(deleteBookingById).patch(patchBookingsById).all(handleInvalidMethod);

module.exports = { bookingsRouter };
