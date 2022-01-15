const express = require("express");
const router = express.Router();

const {
  allowCourseOwner,
  validateRequest,
  oneOf,
} = require("@shared/middlewares");
const { Lecture, createRules, readRules } = require("@models/lecture");
const { CourseStudent } = require("@models/couse_student");
const { NotFoundError, ForbiddenError } = require("@shared/errors");

/**
 * middleware that check if current user is accessible to
 * the lectures of the course
 * @param {express.Request & {user} & {currentCourse}} req
 * @param {express.Response} _res
 * @param {express.NextFunction} next
 */
async function allowLectureAccessibleStudent(req, _res, next) {
  const { user, currentCourse } = req;
  const student = await CourseStudent.findByUserAndCourse(
    user.id,
    currentCourse.id
  );
  if (!student)
    throw new ForbiddenError("You need to be student to access lecture.");

  if (!student.isLectureAccessible())
    throw new ForbiddenError("Lecture access expired.");
  next();
}

const allowOwnerOrAccessibleStudent = oneOf([
  allowCourseOwner,
  allowLectureAccessibleStudent,
]);

/**
 * req.lecture will be available in
 * route handlers with id param.
 */
router.param("id", async (req, _res, next, id) => {
  const lecture = await Lecture.findByIdString(id);
  if (!lecture) throw new NotFoundError("Lecture not exist.");
  req.lecture = lecture;
  next();
});

router.post(
  "/",
  allowCourseOwner,
  validateRequest(createRules),
  async (req, res) => {
    const { body, currentCourse, user } = req;
    const lecture = await Lecture.create(body, currentCourse.id, user.id);
    res.status(201).send(lecture);
  }
);

router.get(
  "/",
  allowOwnerOrAccessibleStudent,
  validateRequest(readRules),
  async (req, res) => {
    const { query, currentCourse } = req;
    const lectures = await Lecture.findByQuery(query, currentCourse.id);
    res.send(lectures);
  }
);

router.get("/:id", allowOwnerOrAccessibleStudent, async (req, res) => {
  const { lecture } = req;
  res.send(lecture);
});

router.put(
  "/:id",
  allowCourseOwner,
  validateRequest(createRules),
  async (req, res) => {
    const { body, lecture } = req;
    await lecture.updateBody(body);
    res.send(lecture);
  }
);

router.delete("/:id", allowCourseOwner, async (req, res) => {
  const { lecture } = req;
  await lecture.remove();
  res.status(204).send();
});

module.exports = router;
