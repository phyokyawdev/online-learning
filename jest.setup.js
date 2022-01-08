const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { nanoid, customAlphabet } = require("nanoid/non-secure");
const { lowercase } = require("nanoid-dictionary");

const app = require("@app");
const { User } = require("@models/user");
const lowerString = customAlphabet(lowercase, 10);

const SIGNUP_PATH = "/v1/auth/signup";
const LOGIN_PATH = "/v1/auth/login";
const TAGS_PATH = "/v1/tags";
const COURSES_PATH = "/v1/courses";
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

/**
 * Local Test Helpers
 * ==================
 * The following functions are used locally in this file.
 */

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
 * update role of existing user
 * @param {{ id: string, username: string }} payload - existing user
 * @param {string} role - role to update
 * @returns {Promise} supertest response
 */
async function updateUserRole(payload, role) {
  await User.findByIdAndUpdate(payload.id, { role });
  const res = await login({ username: payload.username, password: "12345678" });
  return res;
}

/**
 * Global Test Helpers
 * ===================
 * The following functions will be added to jest global namespace.
 */

/**
 * Functions that will return Supertest Response
 * =============================================
 * The follwings are functions that will create specific
 * entities and return supertest response of them.
 */

async function signupNewUser() {
  const id = nanoid();
  const user = {
    username: `tester-${id}`,
    email: `test.${id}@test.com`,
    password: "12345678",
  };
  const res = await signup(user);
  return res;
}

async function newTag() {
  const teacherCookie = await getNewTeacherCookie();
  const name = lowerString();
  const res = await request(app)
    .post(TAGS_PATH)
    .set("Cookie", teacherCookie)
    .send({ name })
    .expect(201);
  res.headers["set-cookie"] = teacherCookie;
  return res;
}

async function newCourse() {
  const teacherCookie = await getNewTeacherCookie();
  const { body } = await newTag();
  const course = {
    title: "Node js basic",
    content: "This course include various information about Node js",
    tags: [body.id],
  };
  const res = await request(app)
    .post(COURSES_PATH)
    .set("Cookie", teacherCookie)
    .send(course)
    .expect(201);
  res.headers["set-cookie"] = teacherCookie;
  return res;
}

/**
 * Functions that will return cookie
 * =================================
 * The followings are functions that will
 * return cookies for specific user roles.
 */

async function getNewUserCookie() {
  const cookie = (await signupNewUser()).get("Set-Cookie");
  return cookie;
}

async function getNewAdminCookie() {
  const { body } = await signupNewUser();
  const res = await updateUserRole(body, "admin");
  const cookie = res.get("Set-Cookie");
  return cookie;
}

async function getNewTeacherCookie() {
  const { body } = await signupNewUser();
  const res = await updateUserRole(body, "teacher");
  const cookie = res.get("Set-Cookie");
  return cookie;
}

global.signupNewUser = signupNewUser;
global.getNewUserCookie = getNewUserCookie;
global.getNewAdminCookie = getNewAdminCookie;
global.getNewTeacherCookie = getNewTeacherCookie;
global.newTag = newTag;
global.newCourse = newCourse;
