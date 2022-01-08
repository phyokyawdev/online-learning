const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const usersRouter = require("./users");
const tagsRouter = require("./tags");
const coursesRouter = require("./courses");

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/tags", tagsRouter);
router.use("/courses", coursesRouter);

module.exports = router;
