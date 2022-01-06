const express = require("express");
const router = express.Router();

const { validateRequest, validatePath } = require("@shared/middlewares");
const { readRules, Tag } = require("@models/tag");
const { isValidObjectId } = require("@shared/services/object-id");
const { NotFoundError } = require("@shared/errors");

/**
 * query params
 * ============
 * offset
 * limit
 * search (name)
 */
router.get("/", validateRequest(readRules), async (req, res) => {
  const { offset, limit, search } = req.query;

  let findParam = {};
  if (search) findParam = { name: search };

  const tags = await Tag.find(findParam).skip(offset).limit(limit);
  res.send(tags);
});

router.get("/:id", validatePath("id", isValidObjectId), async (req, res) => {
  const tag = await Tag.findById(req.params.id);
  if (!tag) throw new NotFoundError();

  res.send(tag);
});

module.exports = router;
