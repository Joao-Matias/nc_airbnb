const seed = require('./seed');
const db = require('./connection');
const {
  usersData,
  propertyTypesData,
  propertiesData,
  reviewsData,
  imagesData,
  favouritesData,
  bookingsData,
} = require('./test/index');

seed(usersData, propertyTypesData, propertiesData, reviewsData, imagesData, favouritesData, bookingsData).then(() => {
  db.end();
});
