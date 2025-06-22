const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seed');
const {
  usersData,
  propertyTypesData,
  propertiesData,
  reviewsData,
  imagesData,
  favouritesData,
  bookingsData,
} = require('../db/data/test/index');

afterAll(() => {
  db.end();
});

beforeEach(async () => {
  await seed(usersData, propertyTypesData, propertiesData, reviewsData, imagesData, favouritesData, bookingsData);
});

describe('app', () => {
  test('non-existen endpoint responds with 404 msg', async () => {
    const { body } = await request(app).get('/non-existant-path').expect(404);

    expect(body.msg).toBe('Path not found.');
  });

  describe('GET /api/users/:id', () => {
    test('respond with a status of 200', async () => {
      await request(app).get('/api/users/1').expect(200);
    });

    test('respond with the following properties - user_id,first_name,surname,email,phone_number,avatar,created_at', async () => {
      const { body } = await request(app).get('/api/users/1');

      expect(body.user.hasOwnProperty('user_id')).toBe(true);
      expect(body.user.hasOwnProperty('first_name')).toBe(true);
      expect(body.user.hasOwnProperty('surname')).toBe(true);
      expect(body.user.hasOwnProperty('email')).toBe(true);
      expect(body.user.hasOwnProperty('phone_number')).toBe(true);
      expect(body.user.hasOwnProperty('avatar')).toBe(true);
      expect(body.user.hasOwnProperty('created_at')).toBe(true);
    });

    test('invalid Id responds with 400 and msg', async () => {
      const { body } = await request(app).get('/api/users/invalid_id').expect(400);

      expect(body.msg).toBe('Bad request.');
    });
    test('valid ID by non-existent responds with 404 and msg', async () => {
      const { body } = await request(app).get('/api/users/999').expect(404);

      expect(body.msg).toBe('User not found.');
    });
  });

  describe('GET /api/properties', () => {
    test('respond with a status of 200 and an array', async () => {
      const { body } = await request(app).get('/api/properties').expect(200);

      expect(Array.isArray(body.properties)).toBe(true);
    });

    test('responds with the following properties - property_id,property_name,location,price_per_night,host', async () => {
      const { body } = await request(app).get('/api/properties').expect(200);

      expect(body.properties.length > 0).toBe(true);

      body.properties.forEach((property) => {
        expect(property.hasOwnProperty('property_id')).toBe(true);
        expect(property.hasOwnProperty('property_name')).toBe(true);
        expect(property.hasOwnProperty('location')).toBe(true);
        expect(property.hasOwnProperty('price_per_night')).toBe(true);
        expect(property.hasOwnProperty('host')).toBe(true);
      });
    });

    test('responds with an additional properties field - image', async () => {
      const { body } = await request(app).get('/api/properties').expect(200);

      expect(body.properties.length > 0).toBe(true);

      body.properties.forEach((property) => {
        expect(property.hasOwnProperty('image')).toBe(true);
      });
    });

    describe('MAXPRICE QUERY', () => {
      test('response for the optional query of maxprice should be properties with the price per night lower that the value passed', async () => {
        const valuePerNight = 100;

        const { body } = await request(app).get(`/api/properties?maxprice=${valuePerNight}`);

        body.properties.forEach((property) => {
          expect(property.price_per_night < valuePerNight).toBe(true);
        });
      });

      test('invalid minprice query responds with 400 and msg', async () => {
        const { body } = await request(app).get('/api/properties?maxprice=invalid_input').expect(400);

        expect(body.msg).toBe('Bad request.');
      });
    });
    describe('MINPRICE QUERY', () => {
      test('response for the optional query of minprice should be properties with the price per night higher that the value passed', async () => {
        const valuePerNight = 100;

        const { body } = await request(app).get(`/api/properties?minprice=100`);

        body.properties.forEach((property) => {
          expect(property.price_per_night > valuePerNight).toBe(true);
        });
      });
      test('invalid minprice query responds with 400 and msg', async () => {
        const { body } = await request(app).get('/api/properties?minprice=invalid_input').expect(400);

        expect(body.msg).toBe('Bad request.');
      });
    });
    describe('SORT QUERY', () => {
      test('response for the optional query of sort should be properties organised by cost_per_night', async () => {
        const { body } = await request(app).get('/api/properties?sort=cost_per_night');

        expect(body.properties).toBeSortedBy('price_per_night', { descending: true, coerce: true });
      });

      test('response for the optional query of sort should be properties organised by popularity', async () => {
        const { body } = await request(app).get('/api/properties?sort=popularity');

        // Manually inputing the values of the most 3 most popular properties

        expect(body.properties[0].property_id).toBe(1);
        expect(body.properties[1].property_id).toBe(2);
        expect(body.properties[2].property_id).toBe(7);
      });

      test('invalid cost_per_night query responds with 400 and msg', async () => {
        const { body } = await request(app).get('/api/properties?sort=invalid_input').expect(400);

        expect(body.msg).toBe('Invalid sort query.');
      });
    });
    describe('HOST QUERY', () => {
      test('response for the optional query of host should be properties only with the passed host id', async () => {
        const { body } = await request(app).get('/api/properties?host=1');

        body.properties.forEach((property) => {
          expect(property.host).toBe('Alice Johnson');
        });
      });

      test('invalid cost_per_night query responds with 400 and msg', async () => {
        const { body } = await request(app).get('/api/properties?host=invalid_input').expect(400);

        expect(body.msg).toBe('Bad request.');
      });
      test('valid ID by non-existent responds with 404 and msg', async () => {
        const { body } = await request(app).get('/api/properties?host=99').expect(404);

        expect(body.msg).toBe('User not found.');
      });
    });
    describe('ORDER QUERY', () => {
      test('response for the optional query of order should organise properties in ascending order ', async () => {
        const { body } = await request(app).get('/api/properties?order=ascending');

        expect(body.properties.slice(-1)[0].property_id).toBe(2);
        expect(body.properties.slice(-2)[0].property_id).toBe(3);
      });

      test('response for the optional query of order should organise properties in descending order ', async () => {
        const { body } = await request(app).get('/api/properties?order=descending');

        expect(body.properties[0].property_id).toBe(2);
        expect(body.properties[1].property_id).toBe(3);
      });
    });
    describe('AMENITY QUERY', () => {
      test('response for the optional query of filtering by the amenity passed', async () => {
        const { body } = await request(app).get('/api/properties?amenity=Washer');

        expect(body.properties[0].property_id).toBe(4);
        expect(body.properties[1].property_id).toBe(7);
        expect(body.properties[2].property_id).toBe(10);
      });

      test('response for multiple addition of several amenities keep filtering down', async () => {
        const { body } = await request(app).get('/api/properties?amenity=Washer&amenity=TV');

        expect(body.properties[0].property_id).toBe(4);
      });

      test('amenity passed not found returns 404', async () => {
        const { body } = await request(app).get('/api/properties?amenity=Washer&amenity=Football').expect(400);

        expect(body.msg).toBe('Invalid amenity passed.');
      });
    });
  });

  describe('GET /api/properties/:id', () => {
    test('respond with a status of 200', async () => {
      await request(app).get('/api/properties/1').expect(200);
    });

    test('respond with the following properties - property_id,property_name,location,price_per_night,description,host,host_avatar,favourite_count', async () => {
      const { body } = await request(app).get('/api/properties/1');

      expect(body.property.hasOwnProperty('property_id')).toBe(true);
      expect(body.property.hasOwnProperty('property_name')).toBe(true);
      expect(body.property.hasOwnProperty('location')).toBe(true);
      expect(body.property.hasOwnProperty('price_per_night')).toBe(true);
      expect(body.property.hasOwnProperty('description')).toBe(true);
      expect(body.property.hasOwnProperty('host')).toBe(true);
      expect(body.property.hasOwnProperty('host_avatar')).toBe(true);
      expect(body.property.hasOwnProperty('favourite_count')).toBe(true);
    });

    test('should take a optional query of ?user_id and add a property - favourites - returning if the passed user has or not favourited the property in a boolean', async () => {
      const { body } = await request(app).get('/api/properties/1?user_id=3');

      expect(body.property.hasOwnProperty('favourited')).toBe(true);
      expect(body.property.favourited).toBe(false);
    });

    test('should respond with an aditional field - images - and should be an array', async () => {
      const { body } = await request(app).get('/api/properties/1');

      expect(body.property.hasOwnProperty('images')).toBe(true);
      expect(Array.isArray(body.property.images)).toBe(true);
    });

    test('invalid property Id responds with 400 and msg', async () => {
      const { body } = await request(app).get('/api/properties/invalid_id').expect(400);

      expect(body.msg).toBe('Bad request.');
    });
    test('valid property ID and non-existent responds with 404 and msg', async () => {
      const { body } = await request(app).get('/api/properties/999?user_id=1').expect(404);

      expect(body.msg).toBe('Property not found.');
    });
  });

  describe('GET /api/properties/:id/reviews', () => {
    test('should return a status 200 and an array', async () => {
      const { body } = await request(app).get('/api/properties/1/reviews').expect(200);

      expect(Array.isArray(body.reviews)).toBe(true);
    });

    test('reviews responds with the following properties - review_id,comment,rating,created_at,guest,guest_avatar', async () => {
      const { body } = await request(app).get('/api/properties/1/reviews');

      expect(body.reviews.length > 0).toBe(true);

      body.reviews.forEach((review) => {
        expect(review.hasOwnProperty('review_id')).toBe(true);
        expect(review.hasOwnProperty('comment')).toBe(true);
        expect(review.hasOwnProperty('rating')).toBe(true);
        expect(review.hasOwnProperty('created_at')).toBe(true);
        expect(review.hasOwnProperty('guest')).toBe(true);
        expect(review.hasOwnProperty('guest_avatar')).toBe(true);
      });

      expect(body.hasOwnProperty('average_rating')).toBe(true);
    });

    test('should respond order by the newest reviews to the oldest', async () => {
      const { body } = await request(app).get('/api/properties/1/reviews');

      expect(body.reviews).toBeSortedBy('created_at');
    });

    test('invalid property Id responds with 400 and msg', async () => {
      const { body } = await request(app).get('/api/properties/invalid_id/reviews').expect(400);

      expect(body.msg).toBe('Bad request.');
    });
    test('valid property ID by non-existent responds with 404 and msg', async () => {
      const { body } = await request(app).get('/api/properties/99/reviews').expect(404);

      expect(body.msg).toBe('Property not found.');
    });
  });

  describe('POST /api/properties/:id/reviews', () => {
    test('responds with an object', async () => {
      const newReview = {
        guest_id: 2,
        rating: 5,
        comment: 'Perfect stay.',
      };

      const { body } = await request(app).post('/api/properties/1/reviews').send(newReview).expect(201);

      expect(typeof body).toBe('object');
    });

    test('responds to the creation of the review with the following properties - review_id,property_id,guest_id,rating_comment,created_at', async () => {
      const newReview = {
        guest_id: 2,
        rating: 5,
        comment: 'Perfect stay.',
      };

      const { body } = await request(app).post('/api/properties/1/reviews').send(newReview);

      expect(body.hasOwnProperty('review_id')).toBe(true);
      expect(body.hasOwnProperty('property_id')).toBe(true);
      expect(body.hasOwnProperty('guest_id')).toBe(true);
      expect(body.hasOwnProperty('rating')).toBe(true);
      expect(body.hasOwnProperty('comment')).toBe(true);
      expect(body.hasOwnProperty('created_at')).toBe(true);
    });

    test('sent body needs to have 3 properties - guest_id,rating,comment', async () => {
      const newReview = {
        guest_id: 2,
        rating: 5,
        comment: 'Perfect stay.',
      };

      await request(app).post('/api/properties/99/reviews').send(newReview);

      expect(newReview.hasOwnProperty('guest_id')).toBe(true);
      expect(newReview.hasOwnProperty('rating')).toBe(true);
      expect(newReview.hasOwnProperty('comment')).toBe(true);
    });

    test('valid property ID by non-existent responds with 404 and msg', async () => {
      const newReview = {
        guest_id: 2,
        rating: 5,
        comment: 'Perfect stay.',
      };

      const { body } = await request(app).post('/api/properties/99/reviews').send(newReview).expect(404);

      expect(body.msg).toBe('Property not found.');
    });

    test('invalid rating passed on body responds with 404 and msg', async () => {
      const newReview = {
        guest_id: 2,
        rating: 'INVALID',
        comment: 'Perfect stay.',
      };

      const { body } = await request(app).post('/api/properties/1/reviews').send(newReview).expect(400);

      expect(body.msg).toBe('Invalid payload setup.');
    });

    test('invalid guest id passed on body responds with 404 and msg', async () => {
      const newReview = {
        guest_id: 'INVALID',
        rating: 2,
        comment: 'Perfect stay.',
      };

      const { body } = await request(app).post('/api/properties/1/reviews').send(newReview).expect(400);

      expect(body.msg).toBe('Bad request.');
    });

    test('valid guest id but non existent passed on body responds with 400 and msg', async () => {
      const newReview = {
        guest_id: 99,
        rating: 2,
        comment: 'Perfect stay.',
      };

      const { body } = await request(app).post('/api/properties/1/reviews').send(newReview).expect(404);

      expect(body.msg).toBe('Id passed not found.');
    });

    test('Missing properties from the body responds with 400', async () => {
      const newReview = {
        rating: 2,
      };

      const { body } = await request(app).post('/api/properties/1/reviews').send(newReview).expect(400);

      expect(body.msg).toBe('Bad request.');
    });
    test('Missing properties from the body responds with 400', async () => {
      const newReview = {
        guest_id: 1,
        rating: 2,
        banana: 'INVALID PROPERTY',
      };

      const { body } = await request(app).post('/api/properties/1/reviews').send(newReview).expect(400);

      expect(body.msg).toBe('Bad request.');
    });
  });

  describe('GET /api/properties/:id/amenities', () => {
    test('responds with 200 and an array for the amenities', async () => {
      const { body } = await request(app).get('/api/properties/1/amenities').expect(200);

      expect(Array.isArray(body.amenities)).toBe(true);
    });

    test('responds with an array of amenities from passed property', async () => {
      const { body } = await request(app).get('/api/properties/4/amenities');

      // Manually checking the values from DB

      expect(body.amenities[0]).toBe('TV');
      expect(body.amenities[1]).toBe('Kitchen');
      expect(body.amenities[2]).toBe('Washer');
    });

    test('responds with property_id, name, amenities properties', async () => {
      const { body } = await request(app).get('/api/properties/4/amenities');

      expect(body.hasOwnProperty('property_id')).toBe(true);
      expect(body.hasOwnProperty('name')).toBe(true);
      expect(body.hasOwnProperty('amenities')).toBe(true);
    });

    test('invalid property Id responds with 400 and msg', async () => {
      const { body } = await request(app).get('/api/properties/invalid_id/amenities').expect(400);

      expect(body.msg).toBe('Bad request.');
    });
    test('valid property ID by non-existent responds with 404 and msg', async () => {
      const { body } = await request(app).get('/api/properties/99/amenities').expect(404);

      expect(body.msg).toBe('Property not found.');
    });
  });

  describe('PATCH /api/users/:id', () => {
    test('responds with an object', async () => {
      const updatedUser = {
        first_name: 'Joseph',
        surname: 'Putts',
        email: 'josputts@gmail.com',
        phone: '07887554345',
        avatar: 'https://example.com/images/alice.jpg',
      };
      const { body } = await request(app).patch('/api/users/1').send(updatedUser).expect(200);

      expect(typeof body).toBe('object');
    });

    test('responds to the updated user with the any combination of the following properties - first_name,surname,email,phone,avatar', async () => {
      const updatedUser = {
        first_name: 'Joseph',
        surname: 'Putts',
        email: 'josputts@gmail.com',
        phone: '07887554345',
        avatar: 'https://example.com/images/alice.jpg',
      };
      const { body } = await request(app).patch('/api/users/1').send(updatedUser).expect(200);

      expect(body.user.hasOwnProperty('first_name')).toBe(true);
      expect(body.user.hasOwnProperty('user_id')).toBe(true);
      expect(body.user.hasOwnProperty('surname')).toBe(true);
      expect(body.user.hasOwnProperty('email')).toBe(true);
      expect(body.user.hasOwnProperty('phone_number')).toBe(true);
      expect(body.user.hasOwnProperty('avatar')).toBe(true);
      expect(body.user.hasOwnProperty('is_host')).toBe(true);
      expect(body.user.hasOwnProperty('created_at')).toBe(true);
    });

    test('should only update the passed properties with the values passed', async () => {
      const updatedUser = {
        email: 'josputts@gmail.com',
        phone: '07887554345',
        avatar: 'https://example.com/images/alice.jpg',
      };
      const { body } = await request(app).patch('/api/users/1').send(updatedUser).expect(200);

      expect(body.user.first_name).toBe('Alice');
      expect(body.user.surname).toBe('Johnson');
      expect(body.user.email).toBe('josputts@gmail.com');
      expect(body.user.phone_number).toBe('07887554345');
      expect(body.user.avatar).toBe('https://example.com/images/alice.jpg');
    });

    test('valid user ID by non-existent responds with 404 and msg', async () => {
      const updatedUser = {
        email: 'josputts@gmail.com',
        phone: '07887554345',
        avatar: 'https://example.com/images/alice.jpg',
      };

      const { body } = await request(app).patch('/api/users/99').send(updatedUser).expect(404);

      expect(body.msg).toBe('User not found.');
    });

    test('invalid path responds with 400 and msg', async () => {
      const updatedUser = {
        email: 'josputts@gmail.com',
        phone: '07887554345',
        avatar: 'https://example.com/images/alice.jpg',
      };

      const { body } = await request(app).patch('/api/users/INVALID').send(updatedUser).expect(400);

      expect(body.msg).toBe('Bad request.');
    });

    test('invalid properties are passed responds with 400 ', async () => {
      const updatedUser = {
        banana: 'Joe',
        email: 'josputts@gmail.com',
        phone: '07817554345',
        avatar: 'https://example.com/images/alice.jpg',
      };

      const { body } = await request(app).patch('/api/users/1').send(updatedUser).expect(400);

      expect(body.msg).toBe('Bad request.');
    });

    test('invalid value for phone number responds with 400 ', async () => {
      const updatedUser = {
        email: 'josputts@gmail.com',
        phone: '0787553451',
        avatar: 'https://example.com/images/alice.jpg',
      };

      const { body } = await request(app).patch('/api/users/1').send(updatedUser).expect(400);

      expect(body.msg).toBe('Invalid phone number.');
    });
  });

  describe('DELETE /api/reviews/:id', () => {
    test('responds with no body and 204 and a empty object', async () => {
      const { body } = await request(app).delete('/api/reviews/1').expect(204);

      expect(body).toEqual({});
    });

    test('invalid review id', async () => {
      const { body } = await request(app).delete('/api/reviews/INVALID').expect(400);

      expect(body.msg).toBe('Bad request.');
    });

    test('valid review id but non existent', async () => {
      const { body } = await request(app).delete('/api/reviews/99').expect(404);

      expect(body.msg).toBe('Review not found.');
    });
  });

  describe('POST /api/properties/:id/favourite', () => {
    test('responds with an object and a 201 code', async () => {
      const user = {
        guest_id: 2,
      };

      const { body } = await request(app).post('/api/properties/1/favourite').send(user).expect(201);

      expect(typeof body).toEqual('object');
    });

    test('responds with the following properties - msg,favourite_id', async () => {
      const user = {
        guest_id: 2,
      };

      const { body } = await request(app).post('/api/properties/1/favourite').send(user).expect(201);

      expect(body.hasOwnProperty('msg')).toBe(true);
      expect(body.hasOwnProperty('favourite_id')).toBe(true);
    });

    test('invalid property id', async () => {
      const user = {
        guest_id: 2,
      };

      const { body } = await request(app).post('/api/properties/INVALID/favourite').send(user).expect(400);

      expect(body.msg).toBe('Bad request.');
    });

    test('valid property id but non existent', async () => {
      const user = {
        guest_id: 2,
      };
      const { body } = await request(app).post('/api/properties/99/favourite').send(user).expect(404);

      expect(body.msg).toBe('Id passed not found.');
    });
    test('invalid payload value 400', async () => {
      const user = {
        guest_id: 'INVALID',
      };
      const { body } = await request(app).post('/api/properties/1/favourite').send(user).expect(400);

      expect(body.msg).toBe('Bad request.');
    });
    test('valid guest id payload but non existent responds 404', async () => {
      const user = {
        guest_id: 99,
      };
      const { body } = await request(app).post('/api/properties/1/favourite').send(user).expect(404);

      expect(body.msg).toBe('Id passed not found.');
    });
    test('missing payload responds 400', async () => {
      const user = {};
      const { body } = await request(app).post('/api/properties/1/favourite').send(user).expect(400);

      expect(body.msg).toBe('Missing guest_id.');
    });
  });

  describe('DELETE /api/properties/:id/users/:user_id/favourite', () => {
    test('responds with 204 code', async () => {
      await request(app).delete('/api/properties/1/users/2/favourite').expect(204);
    });

    test('responds without the value passed in the data base', async () => {
      await request(app).delete('/api/properties/2/users/6/favourite').expect(204);

      const { rows: favourites } = await db.query(`SELECT * FROM favourites;`);

      favourites.forEach((favourite) => {
        expect(favourite.guest_id).not.toBe('6');
        expect(favourite.property_id).not.toBe('2');
      });
    });

    test('Invalid path responds with 404 ', async () => {
      const { body } = await request(app).delete('/api/properties/1/INVALID').expect(404);

      expect(body.msg).toBe('Path not found.');
    });

    test('invalid property id', async () => {
      const { body } = await request(app).delete('/api/properties/INVALID/users/1/favourite').expect(400);

      expect(body.msg).toBe('Bad request.');
    });

    test('valid property id but non existent', async () => {
      const { body } = await request(app).delete('/api/properties/99/users/1/favourite').expect(404);

      expect(body.msg).toBe('Passed id not found.');
    });

    test('invalid user id but non existent', async () => {
      const { body } = await request(app).delete('/api/properties/1/users/INVALID/favourite').expect(400);

      expect(body.msg).toBe('Bad request.');
    });

    test('valid user id but non existent', async () => {
      const { body } = await request(app).delete('/api/properties/1/users/99/favourite').expect(404);

      expect(body.msg).toBe('Passed id not found.');
    });
  });

  describe('GET /api/amenities', () => {
    test('responds with a 200 code and an object', async () => {
      const { body } = await request(app).get('/api/amenities').expect(200);

      expect(typeof body.amenities).toBe('object');
    });

    test('responds with properties - amenity_slug,amenity_text', async () => {
      const { body } = await request(app).get('/api/amenities');

      body.amenities.forEach((amenity) => {
        expect(amenity.hasOwnProperty('amenity_slug')).toBe(true);
        expect(amenity.hasOwnProperty('amenity_text')).toBe(true);
      });
    });

    test('Invalid path responds with 404 ', async () => {
      const { body } = await request(app).get('/api/INVALID').expect(404);

      expect(body.msg).toBe('Path not found.');
    });
  });

  describe('GET /api/properties/:id/bookings', () => {
    test('responds with a 200 code and an array', async () => {
      const { body } = await request(app).get('/api/properties/1/bookings').expect(200);

      expect(Array.isArray(body.bookings)).toBe(true);
    });

    test('responds with properties for the bookings - booking_id,check_in_data,check_out_date,created_at', async () => {
      const { body } = await request(app).get('/api/properties/1/bookings');

      expect(body.bookings.length > 0).toBe(true);

      body.bookings.forEach((booking) => {
        expect(booking.hasOwnProperty('booking_id')).toBe(true);
        expect(booking.hasOwnProperty('check_in_date')).toBe(true);
        expect(booking.hasOwnProperty('check_out_date')).toBe(true);
        expect(booking.hasOwnProperty('created_at')).toBe(true);
      });

      expect(body.hasOwnProperty('property_id')).toBe(true);
    });

    test('responds with the results organized by latest to earliest checkout date', async () => {
      const { body } = await request(app).get('/api/properties/1/bookings');

      // Manually select the order to test

      expect(body.bookings[0].booking_id).toBe(3);
      expect(body.bookings[1].booking_id).toBe(2);
      expect(body.bookings[2].booking_id).toBe(4);
      expect(body.bookings[3].booking_id).toBe(1);
    });

    test('Invalid path responds with 404 ', async () => {
      const { body } = await request(app).get('/api/properties/1/INVALID').expect(404);

      expect(body.msg).toBe('Path not found.');
    });
    test('invalid property id', async () => {
      const { body } = await request(app).get('/api/properties/INVALID/bookings').expect(400);

      expect(body.msg).toBe('Bad request.');
    });
    test('valid property id but non existent', async () => {
      const { body } = await request(app).get('/api/properties/99/bookings').expect(404);

      expect(body.msg).toBe('Property not found.');
    });
  });

  describe('DELETE /api/bookings/:id', () => {
    test('responds with a 204 code', async () => {
      await request(app).delete('/api/bookings/1').expect(204);
    });

    test('check in data base confirming the deleted booking', async () => {
      await request(app).delete('/api/bookings/1').expect(204);

      const { rows: bookings } = await db.query('SELECT * FROM bookings');

      bookings.forEach((booking) => {
        expect(booking.booking_id).not.toBe(1);
      });
    });

    test('invalid booking id', async () => {
      const { body } = await request(app).delete('/api/bookings/INVALID').expect(400);

      expect(body.msg).toBe('Bad request.');
    });

    test('valid booking id but non existent', async () => {
      const { body } = await request(app).delete('/api/bookings/99').expect(404);

      expect(body.msg).toBe('Booking not found.');
    });
  });

  describe('PATCH /api/bookings/:id', () => {
    test('responds with 200 code and an obj of the specific booking', async () => {
      const updatedDates = {
        check_in_date: '2025-06-15',
        check_out_date: '2025-06-30',
      };

      const { body } = await request(app).patch('/api/bookings/1').send(updatedDates).expect(200);

      expect(typeof body).toBe('object');
    });

    test('responds with bookings properties - booking_id,property_id,guest_id,check_in_date,check_out_date,created_at', async () => {
      const updatedDates = {
        check_in_date: '2025-06-15',
        check_out_date: '2025-06-30',
      };

      const { body } = await request(app).patch('/api/bookings/1').send(updatedDates);

      expect(body.hasOwnProperty('booking_id')).toBe(true);
      expect(body.hasOwnProperty('property_id')).toBe(true);
      expect(body.hasOwnProperty('guest_id')).toBe(true);
      expect(body.hasOwnProperty('check_in_date')).toBe(true);
      expect(body.hasOwnProperty('check_out_date')).toBe(true);
      expect(body.hasOwnProperty('created_at')).toBe(true);
    });
    test('responds with bookings properties - booking_id,property_id,guest_id,check_in_date,check_out_date,created_at', async () => {
      const updatedDates = {
        check_in_date: '2025-06-15',
        check_out_date: '2025-06-30',
      };

      const { body } = await request(app).patch('/api/bookings/1').send(updatedDates);

      expect(body.hasOwnProperty('booking_id')).toBe(true);
      expect(body.hasOwnProperty('property_id')).toBe(true);
      expect(body.hasOwnProperty('guest_id')).toBe(true);
      expect(body.hasOwnProperty('check_in_date')).toBe(true);
      expect(body.hasOwnProperty('check_out_date')).toBe(true);
      expect(body.hasOwnProperty('created_at')).toBe(true);
    });

    test('invalid property Id and 400', async () => {
      const updatedDates = {
        check_in_date: '2025-06-15',
        check_out_date: '2025-06-30',
      };

      const { body } = await request(app).patch('/api/bookings/INVALID').send(updatedDates).expect(400);

      expect(body.msg).toBe('Bad request.');
    });
    test('valid property Id but non existent, and 404', async () => {
      const updatedDates = {
        check_in_date: '2025-06-15',
        check_out_date: '2025-06-30',
      };

      const { body } = await request(app).patch('/api/bookings/99').send(updatedDates).expect(404);

      expect(body.msg).toBe('Booking not found.');
    });

    test('missing checkin', async () => {
      const updatedDates = {
        check_out_date: '2025-06-30',
      };

      const { body } = await request(app).patch('/api/bookings/1').send(updatedDates).expect(400);

      expect(body.msg).toBe('Date missing.');
    });
    test('missing checkin', async () => {
      const updatedDates = {
        check_in_date: '2025-06-30',
      };

      const { body } = await request(app).patch('/api/bookings/1').send(updatedDates).expect(400);

      expect(body.msg).toBe('Date missing.');
    });

    test('invalid checkin responds with and 404', async () => {
      const updatedDates = {
        check_in_date: 'INVALID',
        check_out_date: '2025-06-30',
      };

      const { body } = await request(app).patch('/api/bookings/1').send(updatedDates).expect(400);

      expect(body.msg).toBe('Bad request.');
    });
    test('invalid checkout responds with and 404', async () => {
      const updatedDates = {
        check_in_date: '2025-06-30',
        check_out_date: 'INVALID',
      };

      const { body } = await request(app).patch('/api/bookings/1').send(updatedDates).expect(400);

      expect(body.msg).toBe('Bad request.');
    });
  });

  describe('POST /api/properties/:id/booking', () => {
    test('responds with a 201 code and an object', async () => {
      const payload = {
        guest_id: 1,
        check_in_date: '2025-07-01',
        check_out_date: '2025-07-15',
      };

      const { body } = await request(app).post('/api/properties/2/booking').send(payload).expect(201);

      expect(typeof body).toBe('object');
    });
    test('responds with properties - msg, booking_id', async () => {
      const payload = {
        guest_id: 1,
        check_in_date: '2025-07-10',
        check_out_date: '2025-07-15',
      };

      const { body } = await request(app).post('/api/properties/2/booking').send(payload);

      expect(body.hasOwnProperty('msg')).toBe(true);
      expect(body.hasOwnProperty('booking_id')).toBe(true);
    });
    test('invalid path', async () => {
      const payload = {
        guest_id: 1,
        check_in_date: '2025-07-01',
        check_out_date: '2025-07-15',
      };

      const { body } = await request(app).post('/api/properties/INVALID/booking').send(payload).expect(400);

      expect(body.msg).toBe('Bad request.');
    });
    test('invalid property id', async () => {
      const payload = {
        guest_id: 1,
        check_in_date: '2025-07-01',
        check_out_date: '2025-07-15',
      };

      const { body } = await request(app).post('/api/properties/INVALID/booking').send(payload).expect(400);

      expect(body.msg).toBe('Bad request.');
    });

    test('valid property id but non existent', async () => {
      const payload = {
        guest_id: 1,
        check_in_date: '2025-07-01',
        check_out_date: '2025-07-15',
      };

      const { body } = await request(app).post('/api/properties/99/booking').send(payload).expect(404);

      expect(body.msg).toBe('Id passed not found.');
    });

    test('invalid guest Id', async () => {
      const payload = {
        guest_id: 'INVALID',
        check_in_date: '2025-07-01',
        check_out_date: '2025-07-15',
      };
      const { body } = await request(app).post('/api/properties/1/booking').send(payload).expect(400);

      expect(body.msg).toBe('Bad request.');
    });
    test('invalid check in', async () => {
      const payload = {
        guest_id: 1,
        check_in_date: 'INVALID',
        check_out_date: '2025-07-15',
      };
      const { body } = await request(app).post('/api/properties/1/booking').send(payload).expect(400);

      expect(body.msg).toBe('Bad request.');
    });
    test('invalid check out', async () => {
      const payload = {
        guest_id: 1,
        check_in_date: '2025-07-01',
        check_out_date: 'INVALID',
      };
      const { body } = await request(app).post('/api/properties/1/booking').send(payload).expect(400);

      expect(body.msg).toBe('Bad request.');
    });

    test('valid guest id but not found', async () => {
      const payload = {
        guest_id: 99,
        check_in_date: '2025-07-01',
        check_out_date: '2025-07-15',
      };
      const { body } = await request(app).post('/api/properties/1/booking').send(payload).expect(404);

      expect(body.msg).toBe('Id passed not found.');
    });
    test('valid check out date before check in date', async () => {
      const payload = {
        guest_id: 1,
        check_in_date: '2025-07-01',
        check_out_date: '2025-06-15',
      };
      const { body } = await request(app).post('/api/properties/1/booking').send(payload).expect(400);

      expect(body.msg).toBe('Checkout date needs to be after checkin date.');
    });
    test('valid check in and out date but property already booked', async () => {
      const payload = {
        guest_id: 1,
        check_in_date: '2025-12-10',
        check_out_date: '2025-12-15',
      };
      const { body } = await request(app).post('/api/properties/2/booking').send(payload).expect(400);

      expect(body.msg).toBe('Property already booked for this dates.');
    });
  });

  describe('GET /api/users/:id/bookings', () => {
    test('respond with a 200 code and an array', async () => {
      const { body } = await request(app).get('/api/users/1/bookings').expect(200);

      expect(Array.isArray(body.bookings)).toBe(true);
    });
    test('responds with properties - booking_id,check_in_date,check_out_date,property_id,property_name,host,image', async () => {
      const { body } = await request(app).get('/api/users/1/bookings').expect(200);

      expect(body.bookings.length > 0).toBe(true);

      body.bookings.forEach((booking) => {
        expect(booking.hasOwnProperty('booking_id')).toBe(true);
        expect(booking.hasOwnProperty('check_in_date')).toBe(true);
        expect(booking.hasOwnProperty('check_out_date')).toBe(true);
        expect(booking.hasOwnProperty('property_id')).toBe(true);
        expect(booking.hasOwnProperty('property_name')).toBe(true);
        expect(booking.hasOwnProperty('host')).toBe(true);
        expect(booking.hasOwnProperty('image')).toBe(true);
      });
    });
    test('responds with chronological order for the check in dates', async () => {
      const { body } = await request(app).get('/api/users/1/bookings').expect(200);

      expect(body.bookings[0].booking_id).toBe(1);
      expect(body.bookings[1].booking_id).toBe(3);
      expect(body.bookings[2].booking_id).toBe(4);
      expect(body.bookings[3].booking_id).toBe(2);
    });
    test('invalid path responds with 404', async () => {
      const { body } = await request(app).get('/api/users/INVALID').expect(400);

      expect(body.msg).toBe('Bad request.');
    });
    test('invalid user id responds with 404', async () => {
      const { body } = await request(app).get('/api/users/INVALID/bookings').expect(400);

      expect(body.msg).toBe('Bad request.');
    });
    test('valid user id but non existent responds with 404', async () => {
      const { body } = await request(app).get('/api/users/99/bookings').expect(404);

      expect(body.msg).toBe('Id passed not found.');
    });
  });

  describe('INVALID METHODS', () => {
    test('/api/reviews/:id', async () => {
      const invalidMethods = ['get', 'post', 'put', 'patch'];

      invalidMethods.forEach(async (method) => {
        const { body } = await request(app)[method]('/api/reviews/1').expect(405);

        expect(body.msg).toBe('Invalid method.');
      });
    });
    test('/api/amenities', async () => {
      const invalidMethods = ['delete', 'post', 'put', 'patch'];

      invalidMethods.forEach(async (method) => {
        const { body } = await request(app)[method]('/api/amenities').expect(405);

        expect(body.msg).toBe('Invalid method.');
      });
    });
    test('/api/bookings/:id', async () => {
      const invalidMethods = ['get', 'post', 'put'];

      invalidMethods.forEach(async (method) => {
        const { body } = await request(app)[method]('/api/bookings/1').expect(405);

        expect(body.msg).toBe('Invalid method.');
      });
    });
    test('/api/properties', async () => {
      const invalidMethods = ['delete', 'patch', 'post', 'put'];

      invalidMethods.forEach(async (method) => {
        const { body } = await request(app)[method]('/api/properties').expect(405);

        expect(body.msg).toBe('Invalid method.');
      });
    });
    test('/api/properties/:id', async () => {
      const invalidMethods = ['delete', 'patch', 'post', 'put'];

      invalidMethods.forEach(async (method) => {
        const { body } = await request(app)[method]('/api/properties/1').expect(405);

        expect(body.msg).toBe('Invalid method.');
      });
    });
    test('/api/properties/:id/booking', async () => {
      const invalidMethods = ['get', 'delete', 'patch', 'put'];

      invalidMethods.forEach(async (method) => {
        const { body } = await request(app)[method]('/api/properties/1/booking').expect(405);

        expect(body.msg).toBe('Invalid method.');
      });
    });
    test('/api/properties/:id/reviews', async () => {
      const invalidMethods = ['delete', 'patch', 'put'];

      invalidMethods.forEach(async (method) => {
        const { body } = await request(app)[method]('/api/properties/1/reviews').expect(405);

        expect(body.msg).toBe('Invalid method.');
      });
    });
    test('/api/properties/:id/favourite', async () => {
      const invalidMethods = ['get', 'delete', 'patch', 'put'];

      invalidMethods.forEach(async (method) => {
        const { body } = await request(app)[method]('/api/properties/1/favourite').expect(405);

        expect(body.msg).toBe('Invalid method.');
      });
    });
    test('/api/properties/:id/users/:user_id/favourite', async () => {
      const invalidMethods = ['post', 'get', 'patch', 'put'];

      invalidMethods.forEach(async (method) => {
        const { body } = await request(app)[method]('/api/properties/1/users/1/favourite').expect(405);

        expect(body.msg).toBe('Invalid method.');
      });
    });
    test('/api/properties/:id/bookings', async () => {
      const invalidMethods = ['post', 'delete', 'patch', 'put'];

      invalidMethods.forEach(async (method) => {
        const { body } = await request(app)[method]('/api/properties/1/bookings').expect(405);

        expect(body.msg).toBe('Invalid method.');
      });
    });
    test('/api/users/:id', async () => {
      const invalidMethods = ['post', 'delete', 'put'];

      invalidMethods.forEach(async (method) => {
        const { body } = await request(app)[method]('/api/users/1').expect(405);

        expect(body.msg).toBe('Invalid method.');
      });
    });
    test('/api/users/:id/bookings', async () => {
      const invalidMethods = ['post', 'delete', 'put', 'patch'];

      invalidMethods.forEach(async (method) => {
        const { body } = await request(app)[method]('/api/users/1/bookings').expect(405);

        expect(body.msg).toBe('Invalid method.');
      });
    });
  });
});
