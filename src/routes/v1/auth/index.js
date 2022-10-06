const express = require("express");
const { google } = require("googleapis");
const router = express.Router();

// normal auth flow
const loginRouter = require("./login");
const logoutRouter = require("./logout");
const signupRouter = require("./signup");
const meRouter = require("./me");
const { googleClientId, googleClientSecret } = require("../../../config/keys");
const { User } = require("@models/user");
const { setAuthTokenToRequest } = require("@shared/services/auth-token");

router.use(loginRouter);
router.use(logoutRouter);
router.use(signupRouter);
router.use(meRouter);

// google auth
const oauth2Client = new google.auth.OAuth2(
  googleClientId,
  googleClientSecret,
  "postmessage"
);

const getUserInfo = async (auth_code) => {
  const { tokens } = await oauth2Client.getToken(auth_code);
  oauth2Client.setCredentials(tokens);
  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: "v2",
  });

  const { data } = await oauth2.userinfo.get();
  return data;
};

router.post("/google", async (req, res) => {
  const { auth_code } = req.body;
  const { name, email, id } = await getUserInfo(auth_code);

  // create if not exist user
  let user;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    user = existingUser;
  } else {
    user = await User.createWithGoogle(name, email, id);
  }

  const token = await user.generateAuthToken();

  // return cookie
  setAuthTokenToRequest(req, token);
  res.send(user);
});

module.exports = router;
