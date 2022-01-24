const { ForbiddenError } = require("@shared/errors");
const allowTeacher = require("../allow-teacher");

describe("allow-teacher middleware", () => {
  let req, next;

  beforeEach(() => {
    req = {
      user: {
        role: "teacher",
      },
    };
    next = jest.fn();
  });

  it("should throw or call next with error if not used after auth", async () => {
    await global.testMiddleware(allowTeacher, {}, {}, next, Error);
  });

  it("should throw or call next with ForbiddenError if not teacher", async () => {
    req.user.role = "basic";
    await global.testMiddleware(allowTeacher, req, {}, next, ForbiddenError);
  });

  it("should call next without args if req.user.role is teacher", () => {
    allowTeacher(req, {}, next);
    expect(next).toHaveBeenCalledWith();
  });
});
