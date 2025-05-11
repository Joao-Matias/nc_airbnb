const db = require('./connection');
const format = require('pg-format');
const {
  insertProperties,
  insertReviews,
  insertImages,
  insertFavourites,
  insertAmenities,
  insertPropertiesAmenities,
  insertBookings,
} = require('./util-functions/insertData');
const dropAllTables = require('./util-functions/drop-tables');
const createAllTables = require('./util-functions/create-tables');

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

  const { rows: insertedUsers } = await db.query(
    format(
      `INSERT INTO users(
          first_name,surname,email,phone_number,is_host,avatar
          ) VALUES %L RETURNING *;`,
      usersData.map(({ first_name, surname, email, phone_number, role, avatar }) => [
        first_name,
        surname,
        email,
        phone_number,
        role === 'host' ? true : false,
        avatar,
      ])
    )
  );

  await db.query(
    format(
      `INSERT INTO property_types(
          property_type,description
          ) VALUES %L RETURNING *;`,
      propertyTypesData.map(({ property_type, description }) => [property_type, description])
    )
  );

  const { rows: insertedProperties } = await db.query(
    format(
      `INSERT INTO properties(
        name,location,price_per_night,description,property_type,host_id
          ) VALUES %L RETURNING *;`,
      insertProperties(propertiesData, insertedUsers)
    )
  );

  await db.query(
    format(
      `INSERT INTO reviews(
      property_id,guest_id,rating,comment
      ) VALUES %L;`,
      insertReviews(reviewsData, insertedUsers, insertedProperties)
    )
  );

  await db.query(
    format(
      `INSERT INTO images(
      property_id,image_url,alt_text
      ) VALUES %L;`,
      insertImages(imagesData, insertedProperties)
    )
  );

  await db.query(
    format(
      `INSERT INTO favourites(
      guest_id,property_id
      ) VALUES %L;`,
      insertFavourites(favouritesData, insertedUsers, insertedProperties)
    )
  );

  const { rows: insertedAmenities } = await db.query(
    format(
      `INSERT INTO amenities(
      amenity
      ) VALUES %L RETURNING *;`,
      insertAmenities(propertiesData)
    )
  );

  const { rows: insertedPropertiesAmenities } = await db.query(
    format(
      `INSERT INTO properties_amenities(
      property_id,amenity_slug
      ) VALUES %L RETURNING *;`,
      insertPropertiesAmenities(propertiesData, insertedProperties, insertedAmenities)
    )
  );

  console.log(insertedProperties);
  console.log(insertedUsers);

  const { rows: insertedBookings } = await db.query(
    format(
      `INSERT INTO bookings(
      property_id,guest_id,check_in_date,check_out_date
      ) VALUES %L RETURNING *;`,
      insertBookings(bookingsData, insertedProperties, insertedUsers)
    )
  );
}

module.exports = seed;
