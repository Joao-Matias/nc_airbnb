const express = require('express');

const { getUserById } = require('./controllers/users.controller');

const app = express();

app.get('/api/users/:userId', getUserById);

app.all('/*invalid_path', (req, res, next) => {
  res.status(404).send({ msg: 'Path not found.' });
});

module.exports = app;
