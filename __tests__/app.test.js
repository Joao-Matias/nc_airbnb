const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');

afterAll(() => {
  db.end();
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

    test('>>>UNSURE<<< about sad paths with this endpoint & how to order the test', () => {});
  });

  describe(' GET /api/properties/:id', () => {
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
    test('valid property ID by non-existent responds with 404 and msg', async () => {
      const { body } = await request(app).get('/api/properties/999?user_id=100').expect(404);

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
});
