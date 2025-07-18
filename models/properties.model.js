const { checkout } = require('../app');
const db = require('../db/connection');

const fetchProperties = async (maxPrice, minPrice, sortBy, hostId, order, amenity) => {
  const queryValues = [];
  let whereStr = '';
  let sortStr = 'ORDER BY COUNT(properties.property_id)';
  let joinStr = ` LEFT JOIN favourites ON properties.property_id = favourites.property_id LEFT JOIN (SELECT DISTINCT ON (property_id) * FROM images) images ON properties.property_id = images.property_id`;
  let orderStr = ' DESC';
  let havingStr = '';

  const { rows: currentAmenities } = await db.query(`SELECT * FROM amenities;`);

  const validAmenities = currentAmenities.map(({ amenity }) => amenity);
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

  if (amenity) {
    if (Array.isArray(amenity)) {
      for (let i = 0; i < amenity.length; i++) {
        if (!validAmenities.includes(amenity[i])) {
          return Promise.reject({ status: 400, msg: 'Invalid amenity passed.' });
        }
      }
      queryValues.push(...amenity);

      havingStr += ` HAVING COUNT(DISTINCT amenity_slug) = ${amenity.length}`;
    } else {
      if (!validAmenities.includes(amenity)) {
        return Promise.reject({ status: 400, msg: 'Invalid amenity passed.' });
      }
      queryValues.push(amenity);
      havingStr += ` HAVING COUNT(DISTINCT amenity_slug) = 1`;
    }

    if (maxPrice || minPrice || hostId) {
      whereStr += ` AND amenity_slug IN (`;
    } else {
      whereStr += ` amenity_slug IN (`;
    }

    if (!Array.isArray(amenity)) {
      whereStr += ` $${queryValues.length})`;
    } else {
      for (let i = 0; i < amenity.length; i++) {
        const indexOfAmenity = queryValues.indexOf(amenity[i]) + 1;
        whereStr += `$${indexOfAmenity},`;
      }
      whereStr = whereStr.slice(0, -1) + `)`;
    }
    joinStr += ` LEFT JOIN properties_amenities
    ON properties.property_id = properties_amenities.property_id
    LEFT JOIN amenities
    ON properties_amenities.amenity_slug = amenities.amenity`;
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

  const { rows: properties } = await db.query(
    `SELECT 
    properties.property_id ,name AS property_name,location,price_per_night, CONCAT(first_name,' ',surname) AS host,image_url AS image,COUNT(properties.property_id)
    FROM properties
    JOIN users
    ON properties.host_id=users.user_id
    ${joinStr}
    ${whereStr}
    GROUP BY properties.property_id,property_name,properties.location,properties.price_per_night,users.first_name,users.surname,images.image_url
    ${havingStr}
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
    LEFT JOIN favourites
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

const sendBooking = async (propertyId, guestId, checkInDate, checkOutDate) => {
  const queryValues = [propertyId, guestId, checkInDate, checkOutDate];

  const { rows: propertyBooked } = await db.query(
    `
  SELECT * FROM bookings
  WHERE property_id = $1 AND check_in_date >= $2  AND check_out_date <= $3;
  `,
    [propertyId, new Date(checkInDate), new Date(checkOutDate)]
  );

  if (propertyBooked.length > 0) {
    return Promise.reject({ status: 400, msg: 'Property already booked for this dates.' });
  }

  if (new Date(checkOutDate) < new Date(checkInDate)) {
    return Promise.reject({ status: 400, msg: 'Checkout date needs to be after checkin date.' });
  }

  const {
    rows: [booking],
  } = await db.query(
    `
    INSERT INTO bookings (property_id,guest_id,check_in_date,check_out_date)
    VALUES($1,$2,$3,$4) RETURNING *;
    `,
    queryValues
  );

  return { msg: 'Booking successful.', booking_id: booking.booking_id };
};

const fetchPropertyAmenities = async (id) => {
  const {
    rows: [amenities],
  } = await db.query(
    `
    SELECT property_id,name, (SELECT ARRAY_AGG(amenity_slug) from properties_amenities WHERE property_id=$1) AS amenities
    FROM properties
    WHERE properties.property_id = $1
    `,
    [id]
  );

  if (amenities === undefined) {
    return Promise.reject({ status: 404, msg: 'Property not found.' });
  }

  return amenities;
};

module.exports = {
  fetchProperties,
  fetchPropertyById,
  fetchPropertyReviews,
  sendPropertyReview,
  sendPropertyFavourited,
  eraseFavourited,
  fetchPropertyBookings,
  sendBooking,
  fetchPropertyAmenities,
};
