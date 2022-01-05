const request = require("supertest");
const app = require("@app");
const PATH = "/v1/tags";

/**
 * query
 * =====
 * offset
 * limit
 * search (name)
 */
describe("GET", () => {
  let pathParams, queryParams;

  beforeEach(async () => {
    pathParams = "";
    queryParams = {};
  });

  const exec = () => {
    return request(app).get(`${PATH}/${pathParams}`).query(queryParams).send();
  };

  // all tags
  it("should return 20 tags without request query", async () => {
    for (let i = 0; i < 20; i++) {
      await global.newTag();
    }
    const { body } = await exec().expect(200);
    expect(body.length).toEqual(20);
  });

  it("should return defined number of tags with offset and limit", async () => {
    for (let i = 0; i < 20; i++) {
      await global.newTag();
    }
    queryParams = { offset: 0, limit: 15 };
    const { body } = await exec().expect(200);
    expect(body.length).toEqual(15);
  });

  it("should return only tags with provided search term", async () => {
    for (let i = 0; i < 5; i++) {
      await global.newTag();
    }
    const res = await global.newTag();

    queryParams = { search: res.body.name };
    const { body } = await exec().expect(200);
    expect(body.length).toEqual(1);
  });

  // specific tag
  it("should return 404 for invalid specific tag", async () => {
    pathParams = "12345";
    const res = await exec();
    expect(res.status).toBe(404);
  });

  it("should return 200 with tag for valid specific tag", async () => {
    const res = await global.newTag();
    pathParams = res.body.id;

    const { body } = await exec().expect(200);
    expect(body.name).toMatch(res.body.name);
  });
});
