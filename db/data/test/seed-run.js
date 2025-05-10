const seed = require('./seed');
const db = require('./connection');
const {
  usersData,
  propertyTypesData,
  propertiesData,
  reviewsData,
  imagesData,
  favouritesData,
} = require('../test/index');

seed(usersData, propertyTypesData, propertiesData, reviewsData, imagesData, favouritesData).then(() => {
  db.end();
});
