const express = require("express");
const router = express.Router();

const {
  validateRequest,
  allowAdmin,
  auth,
  validatePath,
} = require("@shared/middlewares");
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

router.get(
  "/:id",
  auth,
  allowAdmin,
  validatePath("id", isValidObjectId),
  async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError();

    res.send(user);
  }
);

module.exports = router;
