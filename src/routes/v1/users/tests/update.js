const request = require("supertest");
const mongoose = require("mongoose");
const app = require("@app");
const PATH = "/v1/users";

describe("PATCH", () => {
  let adminCookie, user_id, payload;

  beforeEach(async () => {
    adminCookie = await global.getNewAdminCookie();
    user_id = (await global.signupNewUser()).body.id;
    payload = { role: "teacher" };
  });

  const exec = () => {
    return request(app)
      .patch(`${PATH}/${user_id}`)
      .set("Cookie", adminCookie)
      .send(payload);
  };

  it("should return 401 if not logged in", async () => {
    adminCookie = null;
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 403 if not admin", async () => {
    adminCookie = await global.getNewUserCookie();
    const res = await exec();
    expect(res.status).toBe(403);
  });

  it("should return 404 if user not exist", async () => {
    user_id = new mongoose.Types.ObjectId();
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 400 for invalid data", async () => {
    payload = { role: "advanced" };
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return updated user upon valid request", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
    expect(res.body.role).toEqual("teacher");
  });
});
