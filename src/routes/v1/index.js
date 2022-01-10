const express = require("express");
const router = express.Router();

const { authThenHandleCourseId } = require("@shared/middlewares");

const authRouter = require("./auth");
const usersRouter = require("./users");
const tagsRouter = require("./tags");
const coursesRouter = require("./courses");
const lecturesRouter = require("./lectures");

/**
 * req.user and req.currentCourse will be
 * available inside lectures router.
 */
router.param("courseId", authThenHandleCourseId);

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/tags", tagsRouter);
router.use("/courses", coursesRouter);
router.use("/courses/:courseId/lectures", lecturesRouter);

module.exports = router;
