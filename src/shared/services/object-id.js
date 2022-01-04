const mongoose = require("mongoose");

function isValidObjectId(id) {
  return mongoose.isValidObjectId(id);
}

function createNewObjectId() {
  return new mongoose.Schema.Types.ObjectId();
}

module.exports = { isValidObjectId, createNewObjectId };
