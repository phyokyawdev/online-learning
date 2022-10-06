const request = require("supertest");
const app = require("@app");

const PATH = "/v1/auth/signup";

describe("/signup", () => {
  let username;
  let email;
  let password;

  beforeEach(async () => {
    username = "test1";
    email = "test1@test.com";
    password = "12345678";
  });

  const exec = () => {
    return request(app).post(PATH).send({ username, email, password });
  };

  it("should returns 400 if invalid email is provided", async () => {
    email = "test";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should returns 400 if invalid password is provided", async () => {
    password = "1234";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should returns 409 if email is duplicated", async () => {
    const res = await exec();
    const res1 = await exec();
    expect(res1.status).toBe(409);
  });

  it("should returns 201 if valid input is provided", async () => {
    const res = await exec();
    expect(res.status).toBe(201);
  });

  it("should returns cookie if valid input is provided", async () => {
    const res = await exec();
    expect(res.get("Set-Cookie")).toBeDefined();
  });
});
