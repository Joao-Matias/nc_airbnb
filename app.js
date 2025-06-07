const express = require('express');
const { apiRouter } = require('./routes/api.router');

const {
  handlePathNotFound,
  handleBadRequest,
  handleCustomErrors,
  handleIdPassedNotFound,
} = require('./controllers/errors.controller');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.all('/*invalid_path', handlePathNotFound);

app.use(handleIdPassedNotFound);
app.use(handleCustomErrors);
app.use(handleBadRequest);

module.exports = app;
