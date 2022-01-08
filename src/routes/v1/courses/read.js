const express = require("express");
const router = express.Router();

const { isValidObjectId } = require("@shared/services/object-id");
const { validateRequest, validatePath } = require("@shared/middlewares");
const { NotFoundError } = require("@shared/errors");
const { Course, readRules } = require("@models/course");

router.get("/", validateRequest(readRules), async (req, res) => {
  const { offset, limit, tags, teacher, search } = req.query;

  let findParam = {};
  if (tags) findParam.tags = { $in: tags };
  if (teacher) findParam.teacher = teacher;
  if (search) findParam.title = { $regex: ".*" + search + ".*" };

  const courses = await Course.find(findParam)
    .skip(offset)
    .limit(limit)
    .populate("tags");

  res.send(courses);
});

router.get("/:id", validatePath("id", isValidObjectId), async (req, res) => {
  const course = await Course.findById(req.params.id).populate("tags");
  if (!course) throw new NotFoundError();

  res.send(course);
});

module.exports = router;
