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
const courseStudentSchema = new mongoose.Schema(
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
        return ret;
      },
    },
  }
);

courseStudentSchema.index({ token: 1, course: 1 }, { unique: true });

courseStudentSchema.statics.findByIdString = async function (id) {
  if (!mongoose.isValidObjectId(id)) return false;
  return this.findById(id);
};

courseStudentSchema.statics.findByQuery = async function (query, course) {
  const { offset, limit, enrolled } = query;

  let findParams = {};
  findParams.course = course;
  if (enrolled !== undefined)
    findParams.user = enrolled === true ? { $ne: null } : null;

  const students = await this.find(findParams).skip(offset).limit(limit);
  return students;
};

courseStudentSchema.statics.create = async function (body, course) {
  const { token, lecture_access_deadline } = body;
  let student = new this({ token, lecture_access_deadline, course });
  student = await student.save();
  return student;
};

courseStudentSchema.statics.enrollUser = async function (
  user_id,
  body,
  course
) {
  const { token } = body;
  let student = await this.findOne({ course: course, token: token });
  if (!student) return false;

  if (student.user) return false;

  student.user = user_id;
  student = await student.save();
  return student;
};

courseStudentSchema.methods.updateDefinedFields = async function (body) {
  const { lecture_access_deadline, completed, credit } = body;

  if (lecture_access_deadline)
    this.lecture_access_deadline = lecture_access_deadline;
  if (completed) this.completed = completed;
  if (credit) this.credit = credit;

  await this.save();
};

courseStudentSchema.methods.isStudentHimself = function (id) {
  return this.user && this.user.toString() === id;
};

const CourseStudent = mongoose.model("CourseStudent", courseStudentSchema);

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
