const db = require('../db/connection');

const eraseBooking = async (id) => {
  const {
    rows: [booking],
  } = await db.query(
    `
          DELETE FROM bookings
          WHERE booking_id = $1
          RETURNING *;
          `,
    [id]
  );

  if (booking === undefined) {
    return Promise.reject({ status: 404, msg: 'Booking not found.' });
  }
};

module.exports = { eraseBooking };
