const request = require("supertest");
const app = require("@app");
const { createNewObjectId } = require("@shared/services/object-id");
const PARENT_PATH = "/v1/courses";

describe("GET", () => {
  let courseRes, lectureRes, courseOwnerCookie, queryParams, lectureId;

  beforeEach(async () => {
    courseRes = await global.newCourse();
    lectureRes = await global.newLecture(courseRes);
    courseOwnerCookie = courseRes.get("Set-Cookie");
  });

  const exec = () => {
    return request(app)
      .get(`${PARENT_PATH}/${courseRes.body.id}/lectures/${lectureId}`)
      .set("Cookie", courseOwnerCookie)
      .query(queryParams)
      .send();
  };

  describe("All", () => {
    beforeEach(async () => {
      lectureId = "";
      queryParams = {};
    });

    it("should return 403 if not accessible student or owner", async () => {
      courseOwnerCookie = await global.getNewTeacherCookie();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return lectures if accessible student", async () => {
      const student_res = await global.newStudent(courseRes);
      courseOwnerCookie = student_res.get("Set-Cookie");
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return lectures if course owner", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      // should return lecture of current course
      expect(res.body[0].course).toMatch(courseRes.body.id);
    });

    it("should return 10 lectures without request query", async () => {
      for (let i = 0; i < 10; i++) {
        await global.newLecture(courseRes);
      }
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.length).toEqual(10);
    });

    it("should return defined no of lectures with offset and limit", async () => {
      for (let i = 0; i < 5; i++) {
        await global.newLecture(courseRes);
      }
      queryParams = { offset: 0, limit: 6 };
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.length).toEqual(6);
    });
  });

  describe("One", () => {
    beforeEach(() => {
      lectureId = lectureRes.body.id;
    });

    it("should return 403 if not accessible student or owner", async () => {
      courseOwnerCookie = await global.getNewUserCookie();
      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return 404 if lecture is invalid", async () => {
      lectureId = "12345";
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if lecture not exist", async () => {
      lectureId = createNewObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return lecture if accessible student", async () => {
      const student_res = await global.newStudent(courseRes);
      courseOwnerCookie = student_res.get("Set-Cookie");
      const res = await exec();
      expect(res.status).toBe(200);
    });

    it("should return lecture if course owner", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.title).toBe(lectureRes.body.title);
      // should return lecture of current course
      expect(res.body.course).toMatch(courseRes.body.id);
    });
  });
});
