const express = require("express");
const router = express.Router();

const { validateRequest, allowAdmin, auth } = require("@shared/middlewares");
const { isValidObjectId } = require("@shared/services/object-id");
const { NotFoundError } = require("@shared/errors");
const { User, readRules } = require("@models/user");

/** only admin will manage user */
router.get(
  "/",
  auth,
  allowAdmin,
  validateRequest(readRules),
  async (req, res) => {
    const { offset, limit } = req.query;
    const users = await User.find({}).skip(offset).limit(limit);
    res.send(users);
  }
);

router.get("/:id", auth, allowAdmin, async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new NotFoundError("Invalid user id");

  const user = await User.findById(id);
  if (!user) throw new NotFoundError();

  res.send(user);
});

module.exports = router;
