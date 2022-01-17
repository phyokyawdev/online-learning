const express = require("express");
const router = express.Router();

const { AssignmentQuestion } = require("@models/assignment_question");
const { Course } = require("@models/course");
const { NotFoundError } = require("@shared/errors");
const { auth } = require("@shared/middlewares");

const authRouter = require("./auth");
const usersRouter = require("./users");
const tagsRouter = require("./tags");
const coursesRouter = require("./courses");
const lecturesRouter = require("./lectures");
const studentsRouter = require("./students");
const assignmentQuestions = require("./assignment-questions");
const assignmentAnswers = require("./assignment-answers");

/**
 * req.user and req.currentCourse will be available
 * in all route handlers with courseId param.
 */
router.param("courseId", (req, res, next, id) => {
  const handleCourseId = async (err) => {
    if (err) return next(err);
    try {
      const course = await Course.findByIdString(id);
      if (!course) throw new NotFoundError("Course not exist.");
      req.currentCourse = course;
      next();
    } catch (error) {
      next(error);
    }
  };
  auth(req, res, handleCourseId);
});

/**
 * req.currentAssignmentQuestion will be available
 * in route handlers with questionId param.
 */
router.param("questionId", async (req, _res, next, id) => {
  const question = await AssignmentQuestion.findByIdString(id);
  if (!question) throw new NotFoundError("Assignment question not exist.");
  req.currentAssignmentQuestion = question;
  next();
});

router.use("/auth", authRouter);
router.use("/users", usersRouter);

router.use("/tags", tagsRouter);
router.use("/courses", coursesRouter);

router.use("/courses/:courseId/lectures", lecturesRouter);
router.use("/courses/:courseId/students", studentsRouter);
router.use("/courses/:courseId/assignment-questions", assignmentQuestions);

router.use(
  "/courses/:courseId/assignment-questions/:questionId/assignment-answers",
  assignmentAnswers
);

module.exports = router;
