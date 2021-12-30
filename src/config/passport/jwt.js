const passport = require("passport");
const { Strategy } = require("passport-jwt");

const { getPassportJWTOptions } = require("@shared/services/auth-token");

const options = getPassportJWTOptions();

/**
 * check jwt
 * result types
 * ============
 * Invalid auth token - cb(null, false, { message: "" })
 * ok                 - cb(null, user)
 * error              - cb(error)
 */
passport.use(
  new Strategy(
    options,
    /**
     * passport jwt strategy
     * @param {*} jwtPayload - decoded JWT payload
     * @param {*} cb - callback
     * @returns callback with result or false
     */
    (jwtPayload, cb) => {
      try {
        const user = jwtPayload;
        if (!user) {
          return cb(null, false, {
            message: "Invalid auth token",
          });
        }
        return cb(null, user);
      } catch (err) {
        return cb(err);
      }
    }
  )
);
