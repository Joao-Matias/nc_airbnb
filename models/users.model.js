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

const updateUserById = async (id, firstName, surname, email, phone, avatar) => {
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

module.exports = { fetchUserById, updateUserById };
