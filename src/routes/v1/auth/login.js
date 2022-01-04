const express = require("express");
const passport = require("passport");
const router = express.Router();

const { NotAuthorizedError } = require("@shared/errors");
const { validateRequest } = require("@shared/middlewares");
const { setAuthTokenToRequest } = require("@shared/services/auth-token");
const { loginRules } = require("@models/user");

router.post("/login", validateRequest(loginRules), (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    if (err) return next(err);

    if (!user) return next(new NotAuthorizedError(info.message));

    let token;
    try {
      token = await user.generateAuthToken();
    } catch (err) {
      return next(err);
    }

    setAuthTokenToRequest(req, token);

    res.send(user);
  })(req, res, next);
});

module.exports = router;
