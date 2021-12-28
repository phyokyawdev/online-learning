const passport = require("passport");
const { Strategy } = require("passport-custom");

const { User } = require("@models/user");

/**
 * login with either username or email field
 * results types
 * =============
 * Invalid credentials  - cb(null, false, { message: ""})
 * ok                   - cb(null, user)
 * error                - cb(error)
 */
passport.use(
  "login",
  new Strategy(async (req, cb) => {
    try {
      const { username, email, password } = req.body;

      const user = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });
      if (!user) {
        return cb(null, false, {
          message: "Invalid credentials",
        });
      }

      const validPassword = await user.checkPassword(password);
      if (!validPassword) {
        return cb(null, false, {
          message: "Invalid credentials",
        });
      }

      return cb(null, user);
    } catch (err) {
      return cb(err);
    }
  })
);
