const db = require('../db/connection');

const fetchUserById = async (id) => {
  const { rows: user } = await db.query(
    `SELECT 
    user_id, first_name, surname, email, phone_number, avatar, created_at
    FROM users
    WHERE users.user_id = $1;`,
    [id]
  );

  return { user };
};

module.exports = { fetchUserById };
