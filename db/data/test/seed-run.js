const seed = require('./seed');
const db = require('./connection');
const { usersData, propertyTypesData, propertiesData, reviewsData, imagesData } = require('../test/index');

seed(usersData, propertyTypesData, propertiesData, reviewsData, imagesData).then(() => {
  db.end();
});
