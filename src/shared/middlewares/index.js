/**
 * middlewares
 */

const auth = require("./auth");
const authThenHandleCourseId = require("./auth-then-handle-courseId");
const allowAdmin = require("./allow-admin");
const allowTeacher = require("./allow-teacher");
const allowCourseOwner = require("./allow-course-owner");
const errorHandler = require("./error-handler");
const validatePath = require("./validate-path");
const validateRequest = require("./validate-request");

module.exports = {
  auth,
  authThenHandleCourseId,
  allowAdmin,
  allowTeacher,
  allowCourseOwner,
  errorHandler,
  validatePath,
  validateRequest,
};
