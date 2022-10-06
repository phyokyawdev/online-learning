const request = require("supertest");
const app = require("@app");
const PATH = "/v1/tags";

describe("POST", () => {
  let teacherCookie, name;

  beforeEach(async () => {
    teacherCookie = await global.getNewTeacherCookie();
    name = `backend`;
  });

  const exec = () => {
    return request(app).post(PATH).set("Cookie", teacherCookie).send({ name });
  };

  it("should return 401 if not logged in", async () => {
    teacherCookie = null;
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 403 if not teacher", async () => {
    teacherCookie = await global.getNewUserCookie();
    const res = await exec();
    expect(res.status).toBe(403);
  });

  it("should return 400 for invalid tag", async () => {
    name = "12345";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 with tag upon success", async () => {
    const res = await exec().expect(200);
    expect(res.body.name).toMatch(name);
  });

  it("should change uppercase name to lowercase", async () => {
    name = "Backend";
    const res = await exec().expect(200);
    expect(res.body.name).toMatch("backend");
  });
});
