const db = require('./connection');
const format = require('pg-format');
const { insertProperties } = require('./util-functions/manage-table');

async function seed(usersData, propertyTypesData, propertiesData) {
  await db.query(`DROP TABLE IF EXISTS reviews;`);
  await db.query(`DROP TABLE IF EXISTS properties;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS property_types;`);

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

  const { rows: insertedUSers } = await db.query(
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
      insertProperties(propertiesData, insertedUSers)
    )
  );
}

module.exports = seed;
