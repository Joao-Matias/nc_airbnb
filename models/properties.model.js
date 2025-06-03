const db = require('../db/connection');

const fetchProperties = async (maxPrice, minPrice, sortBy, hostId, order, amenity) => {
  const queryValues = [];
  let whereStr = '';
  let sortStr = 'ORDER BY COUNT(favourites.property_id)';
  let joinStr = ` LEFT JOIN favourites ON properties.property_id = favourites.property_id LEFT JOIN (SELECT DISTINCT ON (property_id) * FROM images) images ON properties.property_id = images.property_id`;
  let orderStr = ' DESC';

  const validSortBy = ['cost_per_night', 'popularity'];
  const validOrderBy = ['ascending', 'descending'];

  if (maxPrice || minPrice || hostId || amenity) {
    whereStr += ' WHERE';
    if (maxPrice) {
      queryValues.push(maxPrice);
      whereStr += ` properties.price_per_night < $${queryValues.length}`;
    }
    if (!maxPrice && minPrice) {
      queryValues.push(minPrice);
      whereStr += `  properties.price_per_night > $${queryValues.length}`;
    }
    if (maxPrice && minPrice) {
      queryValues.push(minPrice);
      whereStr += ` AND properties.price_per_night > $${queryValues.length}`;
    }
  }

  if (hostId) {
    queryValues.push(hostId);
    if (maxPrice || minPrice) {
      whereStr += ` AND users.id=$${queryValues.length}`;
    } else {
      whereStr += ` users.user_id=$${queryValues.length}`;
    }
  }

  if (amenity) {
    for (let i = 0; i < amenity.length; i++) {
      queryValues.push(amenity[i]);
      if (maxPrice || minPrice || hostId || i > 0) {
        whereStr += ` AND amenity=$${queryValues.length}`;
      } else {
        whereStr += ` amenity=$${queryValues.length}`;
      }
    }
  }

  if (sortBy) {
    sortStr = ` ORDER BY`;
    if (!validSortBy.includes(sortBy)) {
      return Promise.reject({ status: 400, msg: 'Invalid sort query.' });
    } else {
      if (sortBy === 'cost_per_night') {
        sortStr += ` price_per_night`;
      } else {
        joinStr = ` LEFT JOIN bookings ON properties.property_id = bookings.property_id LEFT JOIN (SELECT DISTINCT ON (property_id) * FROM images) images ON properties.property_id = images.property_id `;
        sortStr += ` COUNT(bookings.property_id)`;
      }
    }
  }

  if (order) {
    if (!validOrderBy.includes(order)) {
      return Promise.reject({ status: 400, msg: 'Invalid order query.' });
    } else {
      if (order === 'ascending') {
        orderStr = ' ASC';
      } else {
        orderStr = ' DESC';
      }
    }
  }

  `
  SELECT 
     properties.property_id ,name AS property_name,location,price_per_night, CONCAT(first_name,' ',surname) AS host,image_url AS image
    FROM properties
    JOIN users
    ON properties.host_id=users.user_id
    JOIN properties_amenities
    ON properties.property_id = properties_amenities.property_id
    JOIN amenities
    ON properties_amenities.amenity_slug = amenities.amenity
    LEFT JOIN favourites 
    ON properties.property_id = favourites.property_id 
    LEFT JOIN (
    SELECT DISTINCT ON (property_id) * FROM images) images
    ON properties.property_id = images.property_id
    WHERE amenity = 'Washer'
    GROUP BY properties.property_id,property_name,properties.location,properties.price_per_night,users.first_name,users.surname,images.image_url
    ORDER BY COUNT(properties.property_id) DESC;
    `;

  console.log(joinStr);
  console.log(whereStr);
  console.log(queryValues);

  const { rows: properties } = await db.query(
    `SELECT 
    properties.property_id ,name AS property_name,location,price_per_night, CONCAT(first_name,' ',surname) AS host,image_url AS image
    FROM properties
    JOIN users
    ON properties.host_id=users.user_id
    JOIN properties_amenities
    ON properties.property_id = properties_amenities.property_id
    JOIN amenities
    ON properties_amenities.amenity_slug = amenities.amenity
    ${joinStr}
    ${whereStr}
    GROUP BY properties.property_id,property_name,properties.location,properties.price_per_night,users.first_name,users.surname,images.image_url
    ${sortStr} ${orderStr};`,
    queryValues
  );

  if (properties[0] === undefined) {
    return Promise.reject({ status: 404, msg: 'User not found.' });
  }

  return properties;
};

const fetchPropertyById = async (propertyId, userId) => {
  const queryValues = [propertyId];
  let favouritedStr = '';

  if (userId !== undefined) {
    queryValues.push(userId);
    favouritedStr = `, favourites.guest_id = $${queryValues.length} AS favourited`;
  }

  const {
    rows: [property],
  } = await db.query(
    `SELECT
    properties.property_id,name AS property_name, location, price_per_night,description, CONCAT(first_name,' ',surname) AS host, avatar AS host_avatar,ARRAY_AGG(images.image_url) AS images, COUNT(favourites.property_id) AS favourite_count${favouritedStr}
    FROM properties 
    JOIN users
    ON properties.host_id = users.user_id
    JOIN favourites
    ON properties.property_id = favourites.property_id
    LEFT JOIN images
    ON properties.property_id = images.property_id
    WHERE properties.property_id = $1
    GROUP BY properties.property_id, properties.location, properties.price_per_night, properties.description, users.first_name,users.surname, users.avatar,favourites.property_id,favourites.guest_id;
    `,
    queryValues
  );

  if (property === undefined) {
    return Promise.reject({ status: 404, msg: 'Property not found.' });
  }

  return property;
};

const fetchPropertyReviews = async (id) => {
  const { rows: reviews } = await db.query(
    `
    SELECT 
    review_id,comment,rating,reviews.created_at,CONCAT(first_name,' ',surname) AS guest,users.avatar AS guest_avatar
    FROM reviews
    JOIN users
    ON reviews.guest_id = users.user_id
    JOIN properties
    ON reviews.property_id = properties.property_id
    WHERE reviews.property_id = $1
    ORDER BY reviews.created_at ASC;
    `,
    [id]
  );

  if (reviews[0] === undefined) {
    return Promise.reject({ status: 404, msg: 'Property not found.' });
  }

  return reviews;
};

const sendPropertyReview = async (propertyId, guestId, rating, comment) => {
  const { rows: properties } = await db.query(`SELECT property_id FROM properties;`);

  const validRating = [1, 2, 3, 4, 5];
  const validPropertiesIds = properties.map((property) => `${property.property_id}`);

  if (!validPropertiesIds.includes(propertyId)) {
    return Promise.reject({ status: 404, msg: 'Property not found.' });
  }
  if (!validRating.includes(rating)) {
    return Promise.reject({ status: 400, msg: 'Invalid payload setup.' });
  }

  const {
    rows: [insertedPropertyReview],
  } = await db.query(
    `
    INSERT INTO reviews(property_id,guest_id,rating,comment)
    VALUES ($1,$2,$3,$4) RETURNING *;
    `,
    [propertyId, guestId, rating, comment]
  );

  return insertedPropertyReview;
};

const sendPropertyFavourited = async (propertyId, guestId) => {
  try {
    if (guestId === undefined) {
      return Promise.reject({ status: 400, msg: 'Missing guest_id.' });
    }

    const {
      rows: [propertyFavourited],
    } = await db.query(
      `
      INSERT INTO favourites (guest_id,property_id)
      VALUES($1,$2) RETURNING *;
  
      `,
      [guestId, propertyId]
    );

    return { msg: 'Property favourited successfully.', favourite_id: propertyFavourited.favourite_id };
  } catch (error) {
    if (error.code === '22P02') {
      return Promise.reject();
    }
    if (error.code === '23503') {
      return Promise.reject({ status: 404, msg: 'Id passed not found.' });
    }
  }
};

const eraseFavourited = async (propertyId, userId) => {
  const { rows: favourite } = await db.query(
    `
    DELETE FROM favourites
    WHERE property_id = $1 AND guest_id = $2
    RETURNING *;
    `,
    [propertyId, userId]
  );

  if (favourite.length === 0) {
    return Promise.reject({ status: 404, msg: 'Passed id not found.' });
  }
};

const fetchPropertyBookings = async (id) => {
  const { rows: bookings } = await db.query(
    `
   SELECT booking_id,check_in_date,check_out_date,created_at
   FROM bookings
   WHERE property_id = $1
   ORDER BY check_out_date DESC;
    `,
    [id]
  );

  if (bookings.length === 0) {
    return Promise.reject({ status: 404, msg: 'Property not found.' });
  }

  return { bookings, property_id: id };
};

const sendBooking = async (propertyId, guestId, checkInDate, checkOutDate) => {};

module.exports = {
  fetchProperties,
  fetchPropertyById,
  fetchPropertyReviews,
  sendPropertyReview,
  sendPropertyFavourited,
  eraseFavourited,
  fetchPropertyBookings,
  sendBooking,
};
