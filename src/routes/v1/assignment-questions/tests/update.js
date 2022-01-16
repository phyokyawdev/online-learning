const request = require("supertest");
const app = require("@app");
const PARENT_PATH = "/v1/courses";

describe("PUT", () => {
  let courseId, questionId, courseOwnerCookie, question;

  beforeEach(async () => {
    const course_res = await global.newCourse();
    const question_res = await global.newQuestion(course_res);

    courseId = course_res.body.id;
    questionId = question_res.body.id;
    courseOwnerCookie = course_res.get("Set-Cookie");
    question = {
      index: 2,
      title: "Updated assignment 2",
      content: "Updated assignment question for number 2",
    };
  });

  const exec = () => {
    return request(app)
      .put(`${PARENT_PATH}/${courseId}/assignment-questions/${questionId}`)
      .set("Cookie", courseOwnerCookie)
      .send(question);
  };

  it("should return 403 if not course owner", async () => {
    courseOwnerCookie = await global.getNewUserCookie();
    const res = await exec();
    expect(res.status).toBe(403);
  });

  it("should return 404 if question not exist", async () => {
    questionId = "12345";
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 400 if invalid data", async () => {
    question = {
      index: "two",
      title: " ",
      content: " ",
    };
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 with question upon success", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
    expect(res.body.title).toMatch(question.title);
  });
});
