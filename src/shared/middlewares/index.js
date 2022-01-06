/**
 * middlewares
 */

const auth = require("./auth");
const allowAdmin = require("./allow-admin");
const allowTeacher = require("./allow-teacher");
const errorHandler = require("./error-handler");
const validatePath = require("./validate-path");
const validateRequest = require("./validate-request");

module.exports = {
  auth,
  allowAdmin,
  allowTeacher,
  errorHandler,
  validatePath,
  validateRequest,
};
