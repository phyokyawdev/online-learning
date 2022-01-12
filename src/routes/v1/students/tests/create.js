const request = require("supertest");
const app = require("@app");
const PARENT_PATH = "/v1/courses";

describe("POST", () => {
  let courseId, courseOwnerCookie, token, lecture_access_deadline;

  beforeEach(async () => {
    const course_res = await global.newCourse();
    courseId = course_res.body.id;
    courseOwnerCookie = course_res.get("Set-Cookie");

    const date = new Date();
    token = "TEST-TOKEN-1";
    lecture_access_deadline = "2022-02-10";
  });

  const exec = () => {
    return request(app)
      .post(`${PARENT_PATH}/${courseId}/students`)
      .set("Cookie", courseOwnerCookie)
      .send({ token, lecture_access_deadline });
  };

  it("return 403 if not course owner", async () => {
    courseOwnerCookie = await global.getNewUserCookie();
    const res = await exec();
    expect(res.status).toBe(403);
  });

  it("return 400 for invalid student", async () => {
    token = "";
    lecture_access_deadline = "some day";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("return 201 with student upon success", async () => {
    const res = await exec();
    expect(res.status).toBe(201);
    expect(res.body.token).toMatch(token);
    expect(res.body.lecture_access_deadline.split("T")[0]).toMatch(
      lecture_access_deadline
    );
  });
});
