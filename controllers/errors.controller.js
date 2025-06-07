const handlePathNotFound = async (req, res, next) => {
  res.status(404).send({ msg: 'Path not found.' });
};

const handleInvalidMethod = (req, res, next) => {
  res.status(405).send({ msg: 'Invalid method.' });
};

const handleIdPassedNotFound = (err, req, res, next) => {
  if (err.code === '23503') {
    res.status(404).send({ msg: 'Id passed not found.' });
  }
  next(err);
};

const handleCustomErrors = (err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
  next(err);
};

const handleBadRequest = (err, req, res, next) => {
  res.status(400).send({ msg: 'Bad request.' });
};

module.exports = {
  handlePathNotFound,
  handleBadRequest,
  handleCustomErrors,
  handleIdPassedNotFound,
  handleInvalidMethod,
};
