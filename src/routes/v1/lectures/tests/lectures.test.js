const request = require("supertest");
const app = require("@app");
const { createNewObjectId } = require("@shared/services/object-id");
const PARENT_PATH = "/v1/courses";

describe("/v1/courses/{courseId}/lectures", () => {
  describe("test lectures router (logged in and valid course)", () => {
    let courseId, userCookie;

    beforeEach(async () => {
      courseId = await global.newCourse();
      userCookie = await global.getNewUserCookie();
    });

    const exec = () => {
      return request(app)
        .get(`${PARENT_PATH}/${courseId}/lectures`)
        .set("Cookie", userCookie)
        .send();
    };

    it("return 401 if not logged in", async () => {
      userCookie = null;
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("return 404 for invalid course id", async () => {
      courseId = "12345";
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("return 404 for not exist course", async () => {
      courseId = createNewObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });
  });

  require("./create");
  require("./read");
  require("./update");
  require("./delete");
});
