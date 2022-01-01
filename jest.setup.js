const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("@app");
const { User } = require("@models/user");

const SIGNUP_PATH = "/v1/auth/signup";
const LOGIN_PATH = "/v1/auth/login";

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

/** Supertest Response */

/**
 * login request
 * @param {{username: string, password: string}} payload
 * @returns {Promise} supertest response
 */
async function login(payload) {
  const res = await request(app).post(LOGIN_PATH).send(payload).expect(201);
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
 * user signup request
 * @returns {Promise} supertest response
 */
async function userSignup() {
  let user = {
    username: "tester",
    email: "test@test.com",
    password: "12345678",
  };
  const res = await signup(user);
  return res;
}

/**
 * new user signup request
 * @returns {Promise} - supertest response
 */
async function newUserSignup() {
  let counter = 1;
  const user = {
    username: `tester${counter}`,
    email: `test${counter}@test.com`,
    password: "12345678",
  };
  const res = await signup(user);
  counter++;
  return res;
}

/** Auth Token */
async function getBasicCookie() {
  const token = (await userSignup()).get("Set-Cookie");
  return token;
}

async function getAdminCookie() {
  const { body } = await newUserSignup();

  const user = await User.findById(body.id);
  if (!user) throw new Error("user not exist");
  user.updateToAdminRole();
  user.save();

  const res = await login({ username: body.username, password: "12345678" });

  const token = res.get("Set-Cookie");
  return token;
}

global.userSignup = userSignup;
global.newUserSignup = newUserSignup;
global.getBasicCookie = getBasicCookie;
global.getAdminCookie = getAdminCookie;
