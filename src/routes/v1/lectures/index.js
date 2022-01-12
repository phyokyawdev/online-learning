const express = require("express");
const router = express.Router();

const { allowCourseOwner, validateRequest } = require("@shared/middlewares");
const { createRules, Lecture } = require("@models/lecture");
const { NotFoundError } = require("@shared/errors");

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
