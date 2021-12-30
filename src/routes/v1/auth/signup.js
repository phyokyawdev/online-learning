const express = require("express");
const passport = require("passport");
const router = express.Router();
const { body } = require("express-validator");

const { ConflictError } = require("@shared/errors");
const { validateRequest } = require("@shared/middlewares");
const { setAuthTokenToRequest } = require("@shared/services/auth-token");

router.post(
  "/signup",
  validateRequest([
    body("username").isLength({ min: 5, max: 30 }),
    body("email").isEmail(),
    body("password").isLength({ min: 8, max: 1024 }),
  ]),
  (req, res, next) => {
    passport.authenticate("signup", async (err, user, info) => {
      if (err) return next(err);

      if (!user) return next(new ConflictError(info.message));

      let token;
      try {
        token = await user.generateAuthToken();
      } catch (err) {
        return next(err);
      }

      setAuthTokenToRequest(req, token);

      res.status(201).send(user);
    })(req, res, next);
  }
);

module.exports = router;
