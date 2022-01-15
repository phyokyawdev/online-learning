const { CourseStudent } = require("@models/couse_student");
const { ForbiddenError } = require("@shared/errors");

/**
 * middleware that check if current user is student of
 * current course.
 * @param {Express.Request & {user} & {currentCourse}} req
 * @param {Express.Response} _res
 * @param {Express.Next} next
 * @throws ForbiddenError
 */
async function allowCourseStudent(req, _res, next) {
  const { currentCourse, user } = req;
  const student = await CourseStudent.findByUserAndCourse(
    user.id,
    currentCourse.id
  );
  if (!student) throw new ForbiddenError("Only course student is allowed.");
  next();
}

module.exports = allowCourseStudent;
