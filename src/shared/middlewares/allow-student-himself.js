const { ForbiddenError } = require("@shared/errors");

/**
 * middleware that check if current user is owner of
 * current course.
 * @param {Express.Request & {user} & {student}} req
 * @param {Express.Response} _res
 * @param {Express.Next} next
 * @throws ForbiddenError
 */
function allowStudentHimself(req, _res, next) {
  const { user, student } = req;
  if (!(student && student.isStudentHimself(user.id)))
    throw new ForbiddenError("Only student himself is allowed to do action.");

  next();
}

module.exports = allowStudentHimself;
