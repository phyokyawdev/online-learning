const ClientError = require("./client-error");

class NotAuthorizedError extends ClientError {
  constructor(message = "Not Authorized") {
    super(401, message);
    this.name = "NotAuthorizedError";
  }
}

module.exports = NotAuthorizedError;
