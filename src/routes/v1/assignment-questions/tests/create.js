const request = require("supertest");
const app = require("@app");
const PARENT_PATH = "/v1/courses";

describe("POST", () => {
  let courseId, courseOwnerCookie, index, title, content;

  beforeEach(async () => {
    const course_res = await global.newCourse();
    courseId = course_res.body.id;
    courseOwnerCookie = course_res.get("Set-Cookie");
    index = 1;
    title = "Assignment question 1";
    content = "This is question for assignment number 1";
  });

  const exec = () => {
    return request(app)
      .post(`${PARENT_PATH}/${courseId}/assignment-questions`)
      .set("Cookie", courseOwnerCookie)
      .send({ index, title, content });
  };

  it("should return 403 if not course owner", async () => {
    courseOwnerCookie = await global.getNewTeacherCookie();
    const res = await exec();
    expect(res.status).toBe(403);
  });

  it("should return 400 if invalid data", async () => {
    index = "One";
    title = " ";
    content = " ";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 201 with assignment question upon success", async () => {
    const res = await exec();
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toMatch(title);
  });
});
