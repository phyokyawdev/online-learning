/**
 * middlewares
 */

const auth = require("./auth");
const allowAdmin = require("./allow-admin");
const allowTeacher = require("./allow-teacher");
const allowCourseOwner = require("./allow-course-owner");
const allowLectureAccessibleStudent = require("./allow-lecture-accessible-student");
const allowStudentHimself = require("./allow-student-himself");
const oneOf = require("./one-of");
const errorHandler = require("./error-handler");
const validatePath = require("./validate-path");
const validateRequest = require("./validate-request");

module.exports = {
  auth,
  allowAdmin,
  allowTeacher,
  allowCourseOwner,
  allowLectureAccessibleStudent,
  allowStudentHimself,
  oneOf,
  errorHandler,
  validatePath,
  validateRequest,
};
