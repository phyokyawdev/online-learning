const ClientError = require("./client-error");

class BadRequestError extends ClientError {
  constructor(message = "Bad Request") {
    super(400, message);
    this.name = "BadRequestError";
  }
}

module.exports = BadRequestError;
