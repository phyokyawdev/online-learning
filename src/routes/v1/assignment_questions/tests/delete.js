const request = require("supertest");
const app = require("@app");
const PARENT_PATH = "/v1/courses";

describe("DELETE", () => {
  let courseId, questionId, courseOwnerCookie;

  beforeEach(async () => {
    const course_res = await global.newCourse();
    const question_res = await global.newQuestion(course_res);

    courseId = course_res.body.id;
    questionId = question_res.body.id;
    courseOwnerCookie = course_res.get("Set-Cookie");
  });

  const exec = () => {
    return request(app)
      .delete(`${PARENT_PATH}/${courseId}/assignment_questions/${questionId}`)
      .set("Cookie", courseOwnerCookie)
      .send();
  };

  it("should return 403 if not course owner", async () => {
    courseOwnerCookie = await global.getNewTeacherCookie();
    const res = await exec();
    expect(res.status).toBe(403);
  });

  it("should return 404 if question not exist", async () => {
    questionId = "12345";
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 204 upon successful delete", async () => {
    await exec().expect(204);

    await exec().expect(404);
  });
});
