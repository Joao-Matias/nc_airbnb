const seed = require('./seed');
const db = require('./connection');
const {
  usersData,
  propertyTypesData,
  propertiesData,
  reviewsData,
  imagesData,
  favouritesData,
  amenititesData,
  propertiesAmenitiesData,
} = require('../test/index');

seed(
  usersData,
  propertyTypesData,
  propertiesData,
  reviewsData,
  imagesData,
  favouritesData,
  amenititesData,
  propertiesAmenitiesData
).then(() => {
  db.end();
});
