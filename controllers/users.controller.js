const { fetchUserById } = require('../models/users.model');

const getUserById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const user = await fetchUserById(id);
    res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserById };
