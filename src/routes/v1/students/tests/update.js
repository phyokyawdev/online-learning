const request = require("supertest");
const app = require("@app");
const { createNewObjectId } = require("@shared/services/object-id");
const PARENT_PATH = "/v1/courses";

describe("PATCH", () => {
  let courseRes, studentRes, cookie, studentId, payload;

  beforeEach(async () => {
    courseRes = await global.newCourse();
    studentRes = await global.newStudent(courseRes);
  });

  const exec = () => {
    return request(app)
      .patch(`${PARENT_PATH}/${courseRes.body.id}/students/${studentId}`)
      .set("Cookie", cookie)
      .send(payload);
  };

  describe("By Course Owner", () => {
    beforeEach(async () => {
      cookie = courseRes.get("Set-Cookie");
      studentId = studentRes.body.id;
      payload = {
        lecture_access_deadline: "2022-03-10",
        completed: true,
        credit: 5,
      };
    });

    it("return 403 if not course owner", async () => {
      cookie = await global.getNewUserCookie();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return 404 if invalid student id", async () => {
      studentId = "12345";
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if student not exist", async () => {
      studentId = createNewObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 400 if invalid student data", async () => {
      payload = {
        lecture_access_deadline: " ",
        completed: "yes",
        credit: "five",
      };
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 200 with student upon successful update", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.credit).toEqual(payload.credit);
    });
  });

  describe("By User - enroll", () => {
    let userRes;

    beforeEach(async () => {
      userRes = await global.signupNewUser();
      cookie = userRes.get("Set-Cookie");
      studentId = "";
      payload = { token: studentRes.body.token };
    });

    it("should return 404 if token is not exist", async () => {
      payload = { token: "SOME-TOKEN" };
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 200 with student upon successful enrollment", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.user).toMatch(userRes.body.id);
    });

    it("should return 409 if token is already used for enrollment", async () => {
      const res = await exec().expect(200);
      const resp = await exec();
      expect(resp.status).toBe(409);
    });
  });
});
