const dropAllTables = require('./util-functions/drop-tables');
const createAllTables = require('./util-functions/create-tables');
const { addDataTables } = require('./util-functions/add-data-tables');

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
