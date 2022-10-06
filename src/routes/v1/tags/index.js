const express = require("express");
const router = express.Router();

const {
  auth,
  allowTeacher,
  validateRequest,
  allowAdmin,
} = require("@shared/middlewares");
const { Tag, createRules, readRules } = require("@models/tag");
const { NotFoundError, ConflictError } = require("@shared/errors");

/**
 * req.tag will be available in
 * route handlers with id param.
 */
router.param("id", async (req, _res, next, id) => {
  const tag = await Tag.findByIdString(id);
  if (!tag) throw new NotFoundError("Tag not exist.");
  req.tag = tag;
  next();
});

router.post(
  "/",
  auth,
  allowTeacher,
  validateRequest(createRules),
  async (req, res) => {
    const { body } = req;
    const tag = await Tag.createIfNotExist(body);
    res.send(tag);
  }
);

router.get("/", validateRequest(readRules), async (req, res) => {
  const { query } = req;
  const tags = await Tag.findByQuery(query);
  res.send(tags);
});

router.get("/:id", async (req, res) => {
  const { tag } = req;
  res.send(tag);
});

router.delete("/:id", auth, allowAdmin, async (req, res) => {
  const { tag } = req;
  await tag.remove();
  res.status(204).send();
});

module.exports = router;
