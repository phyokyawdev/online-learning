const express = require("express");
const router = express.Router();

const { isValidObjectId } = require("@shared/services/object-id");
const { validateRequest, allowAdmin, auth } = require("@shared/middlewares");
const { NotFoundError } = require("@shared/errors");
const { User, updateRules } = require("@models/user");

/**
 * admin will update role of user
 */
router.put(
  "/:id",
  auth,
  allowAdmin,
  validateRequest(updateRules),
  async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!isValidObjectId(id)) throw new NotFoundError("invalid user id");

    const user = await User.findById(id);
    if (!user) throw new NotFoundError();

    user.role = role;
    await user.save();

    res.send(user);
  }
);

module.exports = router;
