const express = require("express");
const router = express.Router();

const { Course, createRules } = require("@models/course");
const { NotFoundError, ForbiddenError } = require("@shared/errors");
const { isValidObjectId } = require("@shared/services/object-id");
const {
  auth,
  allowTeacher,
  validatePath,
  validateRequest,
} = require("@shared/middlewares");

router.put(
  "/:id",
  auth,
  allowTeacher,
  validatePath("id", isValidObjectId),
  validateRequest(createRules),
  async (req, res) => {
    const { title, content, tags } = req.body;

    // find course
    const course = await Course.findById(req.params.id);
    if (!course) throw new NotFoundError();

    // check course owner
    if (!course.isOwner(req.user.id)) throw new ForbiddenError();

    // update fields
    course.title = title;
    course.content = content;
    course.tags = tags;

    // save
    await course.save();

    res.send(course);
  }
);

module.exports = router;
