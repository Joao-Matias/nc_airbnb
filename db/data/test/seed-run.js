const seed = require('./seed');
const db = require('./connection');
const { usersData } = require('../test/index');

seed(usersData).then(() => {
  db.end();
});
