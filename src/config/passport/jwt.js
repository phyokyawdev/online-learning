const passport = require("passport");
const { Strategy } = require("passport-jwt");

const jwtPublicKey = process.env.JWT_PUBLIC_KEY.replace(/\\n/gm, "\n");
const jwtAlgorithm = process.env.JWT_ALGORITHM;
const jwtName = process.env.JWT_NAME;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.session) {
    token = req.session[jwtName];
  }
  return token;
};

const options = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: jwtPublicKey,
  algorithms: [jwtAlgorithm],
};

/**
 * check jwt
 * result types
 * ============
 * Invalid auth token - cb(null, false, { message: "" })
 * ok                 - cb(null, user)
 * error              - cb(error)
 */
passport.use(
  new Strategy(options, async (jwtPayload, cb) => {
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
  })
);
