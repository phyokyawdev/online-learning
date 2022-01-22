/**
 * middlewares
 */

const auth = require("./auth");
const allowAdmin = require("./allow-admin");
const allowTeacher = require("./allow-teacher");
const allowCourseOwner = require("./allow-course-owner");
const allowCourseEnrolled = require("./allow-course-enrolled");
const oneOf = require("./one-of");
const errorHandler = require("./error-handler");
const validateRequest = require("./validate-request");

module.exports = {
  auth,
  allowAdmin,
  allowTeacher,
  allowCourseOwner,
  allowCourseEnrolled,
  oneOf,
  errorHandler,
  validateRequest,
};
