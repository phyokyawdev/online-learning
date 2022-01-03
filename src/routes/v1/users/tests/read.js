const request = require("supertest");
const app = require("@app");
const PATH = "/v1/users";

describe("GET", () => {
  let adminCookie, queryPayload, paramPayload;

  beforeEach(async () => {
    adminCookie = await global.getAdminCookie();
    queryPayload = {};
    paramPayload = "";
  });

  const exec = () => {
    return request(app)
      .get(`${PATH}/${paramPayload}`)
      .query()
      .set("Cookie", adminCookie)
      .send();
  };

  it("should return 401 if not logged in", async () => {
    adminCookie = null;
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 403 if not admin", async () => {
    adminCookie = await global.getBasicCookie();
    const res = await exec();
    expect(res.status).toBe(403);
  });

  it("should return 10 users without request query on success", async () => {
    // create 12 dummy users
    for (let i = 0; i < 12; i++) {
      await global.newUserSignup();
    }
    const res = await exec();
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(10);
  });

  it("should return defined users count with request query on success", async () => {
    // create 12 dummy users
    for (let i = 0; i < 12; i++) {
      await global.newUserSignup();
    }
    queryPayload = { offset: 0, limit: 11 };
    const res = await exec();
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(11);
  });

  it("should return 404 for specific user request with invalid param payload", async () => {
    paramPayload = "1234";
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return specific user upon request with valid param payload", async () => {
    const { body } = await global.userSignup();
    paramPayload = body.id;

    const res = await exec();
    expect(res.status).toBe(200);
    expect(res.body.username).toEqual(body.username);
  });
});
