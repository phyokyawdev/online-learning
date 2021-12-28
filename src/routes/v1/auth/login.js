const express = require("express");
const passport = require("passport");
const { oneOf, body } = require("express-validator");
const router = express.Router();

const { NotAuthorizedError } = require("@shared/errors");
const { validateRequest } = require("@shared/middlewares");
const { setAuthTokenForRequest } = require("@shared/services/auth-token");

router.post(
  "/login",
  validateRequest([
    oneOf([
      body("username").isLength({ min: 5, max: 30 }),
      body("email").isEmail(),
    ]),
    body("password").isLength({ min: 8, max: 1024 }),
  ]),
  (req, res, next) => {
    passport.authenticate("login", async (err, user, info) => {
      if (err) return next(err);

      if (!user) return next(new NotAuthorizedError(info.message));

      let token;
      try {
        token = await user.generateAuthToken();
      } catch (err) {
        return next(err);
      }

      setAuthTokenForRequest(req, token);

      res.send(user);
    })(req, res, next);
  }
);

module.exports = router;
