const express = require('express');
const { apiRouter } = require('./routes/api.router');
const cors = require('cors');

const {
  handlePathNotFound,
  handleBadRequest,
  handleCustomErrors,
  handleIdPassedNotFound,
} = require('./controllers/errors.controller');

const app = express();
app.use(cors());

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use('/api', apiRouter);

app.all('/*invalid_path', handlePathNotFound);

app.use(handleIdPassedNotFound);
app.use(handleCustomErrors);
app.use(handleBadRequest);

module.exports = app;
