const db = require('../db/connection');

const fetchProperties = async () => {
  const { rows: properties } = await db.query(`SELECT 
    favourites.property_id ,name AS property_name,location,price_per_night, CONCAT(first_name,' ',surname) AS host
    FROM properties
    JOIN users
    ON properties.host_id=users.user_id
    JOIN favourites ON properties.property_id = favourites.property_id 
    GROUP BY favourites.property_id,property_name,properties.location,properties.price_per_night,users.first_name,users.surname
    ORDER BY COUNT(favourites.property_id) DESC
    ;`);

  return properties;
};

module.exports = { fetchProperties };
