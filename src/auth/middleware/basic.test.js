'use strict';

const { sequelizeDatabase, userModelConstruct } = require('../models');
const { app } = require('../../server');

const supertest = require('supertest');
const request = supertest(app);

'use strict';

beforeAll(async () => {
  await sequelizeDatabase.sync();
});

afterAll(async () => {
  await sequelizeDatabase.drop();
});

describe('Auth router', () => {
  let token;
  it('creates a user', async () => {
    let response = await request.post('/signup').send({
      username: 'Tester',
      password: 'pass123',
    });

    expect(response.status).toEqual(201);
    expect(JSON.parse(response.text).username).toEqual('Tester');
  });
  it('allows existing user to signin', async () => {

    let response = await request.post('/signin').auth('Tester', 'pass123');

    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text).username).toEqual('Tester');

    // cannot predict exact - it is hashed.
    expect(response).toBeTruthy();

    //token appears different each time, cannot predict exact characters.
    expect(response).toBeTruthy();

  });
  it('fails with bad signin credentials', async () => {

    let response = await request.post('/signin').auth('Tester', 'badPassword');

    expect(response.status).toEqual(500);
    expect(response.text).toBeTruthy();
  });

  it('fails with bad signin credentials', async () => {

    let response = await request.get('/signin').auth('Tester', 'badPassword');

    expect(response.status).toEqual(404);
    expect(response.text).toBeTruthy();
  });

});
