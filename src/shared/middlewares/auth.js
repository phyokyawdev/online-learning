const passport = require("passport");
const { NotAuthorizedError } = require("../errors");

/**
 * Attach user: { id: string, isAdmin?: boolean} to req if auth token is valid
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
function auth(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) return next(new NotAuthorizedError(info.message));

    req.user = user;
    next();
  })(req, res, next);
}

module.exports = auth;
