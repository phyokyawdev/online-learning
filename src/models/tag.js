const mongoose = require("mongoose");
const { body, query } = require("express-validator");

/**
 * Tag
 * ===
 * name
 *
 * courses
 */
const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 35,
      unique: true,
    },
    courses: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Course",
    },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

tagSchema.statics.isExistingTagName = async function (name) {
  const tag = await this.findOne({ name });
  if (!tag) return false;
  return true;
};

const Tag = mongoose.model("Tag", tagSchema);

/** Validation rules */
const createRules = [
  body("name")
    .trim()
    .not()
    .isEmpty()
    .bail()
    .isAlpha()
    .toLowerCase()
    .isLength({ max: 35 }),
];

const readRules = [
  query("offset").customSanitizer(parseInt).default(0),
  query("limit").customSanitizer(parseInt).default(20),
];

module.exports = { Tag, createRules, readRules };
