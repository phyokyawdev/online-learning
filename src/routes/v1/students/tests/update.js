const request = require("supertest");
const app = require("@app");
const { createNewObjectId } = require("@shared/services/object-id");
const PARENT_PATH = "/v1/courses";

describe("PUT", () => {
  let courseRes, studentRes, cookie, studentId, student;

  beforeEach(async () => {
    courseRes = await global.newCourse();
    studentRes = await global.newStudent(courseRes);

    cookie = courseRes.get("Set-Cookie");
    studentId = studentRes.body.id;
    student = {
      lecture_access_deadline: "2022-03-10",
      completed: true,
      credit: 5,
    };
  });

  const exec = () => {
    return request(app)
      .patch(`${PARENT_PATH}/${courseRes.body.id}/students/${studentId}`)
      .set("Cookie", cookie)
      .send(student);
  };

  // update from course owner (deadline, completed, credit)
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
    student = {
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
    expect(res.body.credit).toEqual(student.credit);
  });

  // update from user (enroll)
  it("should return 409 if token is invalid for enrollment", async () => {
    cookie = await global.getNewUserCookie();
    studentId = "";
    student = { token: "SOME-TOKEN" };
    const res = await exec();
    expect(res.status).toBe(409);
  });

  it("should return 200 with student upon successful enrollment", async () => {
    const user_res = await global.signupNewUser();
    cookie = user_res.get("Set-Cookie");
    studentId = "";
    student = { token: studentRes.body.token };

    const res = await exec();
    expect(res.status).toBe(200);
    expect(res.body.user).toMatch(user_res.body.id);
  });

  it("should return 409 if token is already used for enrollment", async () => {
    const user_res = await global.signupNewUser();
    cookie = user_res.get("Set-Cookie");
    studentId = "";
    student = { token: studentRes.body.token };

    const res = await exec().expect(200);
    const resp = await exec();
    expect(resp.status).toBe(409);
  });
});
