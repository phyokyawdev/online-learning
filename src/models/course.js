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
    cover_photo_link: {
      type: String,
    },
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
        delete ret.__v;
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
  await Tag.populate(doc, { path: "tags" });
});

/** Static Methods */
courseSchema.statics.removeTagFromCourses = async function (tag, courses) {
  await this.updateMany(
    { _id: { $in: courses } },
    { $pullAll: { tags: [tag] } }
  );
};

courseSchema.statics.create = async function (body, teacher) {
  const { cover_photo_link, title, content, tags } = body;
  const course = new this({ cover_photo_link, title, content, tags, teacher });
  await course.save();
  return course;
};

courseSchema.statics.findByQuery = async function (query) {
  const { offset, limit, tags, teacher, search } = query;
  let findParam = {};
  if (tags) findParam.tags = { $in: tags };
  if (teacher) findParam.teacher = teacher;
  if (search) findParam.title = { $regex: ".*" + search + ".*" };

  const courses = await this.find(findParam)
    .skip(offset)
    .limit(limit)
    .populate("tags");
  return courses;
};

courseSchema.statics.findByIdString = async function (id) {
  if (!mongoose.isValidObjectId(id)) return false;
  const course = await this.findById(id).populate("tags");
  return course;
};

/** Instance Methods */
courseSchema.methods.updateBody = async function (body) {
  const { cover_photo_link, title, content, tags } = body;
  this.cover_photo_link = cover_photo_link;
  this.title = title;
  this.content = content;
  this.tags = tags;
  const course = await this.save();
  return course;
};

courseSchema.methods.isOwner = function (id) {
  return this.teacher.toString() === id;
};

const Course = mongoose.model("Course", courseSchema);

/** Custom Helper Functions */
const removeDuplicatesInArray = (values) => [...new Set(values)];

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
    .isArray({ min: 1 })
    .bail()
    .customSanitizer(removeDuplicatesInArray),
  query("tags.*")
    .optional()
    .custom(objectIdValidator)
    .bail()
    .custom(tagValidator),
  query("search").optional({ checkFalsy: true }).isString(),
];

module.exports = { Course, createRules, readRules };
