const BadRequestError = require("./bad-request-error");
const ClientError = require("./client-error");
const ConflictError = require("./conflict-error");
const ForbiddenError = require("./forbidden-error");
const NotAuthorizedError = require("./not-authorized-error");
const NotFoundError = require("./not-found-error");
const ValidationError = require("./validation-error");

module.exports = {
  BadRequestError,
  ClientError,
  ConflictError,
  ForbiddenError,
  NotAuthorizedError,
  NotFoundError,
  ValidationError,
};
