const mongoose = require("mongoose");

function isValidObjectId(id) {
  return mongoose.isValidObjectId(id);
}

function createNewObjectId() {
  return new mongoose.Types.ObjectId();
}

function objectIdValidator(value) {
  if (!isValidObjectId(value)) throw new Error("Invalid object id.");
  return true;
}

module.exports = { isValidObjectId, createNewObjectId, objectIdValidator };
