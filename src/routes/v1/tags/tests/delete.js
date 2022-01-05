const request = require("supertest");
const app = require("@app");
const PATH = "/v1/tags";

describe("DELETE", () => {
  let adminCookie, pathParams, tag;

  beforeEach(async () => {
    tag = (await global.newTag()).body;
    adminCookie = await global.getNewAdminCookie();
    pathParams = tag.id;
  });

  const exec = () => {
    return request(app)
      .delete(`${PATH}/${pathParams}`)
      .set("Cookie", adminCookie)
      .send();
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

  it("should return 404 if tag not exist", async () => {
    pathParams = "123456";
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 204 upon successful delete", async () => {
    const res = await exec();
    expect(res.status).toBe(204);
  });
});
