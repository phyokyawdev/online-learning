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
 * req.student will be available in
 * all route handlers with id param.
 */
router.param("id", async (req, _res, next, id) => {
  const student = await CourseStudent.findByIdString(id);
  if (!student) throw new NotFoundError("Student not exist.");
  req.student = student;
  next();
});

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

router.get(
  "/:id",
  oneOf(
    [allowCourseOwner, allowStudentHimself],
    new ForbiddenError("Only course owner or student himself is allowed.")
  ),
  async (req, res) => {
    const { student } = req;
    res.send(student);
  }
);

/** update student by course owner */
router.patch(
  "/:id",
  allowCourseOwner,
  validateRequest(updateRules),
  async (req, res) => {
    const { student, body } = req;
    await student.updateBody(body);
    res.send(student);
  }
);

router.delete("/:id", allowCourseOwner, async (req, res) => {
  const { student } = req;
  await student.remove();
  res.status(204).send();
});

/** enroll to course students by user */
router.patch("/", validateRequest(enrollRules), async (req, res) => {
  const { user, body, currentCourse } = req;
  const position = await CourseStudent.findByToken(body, currentCourse.id);
  if (!position) throw new NotFoundError("Invalid token.");

  if (position.isTokenUsed()) throw new ConflictError("Token already used.");
  await position.enroll(user.id);
  res.send(position);
});

module.exports = router;
