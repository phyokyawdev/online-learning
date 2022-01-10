const { Course } = require("@models/course");
const { NotFoundError } = require("../errors");
const { isValidObjectId } = require("../services/object-id");
const auth = require("./auth");

/**
 * This middleware execute auth middleware first
 * and then handle courseId request param.
 * Attach user and currentCourse to req if valid
 * and pass req to next handler.
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.NextFunction} next
 * @param {*} id - value of courseId param
 * @throws NotAuthorizedError & NotFoundError
 */
function authThenHandleCourseId(req, res, next, id) {
  const handleCourseId = async (err) => {
    if (err) return next(err);
    try {
      if (!isValidObjectId(id)) throw new NotFoundError("Invalid course id.");

      const course = await Course.findById(id);
      if (!course) throw new NotFoundError("Course not exist.");

      req.currentCourse = course;
      next();
    } catch (error) {
      next(error);
    }
  };

  auth(req, res, handleCourseId);
}

module.exports = authThenHandleCourseId;
