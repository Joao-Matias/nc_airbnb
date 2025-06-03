const {
  fetchProperties,
  fetchPropertyById,
  fetchPropertyReviews,
  sendPropertyReview,
  sendPropertyFavourited,
  eraseFavourited,
  fetchPropertyBookings,
} = require('../models/properties.model');

const getProperties = async (req, res, next) => {
  const { maxprice, minprice, sort, host, order, amenity } = req.query;

  const properties = await fetchProperties(maxprice, minprice, sort, host, order, amenity);

  res.status(200).send({ properties });
};

const getPropertyById = async (req, res, next) => {
  const { id } = req.params;
  const { user_id } = req.query;

  const property = await fetchPropertyById(id, user_id);
  res.status(200).send({ property });
};

const getPropertyReviews = async (req, res, next) => {
  const { id } = req.params;

  const reviews = await fetchPropertyReviews(id);

  let reviewRatingsSum = 0;

  reviews.forEach((review) => {
    reviewRatingsSum += review.rating;
  });

  const average_rating = reviewRatingsSum / reviews.length;

  res.status(200).send({ reviews, average_rating });
};

const postPropertyReview = async (req, res, next) => {
  const validReqProperties = ['guest_id', 'rating', 'comment'];

  for (const key in req.body) {
    if (!validReqProperties.includes(key)) {
      return Promise.reject();
    }
  }

  const { guest_id, rating, comment } = req.body;
  const { id } = req.params;

  const insertedReview = await sendPropertyReview(id, guest_id, rating, comment);

  res.status(201).send(insertedReview);
};

const postPropertyFavourited = async (req, res, next) => {
  const { id } = req.params;
  const { guest_id } = req.body;

  const property = await sendPropertyFavourited(id, guest_id);

  res.status(201).send(property);
};

const deletePropertyUsersFavourited = async (req, res, next) => {
  const { id, user_id } = req.params;

  await eraseFavourited(id, user_id);

  res.status(204).send();
};

const getPropertyBookings = async (req, res, next) => {
  const { id } = req.params;

  const bookings = await fetchPropertyBookings(id);

  res.status(200).send(bookings);
};

const postBooking = async (req, res, next) => {
  const { id } = req.params;

  const { guest_id, check_in_date, check_out_date } = req.body;

  await sendBooking(id, guest_id, check_in_date, check_out_date);

  res.status(201).send({});
};

module.exports = {
  getProperties,
  getPropertyById,
  getPropertyReviews,
  postPropertyReview,
  postPropertyFavourited,
  deletePropertyUsersFavourited,
  getPropertyBookings,
  postBooking,
};
