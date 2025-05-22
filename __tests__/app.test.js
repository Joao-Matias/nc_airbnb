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

  describe('GET /api/users', () => {
    test('respond with a status of 200 and an array', async () => {
      const { body } = await request(app).get('/api/users/1').expect(200);

      console.log(body);
      expect(Array.isArray(body.user)).toBe(true);
    });

    test('respond with the following properties - user_id,first_name,surname,email,phone_number,avatar,created_at', async () => {
      const { body } = await request(app).get('/api/users/1');

      expect(body.user.length > 0).toBe(true);

      body.user.forEach((user) => {
        expect(user.hasOwnProperty('user_id')).toBe(true);
        expect(user.hasOwnProperty('first_name')).toBe(true);
        expect(user.hasOwnProperty('surname')).toBe(true);
        expect(user.hasOwnProperty('email')).toBe(true);
        expect(user.hasOwnProperty('phone_number')).toBe(true);
        expect(user.hasOwnProperty('avatar')).toBe(true);
        expect(user.hasOwnProperty('created_at')).toBe(true);
      });
    });
  });
});
