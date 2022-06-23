const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const testUser = {
  email: 'test@test.com',
  password: '123456',
};

describe('secrets routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('GET /api/v1/secrets should return a list of secrets', async () => {
    const res = await request(app).get('/api/v1/secrets');

    expect(res.status).toEqual(200);

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

    const res3 = await request(app).get('/api/v1/secrets');

    expect(res3.status).toEqual(200);
  });

  afterAll(() => {
    pool.end();
  });
});
