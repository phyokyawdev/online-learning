const mongoose = require("mongoose");
const { Course } = require("./course");
const { User } = require("./user");

/**
 * UserCourse
 * =============
 * token
 * lecture_access_deadline
 * completed
 * credit
 *
 * user
 * course
 *
 * isLectureAccessible()
 * isTokenUsed()
 */
const userCourseSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  lecture_access_deadline: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  credit: {
    type: Number,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: User,
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref: Course,
    required: true,
  },
});

const UserCourse = mongoose.model("UserCourse", userCourseSchema);

module.exports = { UserCourse };
