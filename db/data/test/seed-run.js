const seed = require('./seed');
const db = require('./connection');
const { usersData, propertyTypesData, reviewsData } = require('../test/index');

seed(usersData, propertyTypesData, reviewsData).then(() => {
  db.end();
});
