const express = require("express");
const router = express.Router();

const { Tag, createRules } = require("@models/tag");
const { validateRequest, auth, allowTeacher } = require("@shared/middlewares");
const { ConflictError } = require("@shared/errors");

router.post(
  "/",
  auth,
  allowTeacher,
  validateRequest(createRules),
  async (req, res) => {
    const { name } = req.body;

    const isExistingTagName = await Tag.isExistingTagName(name);
    if (isExistingTagName) throw new ConflictError();

    const tag = new Tag({ name });
    await tag.save();

    res.status(201).send(tag);
  }
);

module.exports = router;
