const request = require("supertest");
const app = require("@app");
const { createNewObjectId } = require("@shared/services/object-id");
const PATH = "/v1/courses";

describe("POST", () => {
  let teacherCookie, title, content, tags;

  beforeEach(async () => {
    teacherCookie = await global.getNewTeacherCookie();
    const { body } = await global.newTag();

    title = "Node js basic";
    content = "This course include various information about Node js";
    tags = [body.id];
  });

  const exec = () => {
    return request(app)
      .post(PATH)
      .set("Cookie", teacherCookie)
      .send({ title, content, tags });
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

  it("should return 400 if not valid data", async () => {
    tags = [];
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 for not existing tags", async () => {
    tags = [createNewObjectId()];
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 201 with course upon success", async () => {
    // should prune duplicate tags
    const { body } = await global.newTag();
    tags.push(body.id);
    tags.push(body.id);

    const course_res = await exec();
    expect(course_res.status).toBe(201);
    expect(course_res.body.title).toMatch(title);
    expect(course_res.body.tags.length).toEqual(2);

    // should add course to tags
    const tag_res = await request(app)
      .get(`/v1/tags/${body.id}`)
      .send()
      .expect(200);
    expect(tag_res.body.courses).toContain(course_res.body.id);
  });
});
