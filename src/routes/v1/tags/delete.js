const express = require("express");
const router = express.Router();

const { isValidObjectId } = require("@shared/services/object-id");
const { auth, allowAdmin } = require("@shared/middlewares");
const { NotFoundError } = require("@shared/errors");
const { Tag } = require("@models/tag");

router.delete("/:id", auth, allowAdmin, async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new NotFoundError("Invalid tag id.");

  const tag = await Tag.findById(id);
  if (!tag) throw new NotFoundError();

  res.status(204).send();
});

module.exports = router;
