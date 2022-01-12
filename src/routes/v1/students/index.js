const express = require("express");
const router = express.Router();

const {
  NotFoundError,
  ForbiddenError,
  ConflictError,
} = require("@shared/errors");
const {
  allowCourseOwner,
  validateRequest,
  oneOf,
  allowStudentHimself,
} = require("@shared/middlewares");
const {
  CourseStudent,
  createRules,
  updateRules,
  readRules,
  enrollRules,
} = require("@models/couse_student");

/**
 * Course Student Router
 * =====================
 * req.user and req.currentCourse will be available in
 * all route handlers.
 */

/**
 * param handler for id
 * - search student
 * - add student to req
 * router handlers with id param in this router can use
 * req.student.
 */
router.param("id", async (req, _res, next, id) => {
  const student = await CourseStudent.findByIdString(id);
  if (!student) throw new NotFoundError("Student not exist.");

  req.student = student;
  next();
});

/** create student */
router.post(
  "/",
  allowCourseOwner,
  validateRequest(createRules),
  async (req, res) => {
    const { body, currentCourse } = req;
    const student = await CourseStudent.create(body, currentCourse);
    res.status(201).send(student);
  }
);

/** read students */
router.get(
  "/",
  allowCourseOwner,
  validateRequest(readRules),
  async (req, res) => {
    const { query, currentCourse } = req;
    const students = await CourseStudent.findByQuery(query, currentCourse);
    res.send(students);
  }
);

/** read student */
router.get(
  "/:id",
  oneOf(
    [allowCourseOwner, allowStudentHimself],
    new ForbiddenError("Only course owner or student himself is allowed.")
  ),
  async (req, res) => {
    // either student or course owner
    res.send(req.student);
  }
);

/** update student (update by course owner) */
router.patch(
  "/:id",
  allowCourseOwner,
  validateRequest(updateRules),
  async (req, res) => {
    const { student, body } = req;
    await student.updateDefinedFields(body);
    res.send(student);
  }
);

/** delete student */
router.delete("/:id", allowCourseOwner, async (req, res) => {
  await req.student.remove();
  res.status(204).send();
});

/**
 * User Enrollment Route
 * patch - /courses/:courseId/students
 * + body.token
 */
router.patch("/", validateRequest(enrollRules), async (req, res) => {
  const { user, body, currentCourse } = req;
  const student = await CourseStudent.enrollUser(
    user.id,
    body,
    currentCourse.id
  );
  if (!student) throw new ConflictError("Invalid or used token.");
  res.send(student);
});

module.exports = router;
