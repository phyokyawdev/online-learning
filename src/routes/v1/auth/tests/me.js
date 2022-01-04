const request = require("supertest");
const app = require("@app");

const PATH = "/v1/auth/me";

describe("/me", () => {
  it("should respond with detail about the current user", async () => {
    const cookie = await global.getUniqueUserCookie();
    const res = await request(app)
      .get(PATH)
      .set("Cookie", cookie)
      .send()
      .expect(200);
    expect(res.body.id).toBeDefined();
  });

  it("should respond 401 if not authenticated", async () => {
    return request(app).get(PATH).send().expect(401);
  });
});
