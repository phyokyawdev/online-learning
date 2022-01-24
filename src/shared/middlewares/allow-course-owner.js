const { ForbiddenError } = require("@shared/errors");

/**
 * middleware that check if current user is owner of
 * current course.
 * @param {Express.Request & {user} & {currentCourse}} req
 * @param {Express.Response} _res
 * @param {Express.Next} next
 * @throws Error || ForbiddenError
 */
function allowCourseOwner(req, _res, next) {
  const { user, currentCourse } = req;

  if (!user) throw new Error("Use this middleware after auth.");

  if (!currentCourse)
    throw new Error("Use this middleware in routes with courseId param.");

  if (!currentCourse.isOwner(user.id))
    throw new ForbiddenError("Only course owner is allowed.");

  next();
}

module.exports = allowCourseOwner;
