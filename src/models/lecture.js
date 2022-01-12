const mongoose = require("mongoose");
const { body } = require("express-validator");

/**
 * Lecture
 * =======
 * index
 * title
 * url
 *
 * course
 * teacher
 */
const lectureSchema = new mongoose.Schema(
  {
    index: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
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

lectureSchema.statics.create = async function (body, course, teacher) {
  const { index, title, url } = body;
  let lecture = new this({ index, title, url, course, teacher });
  lecture = await lecture.save();
  return lecture;
};

lectureSchema.statics.findByIdString = async function (id) {
  if (!mongoose.isValidObjectId(id)) return false;
  const lecture = await this.findById(id);
  if (!lecture) return false;
  return lecture;
};

lectureSchema.methods.updateBody = async function (body) {
  const { index, title, url } = body;
  this.index = index;
  this.title = title;
  this.url = url;
  await this.save();
};

const Lecture = mongoose.model("Lecture", lectureSchema);

/** Request Validation Rules */
const createRules = [
  body("index").isNumeric(),
  body("title").isString().trim().notEmpty(),
  body("url").isURL(),
];

module.exports = { Lecture, createRules };
