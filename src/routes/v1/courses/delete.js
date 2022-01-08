const express = require("express");
const router = express.Router();

const { auth, allowTeacher, validatePath } = require("@shared/middlewares");
const { isValidObjectId } = require("@shared/services/object-id");
const { Course } = require("@models/course");
const { NotFoundError, ForbiddenError } = require("@shared/errors");

router.delete(
  "/:id",
  auth,
  allowTeacher,
  validatePath("id", isValidObjectId),
  async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) throw new NotFoundError();

    if (!course.isOwner(req.user.id)) throw new ForbiddenError();

    await course.remove();

    res.status(204).send();
  }
);

module.exports = router;
