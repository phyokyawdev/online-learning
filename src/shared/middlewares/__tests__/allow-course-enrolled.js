const allowCourseEnrolled = require("../allow-course-enrolled");
const { CourseStudent } = require("@models/couse_student");
const { createNewObjectId } = require("@shared/services/object-id");
const { ForbiddenError } = require("@shared/errors");

describe("allow-course-enrolled middleware", () => {
  let req, next, spy, user, currentCourse;

  beforeEach(() => {
    user = { id: createNewObjectId(), role: "teacher" };
    currentCourse = { id: createNewObjectId() };

    const student = { id: createNewObjectId() };
    spy = jest
      .spyOn(CourseStudent, "findByUserAndCourse")
      .mockImplementation((userId, courseId) => Promise.resolve(student));

    req = { user, currentCourse };
    next = jest.fn();
  });

  it("should throw or call next with Error without req.user", async () => {
    await global.testMiddleware(allowCourseEnrolled, {}, {}, next, Error);
  });

  it("should throw or call next with Error without req.currentCourse", async () => {
    req = { user };
    await global.testMiddleware(allowCourseEnrolled, req, {}, next, Error);
  });

  it("should throw or call next with ForbiddenError if student not exist", async () => {
    spy = jest
      .spyOn(CourseStudent, "findByUserAndCourse")
      .mockImplementation((userId, courseId) => Promise.resolve(undefined));
    await global.testMiddleware(
      allowCourseEnrolled,
      req,
      {},
      next,
      ForbiddenError
    );
  });

  it("should attach currentCourseStudent to req and call next if succeed", async () => {
    await allowCourseEnrolled(req, {}, next);
    expect(spy).toHaveBeenCalledWith(user.id, currentCourse.id);
    expect(next).toHaveBeenCalledWith();
  });
});
