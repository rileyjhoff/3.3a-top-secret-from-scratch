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
    const agent = request.agent(app);
    const res1 = await agent.get('/api/v1/secrets');

    expect(res1.status).toEqual(401);

    const res2 = await agent.post('/api/v1/users').send(testUser);

    expect(res2.status).toEqual(200);
    expect(res2.body).toEqual({
      id: expect.any(Number),
      email: testUser.email,
    });

    const res3 = await agent.post('/api/v1/users/sessions').send(testUser);

    expect(res3.status).toEqual(200);
    expect(res3.body.message).toEqual('Signed in successfully');

    const res4 = await agent.get('/api/v1/secrets');

    expect(res4.status).toEqual(200);
    expect(res4.body.title).toEqual('this is');
    expect(res4.body.description).toEqual('a test');
  });

  afterAll(() => {
    pool.end();
  });
});
