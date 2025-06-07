const express = require('express');

const { getUserById, patchUserById, getUserBookings } = require('../controllers/users.controller');
const { handleInvalidMethod } = require('../controllers/errors.controller');

const usersRouter = express.Router();

usersRouter.route('/:id').get(getUserById).patch(patchUserById).all(handleInvalidMethod);
usersRouter.route('/:id/bookings').get(getUserBookings).all(handleInvalidMethod);

module.exports = { usersRouter };
