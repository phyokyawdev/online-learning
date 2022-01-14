const express = require("express");
const router = express.Router();

const {
  auth,
  allowAdmin,
  validateRequest,
  oneOf,
} = require("@shared/middlewares");
const { NotFoundError, ForbiddenError } = require("@shared/errors");
const { User, readRules, updateRules } = require("@models/user");

/**
 * Only logged in users can access
 * this router.
 */
router.use(auth);

/**
 * req.currentUser will be available in
 * route handlers with id param.
 */
router.param("id", async (req, _res, next, id) => {
  const currentUser = await User.findByIdString(id);
  if (!currentUser) throw new NotFoundError("User not exist.");
  req.currentUser = currentUser;
  next();
});

router.get("/", allowAdmin, validateRequest(readRules), async (req, res) => {
  const { query } = req;
  const users = await User.findByQuery(query);
  res.send(users);
});

router.get(
  "/:id",
  oneOf(
    [allowAdmin, allowUserHimself],
    new ForbiddenError("Only admin or user himself is allowed.")
  ),
  async (req, res) => {
    const { currentUser } = req;
    res.send(currentUser);
  }
);

router.patch(
  "/:id",
  allowAdmin,
  validateRequest(updateRules),
  async (req, res) => {
    const { currentUser, body } = req;
    await currentUser.updateBody(body);
    res.send(currentUser);
  }
);

/**
 * check if logged in user is currentUser himself.
 * @param {express.Request & {user} & {currentUser}} req
 * @param {express.Response} _res
 * @param {express.NextFunction} next
 */
function allowUserHimself(req, _res, next) {
  const { user, currentUser } = req;
  if (currentUser.id.toString() !== user.id)
    throw new ForbiddenError("Only user himself is allowed.");
  next();
}

module.exports = router;
