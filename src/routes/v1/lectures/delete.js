const express = require("express");
const router = express.Router();

const { allowCourseOwner, validatePath } = require("@shared/middlewares");
const { isValidObjectId } = require("@shared/services/object-id");
const { Lecture } = require("@models/lecture");
const { NotFoundError } = require("@shared/errors");

router.delete(
  "/:id",
  allowCourseOwner,
  validatePath("id", isValidObjectId),
  async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) throw new NotFoundError();

    await lecture.remove();
    res.status(204).send();
  }
);

module.exports = router;
