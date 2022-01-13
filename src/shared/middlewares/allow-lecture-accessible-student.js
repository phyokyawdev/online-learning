const { ForbiddenError } = require("@shared/errors");

/**
 * middleware that check if current user is accessible to
 * the lectures of the course
 * @param {Express.Request & {user} & {currentCourse}} req
 * @param {Express.Response} _res
 * @param {Express.NextFunction} next
 */
async function allowLectureAccessibleStudent(req, _res, next) {
  const { user, currentCourse } = req;
  const isAccessible = await CourseStudent.isLectureAccessible(
    user.id,
    currentCourse.id
  );

  if (!isAccessible) throw new ForbiddenError("User can't access lecture.");
  next();
}

module.exports = allowLectureAccessibleStudent;
