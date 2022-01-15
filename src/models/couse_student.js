const { isPast } = require("date-fns");
const { body, query } = require("express-validator");
const mongoose = require("mongoose");

/**
 * UserCourse
 * =============
 * token
 * lecture_access_deadline(or should be duration)
 * completed*
 * credit*
 *
 * user*
 * course
 */
const studentSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
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

studentSchema.index({ token: 1, course: 1 }, { unique: true });

/** Static methods */
studentSchema.statics.findByIdString = async function (id) {
  if (!mongoose.isValidObjectId(id)) return false;
  const student = await this.findById(id);
  return student;
};

studentSchema.statics.create = async function (body, course) {
  const { token, lecture_access_deadline } = body;
  let student = new this({ token, lecture_access_deadline, course });
  student = await student.save();
  return student;
};

studentSchema.statics.findByQuery = async function (query, course) {
  const { offset, limit, enrolled } = query;
  let findParams = {};
  findParams.course = course;
  if (enrolled !== undefined)
    findParams.user = enrolled === true ? { $ne: null } : null;

  const students = await this.find(findParams).skip(offset).limit(limit);
  return students;
};

studentSchema.statics.findByToken = async function (body, course) {
  const { token } = body;
  const student = await this.findOne({ token, course });
  return student;
};

studentSchema.statics.isLectureAccessible = async function (user, course) {
  const student = await this.findOne({ user, course });
  if (!student) return false;
  if (isPast(student.lecture_access_deadline)) return false;
  return true;
};

studentSchema.statics.findByUserAndCourse = async function (user, course) {
  const student = await this.findOne({ user, course });
  return student;
};

/** Instance methods */
studentSchema.methods.updateBody = async function (body) {
  const { lecture_access_deadline, completed, credit } = body;
  if (lecture_access_deadline)
    this.lecture_access_deadline = lecture_access_deadline;
  if (completed) this.completed = completed;
  if (credit) this.credit = credit;
  await this.save();
};

studentSchema.methods.isTokenUsed = function () {
  return this.user;
};

studentSchema.methods.enroll = async function (user) {
  this.user = user;
  await this.save();
};

studentSchema.methods.isStudentHimself = function (id) {
  return this.user && this.user.toString() === id;
};

const CourseStudent = mongoose.model("CourseStudent", studentSchema);

/** Request Validation Rules */
const createRules = [
  body("token").isString().trim().notEmpty(),
  body("lecture_access_deadline").isDate(),
];

const updateRules = [
  body("lecture_access_deadline").optional().isDate(),
  body("completed").optional().isBoolean(),
  body("credit").optional().isNumeric(),
];

const readRules = [
  query("offset").customSanitizer(parseInt).default(0),
  query("limit").customSanitizer(parseInt).default(10),
  query("enrolled").optional().isBoolean(),
];

const enrollRules = [body("token").isString().trim().notEmpty()];

module.exports = {
  CourseStudent,
  createRules,
  updateRules,
  readRules,
  enrollRules,
};
