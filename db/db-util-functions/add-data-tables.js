const db = require('../connection');
const format = require('pg-format');
const {
  insertProperties,
  insertReviews,
  insertImages,
  insertFavourites,
  insertAmenities,
  insertPropertiesAmenities,
  insertBookings,
} = require('./insertData');

const addDataTables = async (
  usersData,
  propertyTypesData,
  propertiesData,
  reviewsData,
  imagesData,
  favouritesData,
  bookingsData
) => {
  const users = usersData.map(({ first_name, surname, email, phone_number, role, avatar }) => [
    first_name,
    surname,
    email,
    phone_number,
    role === 'host' ? true : false,
    avatar,
  ]);

  const { rows: returnedUsers } = await db.query(
    format(
      `INSERT INTO users(
              first_name,surname,email,phone_number,is_host,avatar
              ) VALUES %L RETURNING *;`,
      users
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

  const { rows: returnedProperties } = await db.query(
    format(
      `INSERT INTO properties(
        name,location,price_per_night,description,property_type,host_id
          ) VALUES %L RETURNING *;`,
      insertProperties(propertiesData, returnedUsers)
    )
  );

  await db.query(
    format(
      `INSERT INTO reviews(
      property_id,guest_id,rating,comment
      ) VALUES %L;`,
      insertReviews(reviewsData, returnedUsers, returnedProperties)
    )
  );

  await db.query(
    format(
      `INSERT INTO images(
      property_id,image_url,alt_text
      ) VALUES %L;`,
      insertImages(imagesData, returnedProperties)
    )
  );

  await db.query(
    format(
      `INSERT INTO favourites(
      guest_id,property_id
      ) VALUES %L;`,
      insertFavourites(favouritesData, returnedUsers, returnedProperties)
    )
  );

  const { rows: returnedAmenities } = await db.query(
    format(
      `INSERT INTO amenities(
      amenity
      ) VALUES %L RETURNING *;`,
      insertAmenities(propertiesData)
    )
  );

  const { rows: returnedPropertiesAmenities } = await db.query(
    format(
      `INSERT INTO properties_amenities(
      property_id,amenity_slug
      ) VALUES %L RETURNING *;`,
      insertPropertiesAmenities(propertiesData, returnedProperties, returnedAmenities)
    )
  );

  const { rows: insertedBookings } = await db.query(
    format(
      `INSERT INTO bookings(
      property_id,guest_id,check_in_date,check_out_date
      ) VALUES %L RETURNING *;`,
      insertBookings(bookingsData, returnedProperties, returnedUsers)
    )
  );
};

module.exports = { addDataTables };
