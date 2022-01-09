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
      default: [],
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

tagSchema.pre("remove", async function (next) {
  await mongoose.model("Course").removeTagFromCourses(this, this.courses);
  next();
});

tagSchema.statics.isExistingTagName = async function (name) {
  const tag = await this.findOne({ name });
  if (!tag) return false;
  return true;
};

tagSchema.statics.addCourseToTags = async function (course, tags) {
  await this.updateMany({ _id: { $in: tags } }, { $push: { courses: course } });
};

tagSchema.statics.removeCourseFromTags = async function (course, tags) {
  await this.updateMany(
    { _id: { $in: tags } },
    { $pullAll: { courses: [course] } }
  );
};

const Tag = mongoose.model("Tag", tagSchema);

/** Validation rules */
const createRules = [
  body("name")
    .isString()
    .trim()
    .notEmpty()
    .bail()
    .isAlpha()
    .toLowerCase()
    .isLength({ max: 35 }),
];

const readRules = [
  query("offset").customSanitizer(parseInt).default(0),
  query("limit").customSanitizer(parseInt).default(20),
  query("search").optional({ checkFalsy: true }).isString().toLowerCase(),
];

/** Custom validators */
const tagValidator = async (id) => {
  const tag = await Tag.findById(id);
  if (!tag) throw new Error("Tag not exist.");
  return true;
};

module.exports = { Tag, createRules, readRules, tagValidator };
