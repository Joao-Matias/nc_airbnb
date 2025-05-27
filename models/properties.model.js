const db = require('../db/connection');

const fetchProperties = async (maxPrice, minPrice, sortBy, hostId) => {
  const queryValues = [];
  let whereStr = '';
  let sortStr = 'ORDER BY COUNT(favourites.property_id)';

  const validSortBy = ['cost_per_night', 'popularity'];

  if (maxPrice || minPrice || hostId) {
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
        sortStr += ` ${sortBy}`;
      }
    }
  }

  const { rows: properties } = await db.query(
    `SELECT 
    properties.property_id ,name AS property_name,location,price_per_night, CONCAT(first_name,' ',surname) AS host
    FROM properties
    JOIN users
    ON properties.host_id=users.user_id
    LEFT JOIN favourites 
    ON properties.property_id = favourites.property_id 
    ${whereStr}
    GROUP BY properties.property_id,property_name,properties.location,properties.price_per_night,users.first_name,users.surname
    ${sortStr} DESC;`,
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
    properties.property_id,name AS property_name, location, price_per_night,description, CONCAT(first_name,' ',surname) AS host, avatar AS host_avatar, COUNT(favourites.property_id) AS favourite_count${favouritedStr}
    FROM properties 
    JOIN users
    ON properties.host_id = users.user_id
    JOIN favourites
    ON properties.property_id = favourites.property_id
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

module.exports = { fetchProperties, fetchPropertyById, fetchPropertyReviews, sendPropertyReview };
