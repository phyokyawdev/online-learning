const request = require("supertest");
const app = require("@app");
const { createNewObjectId } = require("@shared/services/object-id");
const PARENT_PATH = "/v1/courses";

describe("DELETE", () => {
  let courseId, lectureId, courseOwnerCookie;

  beforeEach(async () => {
    const course_res = await global.newCourse();
    const lecture_res = await global.newLecture(course_res);

    courseId = course_res.body.id;
    lectureId = lecture_res.body.id;
    courseOwnerCookie = course_res.get("Set-Cookie");
  });

  const exec = () => {
    return request(app)
      .delete(`${PARENT_PATH}/${courseId}/lectures/${lectureId}`)
      .set("Cookie", courseOwnerCookie)
      .send();
  };

  it("should return 403 if not course owner (also own lecture)", async () => {
    courseOwnerCookie = await global.getNewTeacherCookie();
    const res = await exec();
    expect(res.status).toBe(403);
  });

  it("should return 404 if invalid lecture id", async () => {
    lectureId = "12345";
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 404 if lecture not exist", async () => {
    lectureId = createNewObjectId();
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 204 upon successful delete", async () => {
    const res = await exec();
    expect(res.status).toBe(204);
  });
});
