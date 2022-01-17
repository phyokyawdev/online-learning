const { body, query } = require("express-validator");
const mongoose = require("mongoose");

/**
 * AssignmentAnswer
 * ================
 * answer
 * date
 * score
 *
 * student
 * assignment_question
 */
const answerSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: new Date(),
      required: true,
    },
    score: {
      type: Number,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseStudent",
      required: true,
    },
    assignment_question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssignmentQuestion",
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

answerSchema.index({ student: 1, assignment_question: 1 }, { unique: true });

/** Static methods */
answerSchema.statics.findByIdString = async function (id) {
  if (!mongoose.isValidObjectId(id)) return false;
  const answer = await this.findById(id);
  return answer;
};

answerSchema.statics.isExisting = async function (
  student,
  assignment_question
) {
  const answer = await this.findOne({ student, assignment_question });
  if (!answer) return false;
  return answer;
};

answerSchema.statics.create = async function (
  body,
  student,
  assignment_question
) {
  const { content } = body;
  const answer = new this({ content, student, assignment_question });
  await answer.save();
  return answer;
};

answerSchema.statics.findByQuery = async function (query, assignment_question) {
  const { offset, limit } = query;
  const answers = await this.find({ assignment_question })
    .skip(offset)
    .limit(limit);
  return answers;
};

/** Instance methods */
answerSchema.methods.updateBody = async function (body) {
  const { score } = body;
  this.score = score;
  await this.save();
  return this;
};

const AssignmentAnswer = mongoose.model("AssignmentAnswer", answerSchema);

/** Validation rules */
const createRules = [body("content").isString().trim().notEmpty()];

const readRules = [
  query("offset").customSanitizer(parseInt).default(0),
  query("limit").customSanitizer(parseInt).default(10),
];

const updateRules = [body("score").isNumeric()];

module.exports = { AssignmentAnswer, createRules, readRules, updateRules };
