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

    test('>>>UNSURE<<< how to order the test', () => {});
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

      const { body } = await request(app).post('/api/properties/1/reviews').send(newReview).expect(400);

      expect(body.msg).toBe('Bad request.');
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
});
