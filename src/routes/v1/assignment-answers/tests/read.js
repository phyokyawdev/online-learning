const request = require("supertest");
const app = require("@app");
const PARENT_PATH = "/v1/courses";

describe("GET", () => {
  let courseRes, questionRes, pathParams, cookie, queryParams;

  beforeEach(async () => {
    courseRes = await global.newCourse();
    questionRes = await global.newQuestion(courseRes);
    // course owner cookie
    cookie = courseRes.get("Set-Cookie");
  });

  const exec = () => {
    return request(app)
      .get(
        `${PARENT_PATH}/${courseRes.body.id}/assignment-questions/${questionRes.body.id}/assignment-answers/${pathParams}`
      )
      .set("Cookie", cookie)
      .query(queryParams)
      .send();
  };

  describe("All", () => {
    beforeEach(() => {
      pathParams = "";
      queryParams = {};
    });

    it("should return 403 if not course owner or already submitted user", async () => {
      // not answer submitted student
      const student_res = await global.newStudent(courseRes);
      const enroll_user_res = await global.enrollNewUser(student_res);
      cookie = enroll_user_res.get("Set-Cookie");

      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return 200 if already submitted user", async () => {
      const answered_res = await global.newAnswer(questionRes);
      cookie = answered_res.get("Set-Cookie");

      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return 200 if course owner", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return 10 answers without query params", async () => {
      for (let i = 0; i < 11; i++) {
        await global.newAnswer(questionRes);
      }
      const { body } = await exec().expect(200);
      expect(body.length).toEqual(10);
    });

    it("should return defined no of answers with offset and limit", async () => {
      for (let i = 0; i < 6; i++) {
        await global.newAnswer(questionRes);
      }
      queryParams = { offset: 0, limit: 5 };
      const { body } = await exec().expect(200);
      expect(body.length).toEqual(5);
    });
  });

  describe("One", () => {
    let answerRes;

    beforeEach(async () => {
      answerRes = await global.newAnswer(questionRes);
      pathParams = answerRes.body.id;
    });

    it("should return 403 if not course owner or already submitted", async () => {
      // not answer submitted student
      const student_res = await global.newStudent(courseRes);
      const enroll_user_res = await global.enrollNewUser(student_res);
      cookie = enroll_user_res.get("Set-Cookie");

      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return 404 if answer not exist", async () => {
      pathParams = "12345";
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return answer if already submitted user", async () => {
      // another submitted user
      const answered_res = await global.newAnswer(questionRes);
      cookie = answered_res.get("Set-Cookie");

      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(answerRes.body);
    });

    it("should return answer if course owner", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(answerRes.body);
    });
  });
});
