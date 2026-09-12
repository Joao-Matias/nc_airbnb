const db = require('../db/connection');

const fetchAmenities = async () => {
  const { rows: amenities } = await db.query(`
        SELECT amenity_slug,amenity AS amenity_text
        FROM amenities 
        JOIN properties_amenities 
        ON amenities.amenity = properties_amenities.amenity_slug 
        GROUP BY amenity_slug, amenities.amenity;
        `);

  return amenities;
};

module.exports = { fetchAmenities };
