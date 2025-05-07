const db = require('./connection');

async function seed() {
  await db.query(`DROP TABLE IF EXISTS property_types;`);
  await db.query(`DROP TABLE IF EXISTS properties;`);
  await db.query(`DROP TABLE IF EXISTS reviews;`);
  await db.query(`DROP TABLE IF EXISTS users;`);

  await db.query(`CREATE TABLE users(
                  user_id SERIAL PRIMARY KEY,
                  first_name VARCHAR NOT NULL,
                  surname VARCHAR NOT NULL,
                  email VARCHAR NOT NULL,
                  phone_number VARCHAR,
                  is_host BOOLEAN NOT NULL,
                  avatar VARCHAR,
                  created_at TIMESTAMP
                );`);

  await db.query(`CREATE TABLE reviews(
                  review_id SERIAL PRIMARY KEY,
                  property_id INTEGER NOT NULL,
                  guest_id INTEGER REFERENCES users(user_id) NOT NULL,
                  rating INTEGER NOT NULL,
                  comment TEXT,
                  created_at TIMESTAMP
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
}

module.exports = seed;
