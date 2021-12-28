const express = require("express");
const router = express.Router();

const loginRouter = require("./login");
const logoutRouter = require("./logout");
const signupRouter = require("./signup");
const meRouter = require("./me");

router.use(loginRouter);
router.use(logoutRouter);
router.use(signupRouter);
router.use(meRouter);

module.exports = router;
