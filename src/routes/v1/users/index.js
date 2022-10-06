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
const { setAuthTokenToRequest } = require("@shared/services/auth-token");
const { signUploadWidget } = require("@shared/services/file-storage");
const { CLOUDINARY_HOST, CLOUDINARY_API_KEY } = process.env;

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
    await currentUser.updateUserRole(body);
    res.send(currentUser);
  }
);

/**
 *  return signed photo upload data
 */
router.get("/:id/profile-image-upload", allowUserHimself, async (req, res) => {
  const folder = "online-learning/profile_image";
  const sig = signUploadWidget({ folder });

  const signedUploadData = {
    url: `https://api.cloudinary.com/v1_1/${CLOUDINARY_HOST}/image/upload`,
    api_key: CLOUDINARY_API_KEY,
    folder,
    timestamp: sig.timestamp,
    signature: sig.signature,
  };

  res.send(signedUploadData);
});

// update user userinfo
router.patch("/:id/userinfo", allowUserHimself, async (req, res) => {
  const { currentUser, body } = req;
  const { profile_link, headline, bio, socials } = body;
  await currentUser.updateUserInfo(profile_link, headline, bio, socials);

  // update cookie
  const token = await currentUser.generateAuthToken();
  setAuthTokenToRequest(req, token);

  res.send(currentUser);
});

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
