const express = require("express");
const router = express.Router();

const readRouter = require("./read");
const updateRouter = require("./update");

router.use(readRouter);
router.use(updateRouter);

module.exports = router;
