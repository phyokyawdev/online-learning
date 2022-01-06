const express = require("express");
const router = express.Router();

const { NotFoundError } = require("@shared/errors");
const { User, updateRules } = require("@models/user");
const { isValidObjectId } = require("@shared/services/object-id");
const {
  validateRequest,
  allowAdmin,
  auth,
  validatePath,
} = require("@shared/middlewares");

/**
 * admin will update role of user
 */
router.put(
  "/:id",
  auth,
  allowAdmin,
  validatePath("id", isValidObjectId),
  validateRequest(updateRules),
  async (req, res) => {
    const { role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) throw new NotFoundError();

    user.role = role;
    await user.save();

    res.send(user);
  }
);

module.exports = router;
