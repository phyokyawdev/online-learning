const request = require("supertest");
const app = require("@app");
const { createNewObjectId } = require("@shared/services/object-id");
const PARENT_PATH = "/v1/courses";

describe("GET", () => {
  let courseRes, courseOwnerCookie, anotherCourseRes, studentId, queryParams;

  beforeEach(async () => {
    courseRes = await global.newCourse();
    anotherCourseRes = await global.newCourse();
    courseOwnerCookie = courseRes.get("Set-Cookie");
  });

  const exec = () => {
    return request(app)
      .get(`${PARENT_PATH}/${courseRes.body.id}/students/${studentId}`)
      .set("Cookie", courseOwnerCookie)
      .query(queryParams)
      .send();
  };

  describe("All", () => {
    beforeEach(async () => {
      studentId = "";
      queryParams = {};
    });

    it("should return students of current course", async () => {
      await global.newStudent(courseRes);
      await global.newStudent(anotherCourseRes);

      const { body } = await exec().expect(200);
      expect(body.length).toEqual(1);
      expect(body[0].course).toMatch(courseRes.body.id);
    });

    it("should return 10 students without request query", async () => {
      for (let i = 0; i < 10; i++) {
        await global.newStudent(courseRes);
      }
      const { body } = await exec().expect(200);
      expect(body.length).toEqual(10);
    });

    it("should return defined no of students with offset and limit", async () => {
      for (let i = 0; i < 6; i++) {
        await global.newStudent(courseRes);
      }
      queryParams = { offset: 0, limit: 5 };
      const { body } = await exec().expect(200);
      expect(body.length).toEqual(5);
    });

    it("should return list of unused token", async () => {
      await global.newStudent(courseRes);
      await global.newStudent(courseRes);

      queryParams = { enrolled: false };
      const { body } = await exec().expect(200);
      expect(body.length).toEqual(2);
      expect(body[0].user).toBeUndefined();
    });
  });

  describe("One", () => {
    let studentRes;

    beforeEach(async () => {
      studentRes = await global.newStudent(courseRes);
      studentId = studentRes.body.id;
    });

    it("should return 404 for invalid id", async () => {
      studentId = "12345";
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if student not exist", async () => {
      studentId = createNewObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 403 if not owner or student himself", async () => {
      courseOwnerCookie = await global.getNewUserCookie();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return 200 with student with course owner cookie", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.token).toMatch(studentRes.body.token);
    });

    it("should return 200 with student with student himself cookie", async () => {
      const userCookie = await global.getNewUserCookie();

      // enroll user
      await request(app)
        .patch(`${PARENT_PATH}/${courseRes.body.id}/students`)
        .set("Cookie", userCookie)
        .send({ token: studentRes.body.token })
        .expect(200);

      courseOwnerCookie = userCookie;
      const res = await exec();
      expect(res.status).toBe(200);
    });
  });
});
