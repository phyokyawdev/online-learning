const { User } = require("@models/user");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const keys = require("../keys");

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientId,
      clientSecret: keys.googleClientSecret,
      callbackURL: `${keys.baseUrl}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({
        email: { $in: profile.emails },
      });

      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await User.create({
        username: profile.name,
        email: profile.emails[0],
      });
      done(null, user);
    }
  )
);
