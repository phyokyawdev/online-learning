/**
 * middlewares
 */

const auth = require("./auth");
const allowAdmin = require("./allow-admin");
const errorHandler = require("./error-handler");
const validateRequest = require("./validate-request");

module.exports = { auth, allowAdmin, errorHandler, validateRequest };
