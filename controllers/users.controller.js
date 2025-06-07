const { fetchUserById, updateUserById } = require('../models/users.model');

const getUserById = async (req, res, next) => {
  const { id } = req.params;

  const user = await fetchUserById(id);
  res.status(200).send({ user });
};

const patchUserById = async (req, res, next) => {
  const { id } = req.params;
  const { first_name, surname, email, phone, avatar } = req.body;

  const user = await updateUserById(id, first_name, surname, email, phone, avatar, req.body);

  res.status(200).send({ user });
};

module.exports = { getUserById, patchUserById };
