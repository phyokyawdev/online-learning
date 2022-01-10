const { ForbiddenError } = require("@shared/errors");

/**
 * middleware that check if current user is owner of
 * current course.
 * @param {Express.Request & {user} & {currentCourse}} req
 * @param {Express.Response} _res
 * @param {Express.Next} next
 * @throws ForbiddenError
 */
function allowCourseOwner(req, _res, next) {
  const { currentCourse, user } = req;
  if (!(currentCourse && currentCourse.isOwner(user.id)))
    throw new ForbiddenError();

  next();
}

module.exports = allowCourseOwner;
