const express = require("express");
const router = express.Router();

const { isValidObjectId } = require("@shared/services/object-id");
const { auth, allowAdmin, validatePath } = require("@shared/middlewares");
const { NotFoundError } = require("@shared/errors");
const { Tag } = require("@models/tag");

router.delete(
  "/:id",
  auth,
  allowAdmin,
  validatePath("id", isValidObjectId),
  async (req, res) => {
    const tag = await Tag.findById(req.params.id);
    if (!tag) throw new NotFoundError();

    await tag.remove();

    res.status(204).send();
  }
);

module.exports = router;
