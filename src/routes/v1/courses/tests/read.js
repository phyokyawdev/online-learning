const request = require("supertest");
const qs = require("qs");
const app = require("@app");
const { createNewObjectId } = require("@shared/services/object-id");
const PATH = "/v1/courses";

/**
 * query
 * =====
 * offset
 * limit
 * tags
 * teacher
 *
 * search (title)
 */

describe("GET", () => {
  let courseRes, pathParams, queryParams;

  beforeEach(async () => {
    courseRes = await global.newCourse();
  });

  const exec = () => {
    return request(app).get(`${PATH}/${pathParams}`).query(queryParams).send();
  };

  describe("All", () => {
    beforeEach(() => {
      pathParams = "";
      queryParams = {};
    });

    it("should return 10 courses without request query", async () => {
      for (let i = 0; i < 10; i++) {
        await global.newCourse();
      }
      const { body } = await exec().expect(200);
      expect(body.length).toEqual(10);
    });

    it("should return defined number of courses with offset and query", async () => {
      for (let i = 0; i < 5; i++) {
        await global.newCourse();
      }
      queryParams = { offset: 0, limit: 5 };
      const { body } = await exec().expect(200);
      expect(body.length).toEqual(5);
    });

    it("should return only courses with defined tags", async () => {
      const course_res = await global.newCourse();
      const tag = course_res.body.tags[0];
      queryParams = qs.stringify({ tags: [tag.id] });

      const { body } = await exec().expect(200);
      expect(body.length).toEqual(1);
      expect(body[0].tags).toEqual(expect.arrayContaining([tag]));
    });

    it("should return only courses with defined teacher", async () => {
      const course_res = await global.newCourse();
      const teacher_id = course_res.body.teacher;
      queryParams = { teacher: teacher_id };

      const { body } = await exec().expect(200);
      expect(body.length).toEqual(1);
      expect(body[0].teacher).toMatch(teacher_id);
    });

    it("should return only courses with search term", async () => {
      await global.newCourse();
      queryParams = { search: "Node" };

      const { body } = await exec().expect(200);
      expect(body.length).toEqual(2);
    });
  });

  describe("One", () => {
    beforeEach(() => {
      pathParams = courseRes.body.id;
    });

    it("should return 404 for invalid id", async () => {
      pathParams = "12345";
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 404 if course not exist", async () => {
      pathParams = createNewObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should return 200 with course for valid course", async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.id).toMatch(pathParams);
    });
  });
});
