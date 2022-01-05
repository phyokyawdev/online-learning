const express = require("express");
const router = express.Router();

const createRouter = require("./create");
const readRouter = require("./read");
const deleteRouter = require("./delete");

router.use(createRouter);
router.use(readRouter);
router.use(deleteRouter);

module.exports = router;
