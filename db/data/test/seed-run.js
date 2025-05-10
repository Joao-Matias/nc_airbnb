const seed = require('./seed');
const db = require('./connection');
const { usersData, propertyTypesData, propertiesData } = require('../test/index');

seed(usersData, propertyTypesData, propertiesData).then(() => {
  db.end();
});
