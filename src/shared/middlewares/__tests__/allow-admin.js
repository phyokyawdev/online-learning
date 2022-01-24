const { ForbiddenError } = require("@shared/errors");
const allowAdmin = require("../allow-admin");

describe("allow-admin middleware", () => {
  let req, next;

  beforeEach(() => {
    req = {
      user: {
        role: "admin",
      },
    };
    next = jest.fn();
  });

  it("should throw or call next with error if not used after auth", async () => {
    await global.testMiddleware(allowAdmin, {}, {}, next, Error);
  });

  it("should throw or call next with ForbiddenError if not admin", async () => {
    req.user.role = "basic";
    await global.testMiddleware(allowAdmin, req, {}, next, ForbiddenError);
  });

  it("should call next without args if req.user.role is admin", () => {
    allowAdmin(req, {}, next);
    expect(next).toHaveBeenCalledWith();
  });
});
