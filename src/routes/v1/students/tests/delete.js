const request = require("supertest");
const app = require("@app");
const { createNewObjectId } = require("@shared/services/object-id");
const PARENT_PATH = "/v1/courses";

describe("DELETE", () => {
  let courseRes, courseOwnerCookie, studentId;

  beforeEach(async () => {
    courseRes = await global.newCourse();
    const student_res = await global.newStudent(courseRes);
    courseOwnerCookie = courseRes.get("Set-Cookie");
    studentId = student_res.body.id;
  });

  const exec = () => {
    return request(app)
      .delete(`${PARENT_PATH}/${courseRes.body.id}/students/${studentId}`)
      .set("Cookie", courseOwnerCookie)
      .send();
  };

  it("return 403 if not course owner", async () => {
    courseOwnerCookie = await global.getNewUserCookie();
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

  it("should return 204 upon successful delete", async () => {
    const res = await exec();
    expect(res.status).toBe(204);
  });
});
