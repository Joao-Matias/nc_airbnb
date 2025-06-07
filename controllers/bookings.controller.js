const { eraseBooking } = require('../models/bookings.module');

const deleteBookingById = async (req, res, next) => {
  const { id } = req.params;

  await eraseBooking(id);

  res.status(204).send();
};

module.exports = { deleteBookingById };
