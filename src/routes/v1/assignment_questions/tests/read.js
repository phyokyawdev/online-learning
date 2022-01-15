const request = require("supertest");
const app = require("@app");
const PARENT_PATH = "/v1/courses";

describe("GET", () => {
  let courseRes, courseId, questionId, courseOwnerCookie;

  beforeEach(async () => {
    courseRes = await global.newCourse();
    courseId = courseRes.body.id;
    courseOwnerCookie = courseRes.get("Set-Cookie");
  });

  const exec = () => {
    return request(app)
      .get(`${PARENT_PATH}/${courseId}/assignment_questions/${questionId}`)
      .set("Cookie", courseOwnerCookie)
      .send();
  };

  describe("All", () => {
    beforeEach(async () => {
      await global.newQuestion(courseRes);
      questionId = "";
    });

    it("should return 403 if not course student or owner", async () => {
      courseOwnerCookie = await global.getNewUserCookie();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return questions if course student", async () => {
      const student_res = await global.newStudent(courseRes);
      courseOwnerCookie = student_res.get("Set-Cookie");
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return questions if course owner", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return all assignment questions of course", async () => {
      // another course and question
      const new_course_res = await global.newCourse();
      await global.newQuestion(new_course_res);

      const question = await global.newQuestion(courseRes);
      const { body } = await exec().expect(200);
      expect(body.length).toEqual(2);
      expect(body[1]).toMatchObject(question.body);
    });
  });

  describe("One", () => {
    let questionRes;

    beforeEach(async () => {
      questionRes = await global.newQuestion(courseRes);
      questionId = questionRes.body.id;
    });

    it("should return 403 if not course student or owner", async () => {
      courseOwnerCookie = await global.getNewUserCookie();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return 404 if question not exist", async () => {
      questionId = "12345";
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return question if course student", async () => {
      const student_res = await global.newStudent(courseRes);
      courseOwnerCookie = student_res.get("Set-Cookie");
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return question if course owner", async () => {
      const { body } = await exec().expect(200);
      expect(body).toMatchObject(questionRes.body);
    });
  });
});
