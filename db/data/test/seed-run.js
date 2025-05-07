const seed = require('./seed');
const db = require('./connection');

seed().then(() => {
  db.end();
});
