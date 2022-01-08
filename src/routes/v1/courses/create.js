const express = require("express");
const router = express.Router();

const { auth, allowTeacher, validateRequest } = require("@shared/middlewares");
const { Course, createRules } = require("@models/course");

router.post(
  "/",
  auth,
  allowTeacher,
  validateRequest(createRules),
  async (req, res) => {
    const { title, content, tags } = req.body;
    const teacher = req.user.id;

    const course = new Course({ title, content, tags, teacher });
    await course.save();

    res.status(201).send(course);
  }
);

module.exports = router;
