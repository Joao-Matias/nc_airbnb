const db = require('./connection');
const format = require('pg-format');
const { insertProperties, insertReviews, insertImages } = require('./util-functions/manage-table');

async function seed(usersData, propertyTypesData, propertiesData, reviewsData, imagesData) {
  await db.query(`DROP TABLE IF EXISTS images;`);
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

  await db.query(`CREATE TABLE images(
            image_id SERIAL PRIMARY KEY,
            property_id INTEGER REFERENCES properties(property_id) NOT NULL,
            image_url VARCHAR NOT NULL,
            alt_text VARCHAR NOT NULL
            )`);

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
}

module.exports = seed;
