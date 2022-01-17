const request = require("supertest");
const app = require("@app");
const PARENT_PATH = "/v1/courses";

describe("POST", () => {
  let courseRes, courseId, questionId, userCookie, content;

  beforeEach(async () => {
    courseRes = await global.newCourse();
    const question_res = await global.newQuestion(courseRes);

    const student_res = await global.newStudent(courseRes);
    const enroll_user_res = await global.enrollNewUser(student_res);

    courseId = courseRes.body.id;
    questionId = question_res.body.id;
    userCookie = enroll_user_res.get("Set-Cookie");
    content = `This is answer to assignment question - ${questionId}`;
  });

  const exec = () => {
    return request(app)
      .post(
        `${PARENT_PATH}/${courseId}/assignment-questions/${questionId}/assignment-answers`
      )
      .set("Cookie", userCookie)
      .send({ content });
  };

  it("should return 403 if not course student", async () => {
    // if user is course owner
    userCookie = courseRes.get("Set-Cookie");
    const res = await exec();
    expect(res.status).toBe(403);
  });

  it("should return 400 if invalid data", async () => {
    content = " ";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 201 with answer upon success", async () => {
    const res = await exec();
    expect(res.status).toBe(201);
    expect(res.body.content).toMatch(content);
  });

  it("should return 409 if already submitted", async () => {
    await exec().expect(201);
    await exec().expect(409);
  });
});
