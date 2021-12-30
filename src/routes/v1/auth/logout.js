const { setAuthTokenToRequest } = require("@shared/services/auth-token");
const express = require("express");
const router = express.Router();

router.post("/logout", (req, res) => {
  // set null as auth token
  setAuthTokenToRequest(req, null);

  res.send({});
});

module.exports = router;
