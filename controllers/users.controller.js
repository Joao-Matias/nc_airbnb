const { fetchUserById, updateUserById } = require('../models/users.model');

const getUserById = async (req, res, next) => {
  const { id } = req.params;

  const user = await fetchUserById(id);
  res.status(200).send({ user });
};

const patchUserById = async (req, res, next) => {
  const { id } = req.params;
  const { first_name, surname, email, phone, avatar } = req.body;

  const validReqProperties = ['first_name', 'surname', 'email', 'phone', 'avatar'];

  for (const key in req.body) {
    if (!validReqProperties.includes(key)) {
      return Promise.reject();
    }
  }

  const user = await updateUserById(id, first_name, surname, email, phone, avatar);

  res.status(200).send({ user });
};

module.exports = { getUserById, patchUserById };
