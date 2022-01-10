const express = require("express");
const router = express.Router();

const createRouter = require("./create");
const updateRouter = require("./update");
const deleteRouter = require("./delete");

router.use(createRouter);
router.use(updateRouter);
router.use(deleteRouter);

module.exports = router;
