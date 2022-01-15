const { body } = require("express-validator");
const mongoose = require("mongoose");

/**
 * AssignmentQuestion
 * ==========
 * index
 * title
 * content
 *
 * course
 */
const questionSchema = new mongoose.Schema(
  {
    index: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
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

/** Static methods */
questionSchema.statics.findByIdString = async function (id) {
  if (!mongoose.isValidObjectId(id)) return false;
  const question = await this.findById(id);
  return question;
};

questionSchema.statics.create = async function (body, course) {
  const { index, title, content } = body;
  const question = new this({ index, title, content, course });
  await question.save();
  return question;
};

questionSchema.statics.findByQuery = async function (query, course) {
  const questions = await this.find({ course });
  return questions;
};

/** Instance methods */
questionSchema.methods.updateBody = async function (body) {
  const { index, title, content } = body;
  this.index = index;
  this.title = title;
  this.content = content;
  await this.save();
  return this;
};

const AssignmentQuestion = mongoose.model("AssignmentQuestion", questionSchema);

/** Validation rules */
const createRules = [
  body("index").isNumeric(),
  body("title").isString().trim().notEmpty(),
  body("content").isString().trim().notEmpty(),
];

module.exports = { AssignmentQuestion, createRules };
