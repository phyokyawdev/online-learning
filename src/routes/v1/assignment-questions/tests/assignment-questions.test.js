const request = require("supertest");
const app = require("@app");
const PARENT_PATH = "/v1/courses";

describe("/v1/courses/{courseId}/assignment-questions", () => {
  describe("test assignment-questions router", () => {
    let courseId, userCookie;

    beforeEach(async () => {
      const course_res = await global.newCourse();
      courseId = course_res.body.id;
      userCookie = await global.getNewUserCookie();
    });

    const exec = () => {
      return request(app)
        .get(`${PARENT_PATH}/${courseId}/assignment-questions`)
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
  });

  require("./create");
  require("./read");
  require("./update");
  require("./delete");
});
