/**
 * middlewares
 */

const auth = require("./auth");
const errorHandler = require("./error-handler");
const validateRequest = require("./validate-request");

module.exports = { auth, errorHandler, validateRequest };
