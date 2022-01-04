const express = require("express");
const passport = require("passport");
const router = express.Router();

const { ConflictError } = require("@shared/errors");
const { validateRequest } = require("@shared/middlewares");
const { setAuthTokenToRequest } = require("@shared/services/auth-token");
const { signupRules } = require("@models/user");

router.post("/signup", validateRequest(signupRules), (req, res, next) => {
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
});

module.exports = router;
