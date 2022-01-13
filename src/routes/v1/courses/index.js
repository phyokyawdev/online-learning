const express = require("express");
const router = express.Router();

const {
  auth,
  allowTeacher,
  allowCourseOwner,
  validateRequest,
} = require("@shared/middlewares");
const { Course, createRules, readRules } = require("@models/course");
const { NotFoundError } = require("@shared/errors");

/**
 * req.currentCourse will be available in
 * route handlers with id param.
 */
router.param("id", async (req, _res, next, id) => {
  const course = await Course.findByIdString(id);
  if (!course) throw new NotFoundError("Course not exist.");
  req.currentCourse = course;
  next();
});

router.post(
  "/",
  auth,
  allowTeacher,
  validateRequest(createRules),
  async (req, res) => {
    const { body, user } = req;
    const course = await Course.create(body, user.id);
    res.status(201).send(course);
  }
);

router.get("/", validateRequest(readRules), async (req, res) => {
  const { query } = req;
  const courses = await Course.findByQuery(query);
  res.send(courses);
});

router.get("/:id", async (req, res) => {
  const { currentCourse } = req;
  res.send(currentCourse);
});

router.put(
  "/:id",
  auth,
  allowCourseOwner,
  validateRequest(createRules),
  async (req, res) => {
    const { currentCourse, body } = req;
    await currentCourse.updateBody(body);
    res.send(currentCourse);
  }
);

router.delete("/:id", auth, allowCourseOwner, async (req, res) => {
  const { currentCourse } = req;
  await currentCourse.remove();
  res.status(204).send();
});

module.exports = router;
