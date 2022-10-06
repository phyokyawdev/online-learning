const passport = require("passport");
const { Strategy } = require("passport-custom");

const { User } = require("@models/user");

/**
 * signup with username, email, password
 * Conflict Name/Email  - cb(null, false, { message: ""})
 * ok                   - cb(null, user)
 * error                - cb(error)
 */
passport.use(
  "signup",
  new Strategy(async (req, cb) => {
    try {
      const { email } = req.body;

      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return cb(null, false, {
          message: "Email already registered, Log in instead",
        });
      }

      // create user
      const user = await User.create(req.body);

      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  })
);
