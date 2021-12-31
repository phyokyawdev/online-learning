const mongoose = require("mongoose");
const { Course } = require("@models/course");

/**
 * AssignmentQuestion
 * ==========
 * question
 * deadline
 *
 * course
 */
const assignmentQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref: Course,
    required: true,
  },
});

const AssignmentQuestion = mongoose.model(
  "AssignmentQuestion",
  assignmentQuestionSchema
);

module.exports = { AssignmentQuestion };
