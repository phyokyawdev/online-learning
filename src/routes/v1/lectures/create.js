const express = require("express");
const router = express.Router();

const { Lecture, createRules } = require("@models/lecture");
const { allowCourseOwner, validateRequest } = require("@shared/middlewares");

router.post(
  "/",
  allowCourseOwner,
  validateRequest(createRules),
  async (req, res) => {
    const { index, title, url } = req.body;
    const { user, currentCourse } = req;
    teacher = user.id;
    course = currentCourse.id;

    const lecture = new Lecture({ index, title, url, course, teacher });
    await lecture.save();

    res.status(201).send(lecture);
  }
);

module.exports = router;
