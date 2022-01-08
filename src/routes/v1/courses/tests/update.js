const request = require("supertest");
const app = require("@app");
const { createNewObjectId } = require("@shared/services/object-id");
const PATH = "/v1/courses";

describe("PUT", () => {
  let pathParam, teacherCookie, title, content, tags;

  beforeEach(async () => {
    const course_res = await global.newCourse();
    const tag_res = await global.newTag();

    pathParam = course_res.body.id;
    teacherCookie = course_res.get("Set-Cookie");

    title = "Java basic";
    content = "This course include exclusive contents of Java lang";
    tags = [tag_res.body.id, course_res.body.tags[0].id];
  });

  const exec = () => {
    return request(app)
      .put(`${PATH}/${pathParam}`)
      .set("Cookie", teacherCookie)
      .send({ title, content, tags });
  };

  // update all fields
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

  it("should return 404 if path id is invalid", async () => {
    pathParam = "12345";
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 400 if not valid data (title)", async () => {
    title = "";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if not valid data (tags)", async () => {
    tags = [createNewObjectId()];
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 404 if course not exist", async () => {
    pathParam = createNewObjectId();
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 403 if not course owner", async () => {
    teacherCookie = await global.getNewTeacherCookie();
    const res = await exec();
    expect(res.status).toBe(403);
  });

  it("should return 200 with updated course upon success", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
    expect(res.body.title).toMatch(title);
    expect(res.body.tags.length).toEqual(2);
  });
});
