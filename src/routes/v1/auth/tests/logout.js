const request = require("supertest");
const app = require("@app");

describe("/logout", () => {
  it("should clears cookie after logout", async () => {
    await global.signupNewUser();

    const res = await request(app).post("/v1/auth/logout").send({}).expect(200);
    expect(res.get("Set-Cookie")).toBeDefined();
  });
});
