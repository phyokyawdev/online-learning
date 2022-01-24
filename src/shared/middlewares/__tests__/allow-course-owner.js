const { ForbiddenError } = require("@shared/errors");
const { createNewObjectId } = require("@shared/services/object-id");
const allowCourseOwner = require("../allow-course-owner");

describe("allow-course-owner middleware", () => {
  let req, next, user, currentCourse;

  const notOwnerMock = jest.fn().mockImplementation((id) => false);
  const ownerMock = jest.fn().mockImplementation((id) => true);

  beforeEach(() => {
    user = { id: createNewObjectId(), role: "teacher" };
    currentCourse = { isOwner: ownerMock };

    req = { user, currentCourse };
    next = jest.fn();
  });

  it("should throw or call next with error if not used after auth", async () => {
    await global.testMiddleware(allowCourseOwner, {}, {}, next, Error);
  });

  it("should throw or call next with error if not courseId param route", async () => {
    req = { user };
    await global.testMiddleware(allowCourseOwner, req, {}, next, Error);
  });

  it("should throw or call next with ForbiddenError if not course owner", async () => {
    req.currentCourse = { isOwner: notOwnerMock };
    await global.testMiddleware(
      allowCourseOwner,
      req,
      {},
      next,
      ForbiddenError
    );
  });

  it("should call next without args if req.user.role is teacher", () => {
    allowCourseOwner(req, {}, next);
    expect(next).toHaveBeenCalledWith();
  });
});
