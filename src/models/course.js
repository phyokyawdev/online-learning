const mongoose = require("mongoose");
const { User } = require("./user");

/**
 * Course
 * ======
 * title
 * content
 *
 * lectures
 * teacher
 */
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  lectures: {
    type: [String],
    required: true,
  },
  teacher: {
    type: mongoose.Types.ObjectId,
    ref: User,
    required: true,
  },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = { Course };
