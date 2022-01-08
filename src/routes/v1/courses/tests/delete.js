const request = require("supertest");
const app = require("@app");
const { createNewObjectId } = require("@shared/services/object-id");
const PATH = "/v1/courses";

describe("DELETE", () => {
  let courseRes, pathPrarm, teacherCookie;

  beforeEach(async () => {
    courseRes = await global.newCourse();
    pathPrarm = courseRes.body.id;
    teacherCookie = courseRes.get("Set-Cookie");
  });

  const exec = () => {
    return request(app)
      .delete(`${PATH}/${pathPrarm}`)
      .set("Cookie", teacherCookie)
      .send();
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

  it("should return 404 if course id is invalid", async () => {
    pathPrarm = "12345";
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 404 if course not exist", async () => {
    pathPrarm = createNewObjectId();
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("shuold return 403 if not course owner", async () => {
    teacherCookie = await global.getNewTeacherCookie();
    const res = await exec();
    expect(res.status).toBe(403);
  });

  it("should return 204 upon successful delete", async () => {
    const res = await exec();
    expect(res.status).toBe(204);

    // course should be removed from tag
    const tag_id = courseRes.body.tags[0].id;
    const tag_res = await request(app)
      .get(`/v1/tags/${tag_id}`)
      .send()
      .expect(200);
    expect(tag_res.body.courses.length).toEqual(0);

    // course should also be removed
    await exec().expect(404);
  });
});
