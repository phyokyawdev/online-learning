const request = require("supertest");
const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("@app");
const { User } = require("@models/user");

const SIGNUP_PATH = "/v1/auth/signup";
const LOGIN_PATH = "/v1/auth/login";
let mongo;

jest.setTimeout(30000);

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

/** Supertest Response */

/**
 * login request
 * @param {{username: string, password: string}} payload
 * @returns {Promise} supertest response
 */
async function login(payload) {
  const res = await request(app).post(LOGIN_PATH).send(payload).expect(200);
  return res;
}

/**
 * signup request
 * @param {{username: string, email: string, password: string}} user
 * @returns {Promise} supertest response
 */
async function signup(user) {
  const res = await request(app).post(SIGNUP_PATH).send(user).expect(201);
  return res;
}

/**
 * new user signup request
 * @returns {Promise} - supertest response
 */
async function uniqueUserSignup() {
  const id = nanoid();
  const user = {
    username: `tester-${id}`,
    email: `test.${id}@test.com`,
    password: "12345678",
  };
  const res = await signup(user);
  return res;
}

/** return cookie */
async function getUniqueUserCookie() {
  const cookie = (await uniqueUserSignup()).get("Set-Cookie");
  return cookie;
}

async function getUniqueAdminCookie() {
  // signup
  const { body } = await uniqueUserSignup();
  // update role to admin
  await User.findOneAndUpdate({ _id: body.id }, { role: "admin" });
  // login
  const res = await login({ username: body.username, password: "12345678" });

  const cookie = res.get("Set-Cookie");
  return cookie;
}

global.uniqueUserSignup = uniqueUserSignup;
global.getUniqueUserCookie = getUniqueUserCookie;
global.getUniqueAdminCookie = getUniqueAdminCookie;
