const { eraseBooking, updateBooking } = require('../models/bookings.module');

const deleteBookingById = async (req, res, next) => {
  const { id } = req.params;

  await eraseBooking(id);

  res.status(204).send();
};

const patchBookingsById = async (req, res, next) => {
  const { id } = req.params;
  const { check_in_date, check_out_date } = req.body;

  const booking = await updateBooking(id, check_in_date, check_out_date, req.body);

  res.status(200).send(booking);
};

module.exports = { deleteBookingById, patchBookingsById };
