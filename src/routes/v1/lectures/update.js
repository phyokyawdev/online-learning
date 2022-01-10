const express = require("express");
const router = express.Router();

const {
  allowCourseOwner,
  validatePath,
  validateRequest,
} = require("@shared/middlewares");
const { isValidObjectId } = require("@shared/services/object-id");
const { Lecture, createRules } = require("@models/lecture");
const { NotFoundError } = require("@shared/errors");

router.put(
  "/:id",
  allowCourseOwner,
  validatePath("id", isValidObjectId),
  validateRequest(createRules),
  async (req, res) => {
    const { index, title, url } = req.body;

    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) throw new NotFoundError();

    lecture.index = index;
    lecture.title = title;
    lecture.url = url;

    await lecture.save();

    res.send(lecture);
  }
);

module.exports = router;
