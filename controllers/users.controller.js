const { fetchUserById } = require('../models/users.model');

const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  const user = await fetchUserById(userId);

  res.status(200).send(user);
};

module.exports = { getUserById };
