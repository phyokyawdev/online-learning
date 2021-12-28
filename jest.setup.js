const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("@app");

const SIGNUP_PATH = "/v1/auth/signup";

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

/**
 * global test helpers
 * ===================
 * followings are the functions that
 * will be used frequently in tests
 */

/**
 * signup request
 * @returns {Promise} - supertest response
 */
global.signup = async () => {
  const username = "signup";
  const email = "signup@test.com";
  const password = "12345678";

  const res = await request(app)
    .post(SIGNUP_PATH)
    .send({ username, email, password })
    .expect(201);

  return res;
};

/**
 * new signup request
 * @returns {Promise} - supertest response
 */
global.newSignup = async () => {
  let counter = 1;
  const username = `signup${counter}`;
  const email = `signup${counter}@test.com`;
  const password = "12345678";

  const res = await request(app)
    .post(SIGNUP_PATH)
    .send({ username, email, password })
    .expect(201);

  counter++;

  return res;
};
