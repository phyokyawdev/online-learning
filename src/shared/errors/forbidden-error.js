const ClientError = require("./client-error");

class ForbiddenError extends ClientError {
  constructor(message = "Forbidden") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

module.exports = ForbiddenError;
