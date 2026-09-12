const express = require('express');

const { deleteReviewById } = require('../controllers/reviews.controller');
const { handleInvalidMethod } = require('../controllers/errors.controller');

const reviewsRouter = express.Router();

reviewsRouter.route('/:id').delete(deleteReviewById).all(handleInvalidMethod);

module.exports = { reviewsRouter };
