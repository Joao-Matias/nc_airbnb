const db = require('../connection');

const createAllTables = async () => {
  await db.query(`CREATE TABLE users(
        user_id SERIAL PRIMARY KEY,
        first_name VARCHAR NOT NULL,
        surname VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        phone_number VARCHAR,
        is_host BOOLEAN NOT NULL,
        avatar VARCHAR,
        created_at TIMESTAMP DEFAULT Now()
      );`);

  await db.query(`CREATE TABLE property_types(
      property_type VARCHAR PRIMARY KEY,
      description TEXT NOT NULL                    
       );`);

  await db.query(`CREATE TABLE properties(
        property_id SERIAL PRIMARY KEY,
        host_id INTEGER REFERENCES users(user_id) NOT NULL,
        name VARCHAR NOT NULL,
        location VARCHAR NOT NULL,
        property_type VARCHAR REFERENCES property_types(property_type) NOT NULL,
        price_per_night DECIMAL NOT NULL,
        description TEXT
);`);

  await db.query(`CREATE TABLE reviews(
        review_id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(property_id) NOT NULL,
        guest_id INTEGER REFERENCES users(user_id) NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT Now()
);`);

  await db.query(`CREATE TABLE images(
        image_id SERIAL PRIMARY KEY,
        property_id INTEGER REFERENCES properties(property_id) NOT NULL,
        image_url VARCHAR NOT NULL,
        alt_text VARCHAR NOT NULL
  );`);

  await db.query(`CREATE TABLE favourites(
        favourite_id SERIAL PRIMARY KEY,
        guest_id INTEGER REFERENCES users(user_id) NOT NULL,
        property_id INTEGER REFERENCES properties(property_id) NOT NULL
    );`);

  await db.query(`CREATE TABLE amenities(
      amenity VARCHAR PRIMARY KEY 
      );`);

  await db.query(`CREATE TABLE properties_amenities(
      property_amenitiy_id SERIAL PRIMARY KEY,
      property_id INTEGER REFERENCES properties(property_id) NOT NULL,
      amenity_slug VARCHAR REFERENCES amenities(amenity) NOT NULL

      );`);
};

module.exports = createAllTables;
