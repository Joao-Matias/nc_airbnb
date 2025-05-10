const seed = require('./seed');
const db = require('./connection');
const { usersData, propertyTypesData, propertiesData, reviewsData } = require('../test/index');

seed(usersData, propertyTypesData, propertiesData, reviewsData).then(() => {
  db.end();
});
