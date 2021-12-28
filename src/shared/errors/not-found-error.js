const ClientError = require("./client-error");

class NotFoundError extends ClientError {
  constructor(message = "Not Found") {
    super(404, message);
    this.name = "NotFoundError";
  }
}

module.exports = NotFoundError;
