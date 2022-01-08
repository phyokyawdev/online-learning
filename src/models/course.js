const mongoose = require("mongoose");
const { body, query } = require("express-validator");
const { objectIdValidator } = require("@shared/services/object-id");
const { Tag, tagValidator } = require("./tag");
const { teacherValidator } = require("./user");

/**
 * Course
 * ======
 * title
 * content
 *
 * tags
 * teacher
 */
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Tag",
      required: true,
      set: function (tags) {
        this._previousTags = this.tags;
        return tags;
      },
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

courseSchema.pre("save", async function (next) {
  if (this.isNew) {
    await Tag.addCourseToTags(this, this.tags);
    return next();
  }

  if (this.isModified("tags")) {
    await Tag.removeCourseFromTags(this, this._previousTags);
    await Tag.addCourseToTags(this, this.tags);
  }
  next();
});

courseSchema.pre("remove", async function (next) {
  await Tag.removeCourseFromTags(this, this.tags);
  next();
});

courseSchema.post("save", async function (doc) {
  const course = await Tag.populate(doc, { path: "tags" });
});

courseSchema.methods.isOwner = function (id) {
  return this.teacher.toString() === id;
};

const Course = mongoose.model("Course", courseSchema);

/** Custom Helper Functions */

const removeDuplicatesInArray = (values) => [...new Set(values)];

const convertStringToArray = (values) => {
  if (Array.isArray(values)) return values;
  return [values];
};

/** Validation Rules */

const createRules = [
  body("title").trim().not().isEmpty(),
  body("content").trim().not().isEmpty(),
  body("tags")
    .isArray({ min: 1, max: 10 })
    .bail()
    .customSanitizer(removeDuplicatesInArray),
  body("tags.*").custom(objectIdValidator).bail().custom(tagValidator),
];

/**
 * express query string parser has problem,
 * one element array is being parsed as string
 * */
const readRules = [
  query("offset").customSanitizer(parseInt).default(0),
  query("limit").customSanitizer(parseInt).default(10),
  query("teacher")
    .optional()
    .custom(objectIdValidator)
    .bail()
    .custom(teacherValidator),
  query("tags")
    .optional()
    .customSanitizer(convertStringToArray)
    .customSanitizer(removeDuplicatesInArray),
  query("tags.*")
    .optional()
    .custom(objectIdValidator)
    .bail()
    .custom(tagValidator),
  query("search").optional({ checkFalsy: true }).isString(),
];

module.exports = { Course, createRules, readRules };
