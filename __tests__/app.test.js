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
});
