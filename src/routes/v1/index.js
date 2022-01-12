const express = require("express");
const router = express.Router();

const { Course } = require("@models/course");
const { NotFoundError } = require("@shared/errors");
const { auth } = require("@shared/middlewares");
const { isValidObjectId } = require("@shared/services/object-id");

const authRouter = require("./auth");
const usersRouter = require("./users");
const tagsRouter = require("./tags");
const coursesRouter = require("./courses");
const lecturesRouter = require("./lectures");
const studentsRouter = require("./students");

/**
 * Request param handler for courseId
 * ==================================
 * Executes auth middleware then handle courseId.
 * auth           => req.user
 * handleCourseId => req.currentCourse
 */
router.param("courseId", (req, res, next, id) => {
  const handleCourseId = async (err) => {
    if (err) return next(err);
    try {
      if (!isValidObjectId(id)) throw new NotFoundError("Invalid course id.");

      const course = await Course.findById(id);
      if (!course) throw new NotFoundError("Course not exist.");

      req.currentCourse = course;
      next();
    } catch (error) {
      next(error);
    }
  };

  auth(req, res, handleCourseId);
});

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/tags", tagsRouter);
router.use("/courses", coursesRouter);
router.use("/courses/:courseId/lectures", lecturesRouter);
router.use("/courses/:courseId/students", studentsRouter);

module.exports = router;
