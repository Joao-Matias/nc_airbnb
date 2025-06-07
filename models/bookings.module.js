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

const updateBooking = async (id, checkInDate, checkOutDate, reqBody) => {
  const validReqProperties = ['check_in_date', 'check_out_date'];

  for (const key in reqBody) {
    if (!validReqProperties.includes(key)) {
      return Promise.reject();
    }
  }

  if (!checkInDate || !checkOutDate) {
    return Promise.reject({ status: 400, msg: 'Date missing.' });
  }

  let queryValues = [id];
  let setStr = 'SET';

  if (checkInDate) {
    queryValues.push(checkInDate);
    setStr += ` check_in_date = to_date($${queryValues.length},'YYYY-MM-DD')`;
    if (checkOutDate) setStr += ',';
  }
  if (checkOutDate) {
    queryValues.push(checkOutDate);
    setStr += ` check_out_date = to_date($${queryValues.length},'YYYY-MM-DD')`;
  }

  `UPDATE bookings
   SET
   check_in_date = COALESCE(SELECT * FROM bookings WHERE booking_id=1 AND  )
        (SELECT * FROM bookings WHERE booking_id = 1 AND check_in_date BETWEEN to_date('2025-11-03','YYYY-MM-DD') AND to_date('2025-11-05','YYYY-MM-DD')) IS NOT NULL
        SET 
        check_in_date = to_date('2025-11-03','YYYY-MM-DD') ,
        check_out_date = to_date('2025-11-05','YYYY-MM-DD') 
        WHERE booking_id = 1
        RETURNING *;
     
    `;

  const {
    rows: [booking],
  } = await db.query(
    `
    UPDATE bookings
    ${setStr}
    WHERE booking_id = $1
    RETURNING *;
    `,
    queryValues
  );

  if (booking === undefined) {
    return Promise.reject({ status: 404, msg: 'Booking not found.' });
  }

  return booking;
};

module.exports = { eraseBooking, updateBooking };
