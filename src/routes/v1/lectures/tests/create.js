const request = require("supertest");
const app = require("@app");
const PARENT_PATH = "/v1/courses";

describe("POST", () => {
  let courseId, teacherCookie, index, title, url;

  beforeEach(async () => {
    const course_res = await global.newCourse();
    courseId = course_res.body.id;
    teacherCookie = course_res.get("Set-Cookie");
    index = 1;
    title = "setup node js";
    url = "https://cloudstorage.com/resource";
  });

  const exec = () => {
    return request(app)
      .post(`${PARENT_PATH}/${courseId}/lectures`)
      .set("Cookie", teacherCookie)
      .send({ index, title, url });
  };

  it("return 403 if not course owner(also teacher)", async () => {
    teacherCookie = await global.getNewTeacherCookie();
    const res = await exec();
    expect(res.status).toBe(403);
  });

  it("return 400 for invalid lecture", async () => {
    index = "sth";
    title = " ";
    url = " ";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("return 201 with lecture upon success", async () => {
    const res = await exec();
    expect(res.status).toBe(201);
    expect(res.body.index).toEqual(index);
    expect(res.body.title).toMatch(title);
  });
});
