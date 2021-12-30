const mongoose = require("mongoose");
const { AssignmentQuestion } = require("./assignment_question");
const { UserCourse } = require("./user_course");

/**
 * AssignmentAnswer
 * =======================
 * answer
 * date
 * score
 *
 * user_course
 * assignment_question
 */
const assignmentAnswerSchema = new mongoose.Schema({
  answer: {
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
  user_course: {
    type: mongoose.Types.ObjectId,
    ref: UserCourse,
    required: true,
  },
  assignment_question: {
    type: mongoose.Types.ObjectId,
    ref: AssignmentQuestion,
    required: true,
  },
});

const AssignmentAnswer = mongoose.model(
  "AssignmentAnswer",
  assignmentAnswerSchema
);

module.exports = { AssignmentAnswer };
