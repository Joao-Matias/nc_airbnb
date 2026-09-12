const { eraseReview } = require('../models/reviews.model');

const deleteReviewById = async (req, res, next) => {
  const { id } = req.params;

  await eraseReview(id);

  res.status(204).send({});
};

module.exports = { deleteReviewById };
