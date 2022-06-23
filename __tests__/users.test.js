const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const testUser = {
  email: 'test@test.com',
  password: '123456',
};

describe('users routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('POST /api/v1/users should create a user', async () => {
    const res = await request(app).post('/api/v1/users').send(testUser);

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({
      id: expect.any(Number),
      email: testUser.email,
    });
  });

  it('POST /api/v1/users/sessions should log in a user', async () => {
    const res1 = await request(app).post('/api/v1/users').send(testUser);

    expect(res1.status).toEqual(200);
    expect(res1.body).toEqual({
      id: expect.any(Number),
      email: testUser.email,
    });

    const res2 = await request(app)
      .post('/api/v1/users/sessions')
      .send(testUser);

    expect(res2.status).toEqual(200);
    expect(res2.body.message).toEqual('Signed in successfully');
  });

  it('DELETE /api/v1/users/sessions should log out a user', async () => {
    const res1 = await request(app).post('/api/v1/users').send(testUser);

    expect(res1.status).toEqual(200);
    expect(res1.body).toEqual({
      id: expect.any(Number),
      email: testUser.email,
    });

    const res2 = await request(app)
      .post('/api/v1/users/sessions')
      .send(testUser);

    expect(res2.status).toEqual(200);
    expect(res2.body.message).toEqual('Signed in successfully');

    const res3 = await request(app).delete('/api/v1/users/sessions');

    expect(res3.status).toEqual(200);
    expect(res3.body.message).toEqual('Logged out successfully');
  });

  afterAll(() => {
    pool.end();
  });
});
