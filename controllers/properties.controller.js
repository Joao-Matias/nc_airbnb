const { fetchProperties, fetchPropertyById, fetchPropertyReviews } = require('../models/properties.model');

const getProperties = async (req, res, next) => {
  const properties = await fetchProperties();

  res.status(200).send({ properties });
};

const getPropertyById = async (req, res, next) => {
  const { id } = req.params;
  const { user_id } = req.query;
  try {
    const property = await fetchPropertyById(id, user_id);
    res.status(200).send({ property });
  } catch (error) {
    next(error);
  }
};

const getPropertyReviews = async (req, res, next) => {
  const { id } = req.params;

  try {
    const reviews = await fetchPropertyReviews(id);

    let reviewRatingsSum = 0;

    reviews.forEach((review) => {
      reviewRatingsSum += review.rating;
    });

    const average_rating = reviewRatingsSum / reviews.length;

    res.status(200).send({ reviews, average_rating });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProperties, getPropertyById, getPropertyReviews };
