const db = require('../db/connection');

const eraseReview = async (id) => {
  const {
    rows: [review],
  } = await db.query(
    `
      DELETE FROM reviews
      WHERE review_id = $1
      RETURNING *;
      `,
    [id]
  );

  if (review === undefined) {
    return Promise.reject({ status: 404, msg: 'Review not found.' });
  }
};

module.exports = { eraseReview };
