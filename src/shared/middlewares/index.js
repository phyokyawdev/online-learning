/**
 * middlewares
 */

const auth = require("./auth");
const allowAdmin = require("./allow-admin");
const allowTeacher = require("./allow-teacher");
const allowCourseOwner = require("./allow-course-owner");
const allowCourseStudent = require("./allow-course-student");
const allowLectureAccessibleStudent = require("./allow-lecture-accessible-student");
const oneOf = require("./one-of");
const errorHandler = require("./error-handler");
const validatePath = require("./validate-path");
const validateRequest = require("./validate-request");

module.exports = {
  auth,
  allowAdmin,
  allowTeacher,
  allowCourseOwner,
  allowCourseStudent,
  allowLectureAccessibleStudent,
  oneOf,
  errorHandler,
  validatePath,
  validateRequest,
};
