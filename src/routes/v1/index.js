const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const usersRouter = require("./users");
const tagsRouter = require("./tags");

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/tags", tagsRouter);

module.exports = router;
