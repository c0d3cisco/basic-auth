

const { app } = require('../src/server');
const supertest = require('supertest');
const { sequelizeDatabase } = require('../src/auth/models');

const appWithSupertest = supertest(app);

// Before and after hooks

beforeAll(async () => {
  await sequelizeDatabase.sync();
});

afterAll(async () => {
  await sequelizeDatabase.drop();
});

// Test suite for server routes

describe('Server Test Suite', () => {
  test('GET /test should return "Route not found"', async () => {
    const response = await appWithSupertest.get('/test');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Route not found');
  });

  test('POST / should return "Method not found"', async () => {
    const response = await appWithSupertest.post('/');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Method not found');
  });
});

// Test suite for authentication routes

describe('Auth Routes', () => {
  let testUser; // Variable to store the created user details

  beforeEach(async () => {
    // Clean up previous test data and create a new user before each test
    await sequelizeDatabase.query('DELETE FROM Users'); // Clear user table
    testUser = {
      username: 'Tester',
      password: 'pass',
    };
    await appWithSupertest.post('/signup').send(testUser);
  });

  test('POST /signup should create a new user', async () => {
    const response = await appWithSupertest.post('/signup').send({
      username: 'NewUser',
      password: 'newpass',
    });

    expect(response.status).toBe(201);
    expect(response.body.username).toBe('NewUser');
  });

  test('POST /signup should return an error for duplicate signup', async () => {
    const response = await appWithSupertest.post('/signup').send(testUser);

    expect(response.status).toBe(403);
  });

  test('POST /signin should successfully authenticate a user', async () => {
    const response = await appWithSupertest
      .post('/signin')
      .set('Authorization', `Basic ${Buffer.from(`${testUser.username}:${testUser.password}`).toString('base64')}`);

    expect(response.status).toBe(200);
    expect(response).toBeTruthy();
  });

  test('POST /signin should return an error for incorrect credentials', async () => {
    const response = await appWithSupertest
      .post('/signin')
      .set('Authorization', 'Basic InvalidCredentials');

    expect(response.status).toBe(500);
    expect(response).toBeTruthy();
  });

});
