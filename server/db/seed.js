const dropAllTables = require('./db-util-functions/drop-tables');
const createAllTables = require('./db-util-functions/create-tables');
const { addDataTables } = require('./db-util-functions/add-data-tables');

async function seed(
  usersData,
  propertyTypesData,
  propertiesData,
  reviewsData,
  imagesData,
  favouritesData,
  bookingsData
) {
  await dropAllTables();

  await createAllTables();

  await addDataTables(
    usersData,
    propertyTypesData,
    propertiesData,
    reviewsData,
    imagesData,
    favouritesData,
    bookingsData
  );
}

module.exports = seed;
