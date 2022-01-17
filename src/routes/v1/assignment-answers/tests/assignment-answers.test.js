const request = require("supertest");
const app = require("@app");
const PARENT_PATH = "/v1/courses";

describe("/v1/courses/{courseId}/assignment-questions/{questionId}/assignment-answers", () => {
  describe("test assignment-answer router", () => {
    let courseId, questionId, userCookie;

    beforeEach(async () => {
      const course_res = await global.newCourse();
      const question_res = await global.newQuestion(course_res);
      courseId = course_res.body.id;
      questionId = question_res.body.id;
      userCookie = await global.getNewUserCookie();
    });

    const exec = () => {
      return request(app)
        .get(
          `${PARENT_PATH}/${courseId}/assignment-questions/${questionId}/assignment-answers`
        )
        .set("Cookie", userCookie)
        .send();
    };

    it("should return 401 if not logged in", async () => {
      userCookie = null;
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 404 if course not exist", async () => {
      courseId = "12345";
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if assignment-question not exist", async () => {
      questionId = "12345";
      const res = await exec();
      expect(res.status).toBe(404);
    });
  });

  require("./create");
  require("./read");
  require("./update");
});
