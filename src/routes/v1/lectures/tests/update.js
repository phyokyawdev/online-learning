const request = require("supertest");
const app = require("@app");
const { createNewObjectId } = require("@shared/services/object-id");
const PARENT_PATH = "/v1/courses";

describe("PUT", () => {
  let courseId, lectureId, courseOwnerCookie, lecture;

  beforeEach(async () => {
    const course_res = await global.newCourse();
    const lecture_res = await global.newLecture(course_res);

    courseId = course_res.body.id;
    lectureId = lecture_res.body.id;
    courseOwnerCookie = course_res.get("Set-Cookie");

    lecture = {
      index: 3,
      title: "java setup",
      url: "https://cloudstorage.com/resource/java/3",
    };
  });

  const exec = () => {
    return request(app)
      .put(`${PARENT_PATH}/${courseId}/lectures/${lectureId}`)
      .set("Cookie", courseOwnerCookie)
      .send(lecture);
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

  it("should return 400 if invalid lecture data", async () => {
    lecture = {
      index: " ",
      title: " ",
      url: "https:// ",
    };
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 with lecture upon successful update", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
    expect(res.body.index).toEqual(lecture.index);
    expect(res.body.title).toMatch(lecture.title);
  });
});
