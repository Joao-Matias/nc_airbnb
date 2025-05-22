const handlePathNotFound = async (req, res, next) => {
  res.status(404).send({ msg: 'Path not found.' });
};

const handleBadRequest = (err, req, res, next) => {
  res.status(400).send({ msg: 'Bad request.' });
};

const handleCustomErrors = (err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
};

module.exports = { handlePathNotFound, handleBadRequest, handleCustomErrors };
