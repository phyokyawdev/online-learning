const BadRequestError = require("./bad-request-error");

class ValidationError extends BadRequestError {
  constructor(errors = []) {
    super("Validation Error");
    this.name = "ValidationError";
    this.details = errors;
  }

  serialize() {
    return this.details;
  }
}

module.exports = ValidationError;
