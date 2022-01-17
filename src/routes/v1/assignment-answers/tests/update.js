const request = require("supertest");
const app = require("@app");
const PARENT_PATH = "/v1/courses";

describe("PATCH", () => {
  // owner give score to assignment answer
  let courseId, questionId, answerId, courseOwnerCookie, payload;

  beforeEach(async () => {
    const course_res = await global.newCourse();
    const question_res = await global.newQuestion(course_res);
    const answer_res = await global.newAnswer(question_res);

    courseId = course_res.body.id;
    questionId = question_res.body.id;
    answerId = answer_res.body.id;
    courseOwnerCookie = course_res.get("Set-Cookie");
    payload = { score: 5 };
  });

  const exec = () => {
    return request(app)
      .patch(
        `${PARENT_PATH}/${courseId}/assignment-questions/${questionId}/assignment-answers/${answerId}`
      )
      .set("Cookie", courseOwnerCookie)
      .send(payload);
  };

  it("should return 403 if not course owner", async () => {
    courseOwnerCookie = await global.getNewTeacherCookie();
    const res = await exec();
    expect(res.status).toBe(403);
  });

  it("should return 404 if answer not exist", async () => {
    answerId = "12345";
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 400 if data is invalid", async () => {
    payload = { score: "two" };
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 with answer upon success", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
    expect(res.body.score).toEqual(payload.score);
  });
});
