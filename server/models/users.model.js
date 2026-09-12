const db = require('../db/connection');

const { filterUserSetStr, isMobileNumber } = require('../helper_functions/user-helper');

const fetchUserById = async (id) => {
  const {
    rows: [user],
  } = await db.query(
    `SELECT 
    user_id, first_name, surname, email, phone_number, avatar, created_at
    FROM users
    WHERE users.user_id = $1;`,
    [id]
  );

  if (user === undefined) {
    return Promise.reject({ status: 404, msg: 'User not found.' });
  }

  return user;
};

const updateUserById = async (id, firstName, surname, email, phone, avatar, reqBody) => {
  const validReqProperties = ['first_name', 'surname', 'email', 'phone', 'avatar'];

  for (const key in reqBody) {
    if (!validReqProperties.includes(key)) {
      return Promise.reject();
    }
  }

  const { queryValues, setStr } = filterUserSetStr(id, firstName, surname, email, phone, avatar);

  if (!isMobileNumber(phone)) {
    return Promise.reject({ status: 400, msg: 'Invalid phone number.' });
  }

  const {
    rows: [user],
  } = await db.query(
    `
    UPDATE users
    ${setStr}
    WHERE user_id = $1
    RETURNING *;
    `,
    queryValues
  );

  if (user === undefined) {
    return Promise.reject({ status: 404, msg: 'User not found.' });
  }

  return user;
};

`SELECT booking_id,check_in_date,check_out_date,properties.property_id, name AS property_name, host_id AS host, image_url AS image
 FROM bookings
 LEFT JOIN properties
 ON bookings.property_id = properties.property_id
 LEFT JOIN (
 SELECT DISTINCT ON (property_id) * FROM images) images
 ON properties.property_id = images.property_id
 WHERE host_id = 1
 ORDER BY check_in_date ASC;`;

const fetchUserBookings = async (id) => {
  const { rows: bookings } = await db.query(
    `
    SELECT booking_id,check_in_date,check_out_date,properties.property_id, name AS property_name, host_id AS host, image_url AS image
    FROM bookings
    LEFT JOIN properties
    ON bookings.property_id = properties.property_id
    LEFT JOIN (
    SELECT DISTINCT ON (property_id) * FROM images) images
    ON properties.property_id = images.property_id
    WHERE host_id = $1
    ORDER BY check_in_date ASC;
    `,
    [id]
  );

  if (bookings[0] === undefined) {
    return Promise.reject({ status: 404, msg: 'Id passed not found.' });
  }

  return bookings;
};
module.exports = { fetchUserById, updateUserById, fetchUserBookings };
